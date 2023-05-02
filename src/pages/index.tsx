import { useState } from 'react';
import styles from './index.module.css';

const Home = () => {
  const defaultBoard: number[][] = [
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, -1, 0, 0, 0],
    [0, 0, 0, 1, 2, -1, 0, 0],
    [0, 0, -1, 2, 1, 0, 0, 0],
    [0, 0, 0, -1, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
  ];

  const dirList: number[][] = [
    // 八方を-1,0,1で表現
    [0, -1],
    [1, 0],
    [0, 1],
    [-1, 0],
    [-1, -1],
    [1, -1],
    [1, 1],
    [-1, 1],
  ];

  const [board, setBoard] = useState(defaultBoard);
  const [turnColor, setTurnColor] = useState(1);
  const [passCount, setPassCount] = useState(0);

  const reverseDisc = (x: number, y: number, nBoard: number[][]) => {
    for (const dir of dirList) {
      const terms =
        dir[0] === 0 || dir[1] === 0
          ? Math.max(
              Math.max(-x * dir[0], (7 - x) * dir[0]),
              Math.max(-y * dir[1], (7 - y) * dir[1])
            )
          : Math.min(
              Math.max(-x * dir[0], (7 - x) * dir[0]),
              Math.max(-y * dir[1], (7 - y) * dir[1])
            );
      for (let i = 1; i <= terms && board[y][x] <= 0; i++) {
        if (i >= 2 && board[y + i * dir[1]][x + i * dir[0]] === turnColor) {
          // 2以上進んでかつ同じ色が来たら止める
          for (let j = 0; j <= i; j++) {
            nBoard[y + j * dir[1]][x + j * dir[0]] = turnColor;
          }
          setTurnColor(3 - turnColor);
          setPassCount(0);
          break;
        } else if (
          board[y + i * dir[1]][x + i * dir[0]] <= 0 ||
          (i === 1 && board[y + 1 * dir[1]][x + 1 * dir[0]] === turnColor)
        ) {
          // 何も石がないマスに来たら止まる
          break;
        }
        // 自分と違う色なら繰り返す
      }
    }
  };

  const countColor = (color: number, board: number[][]) => {
    let i = 0;
    for (const row of board) {
      i += row.filter((n) => n === color).length;
    }
    return i;
  };

  const resetGame = () => {
    setBoard(defaultBoard);
    setPassCount(0);
    setTurnColor(1);
  };

  const changeTurn = (turn: number, passCount: number) => {
    setTurnColor(3 - turn);
    setTimeout(() => {
      if (
        passCount >= 1 &&
        confirm(
          `ゲームが終了しました！\n${
            winner() === 0 ? '勝負は引き分けです' : `勝者は${winner() === 1 ? '黒' : '白'}です`
          }\nゲームを終了しますか?`
        )
      ) {
        resetGame();
      }
    }, 10);
  };

  const winner = () => {
    const c1 = countColor(1, board);
    const c2 = countColor(2, board);
    if (c1 === c2) {
      return 0;
    } else if (c1 > c2) {
      return 1;
    } else {
      return 2;
    }
  };

  const checkCanPut = (newBoard: number[][], turnColor: number) => {
    for (let i = 0; i < 64; i++) {
      const x: number = i % 8;
      const y: number = (i - (i % 8)) / 8;
      if (newBoard[y][x] === -1) {
        newBoard[y][x] = 0;
      }
      for (const dir of dirList) {
        const terms =
          dir[0] === 0 || dir[1] === 0
            ? // 各方向に何マス進めるか
              Math.max(
                Math.max(-x * dir[0], (7 - x) * dir[0]),
                Math.max(-y * dir[1], (7 - y) * dir[1])
              )
            : Math.min(
                Math.max(-x * dir[0], (7 - x) * dir[0]),
                Math.max(-y * dir[1], (7 - y) * dir[1])
              );
        for (let i = 1; i <= terms && newBoard[y][x] <= 0; i++) {
          if (i >= 2 && newBoard[y + i * dir[1]][x + i * dir[0]] === turnColor) {
            // 2以上進んでかつ同じ色が来たら止める
            newBoard[y][x] = -1;
            break;
          } else if (
            newBoard[y + i * dir[1]][x + i * dir[0]] <= 0 ||
            (newBoard[y + dir[1]][x + dir[0]] === turnColor && i === 1)
          ) {
            // 何も石がないマスに来たら止まる または
            // 1回目に同じ色が来たら止める
            break;
          }
          // 自分と違う色なら繰り返す
        }
      }
    }
  };

  const clickCell = (x: number, y: number) => {
    if (board[y][x] === -1) {
      const newBoard: number[][] = JSON.parse(JSON.stringify(board));
      reverseDisc(x, y, newBoard);
      checkCanPut(newBoard, 3 - turnColor);
      setBoard(newBoard);
      if (countColor(-1, newBoard) === 0) {
        changeTurn(3 - turnColor, passCount);
        checkCanPut(newBoard, 3 - turnColor);
        if (countColor(-1, newBoard) === 0) {
          changeTurn(turnColor, passCount + 1);
          checkCanPut(newBoard, 3 - turnColor);
        }
      }
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.board}>
        {board.map((row, y) =>
          row.map((color, x) => (
            <div className={styles.cell} key={`${x}_${y}`} onClick={() => clickCell(x, y)}>
              {color > 0 && (
                <div
                  className={styles.disc}
                  style={{ backgroundColor: color === 1 ? '#000' : '#fff' }}
                />
              )}
              {color === -1 && <div className={styles.suggest} />}
            </div>
          ))
        )}
      </div>
      <p>今のターンは{turnColor - 1 ? '白' : '黒'}です</p>
      <p>
        黒: {countColor(1, board)} 白: {countColor(2, board)}
      </p>
      <button onClick={() => changeTurn(turnColor, passCount)}>パス</button>
      <button onClick={resetGame}>リセットゲーム</button>
    </div>
  );
};

export default Home;
