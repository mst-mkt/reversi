import { useState } from 'react';
import styles from './index.module.css';

const Home = () => {
  const defaultBoard: Array<Array<number>> = [
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, -1, 0, 0, 0],
    [0, 0, 0, 1, 2, -1, 0, 0],
    [0, 0, -1, 2, 1, 0, 0, 0],
    [0, 0, 0, -1, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
  ];

  const dirList: Array<Array<number>> = [
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
      console.log(terms);
      for (let i = 1; i < terms; i++) {
        if (i >= 2 && board[y + i * dir[1]][x + i * dir[0]] === turnColor) {
          // 2以上進んでかつ同じ色が来たら止める
          for (let j = 0; j <= i; j++) {
            nBoard[y + j * dir[1]][x + j * dir[0]] = turnColor;
          }
          setTurnColor(3 - turnColor);
          setPassCount(0);
          break;
        } else if (board[y + i * dir[1]][x + i * dir[0]] <= 0) {
          // 何も石がないマスに来たら止まる
          break;
        }
        // 自分と違う色なら繰り返す
      }
    }
    return nBoard;
  };

  const countColor = (color: number) => {
    let i = 0;
    board.forEach((array) => {
      i += array.filter((n) => n === color).length;
    });
    return i;
  };

  const resetGame = () => {
    setBoard(defaultBoard);
    setPassCount(0);
    setTurnColor(1);
  };

  const changeTurn = () => {
    setTurnColor(3 - turnColor);
    setPassCount(passCount + 1);
    if (
      passCount > 0 &&
      confirm(
        `ゲームが終了しました！\n${
          winner() === 0 ? '勝負は引き分けです' : `勝者は${winner() === 1 ? '黒' : '白'}です`
        }\nゲームを終了しますか?`
      )
    ) {
      resetGame;
    }
  };

  const winner = () => {
    const c1 = countColor(1);
    const c2 = countColor(2);
    if (c1 === c2) {
      return 0;
    } else if (c1 > c2) {
      return 1;
    } else {
      return 2;
    }
  };

  const checkCanPut = (nBoard: number[][]) => {
    for (let i = 0; i < 64; i++) {
      const newBoard: Array<Array<number>> = JSON.parse(JSON.stringify(board));
      const x: number = i % 8;
      const y: number = (i - (i % 8)) / 8;
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
        console.log(terms);
        for (let i = 1; i < terms; i++) {
          if (i >= 2 && board[y + i * dir[1]][x + i * dir[0]] === turnColor) {
            // 2以上進んでかつ同じ色が来たら止める
            newBoard[x][y] = -1;
            break;
          } else if (board[y + i * dir[1]][x + i * dir[0]] <= 0) {
            // 何も石がないマスに来たら止まる
            break;
          }
          // 自分と違う色なら繰り返す
        }
      }
    }
    return nBoard;
  };

  const clickCell = (x: number, y: number) => {
    let newBoard: Array<Array<number>> = JSON.parse(JSON.stringify(board));
    if (board[y][x] === -1) {
      newBoard = reverseDisc(x, y, newBoard);
      newBoard = checkCanPut(newBoard);
      setBoard(newBoard);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.board}>
        {board.map((row, y) =>
          row.map((color, x) => (
            <div
              className={styles.cell}
              key={`${x}_${y}`}
              style={{ borderColor: color === -1 ? '#ff0' : '#000' }}
              onClick={() => clickCell(x, y)}
            >
              {color > 0 && (
                <div
                  className={styles.disc}
                  style={{ backgroundColor: color === 1 ? '#000' : '#fff' }}
                />
              )}
              {color}
            </div>
          ))
        )}
      </div>
      <p>今のターンは{turnColor - 1 ? '白' : '黒'}です</p>
      <p>
        黒: {countColor(1)} 白: {countColor(2)}
      </p>
      <button onClick={changeTurn}>パス</button>
      <button onClick={resetGame}>リセットゲーム</button>
    </div>
  );
};

export default Home;
