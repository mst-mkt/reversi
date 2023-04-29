import { useState } from 'react';
import styles from './index.module.css';

const Home = () => {
  const defaultBoard = [
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 1, 2, 0, 0, 0],
    [0, 0, 0, 2, 1, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
  ];
  // prettier-ignore
  const [board, setBoard] = useState(defaultBoard);

  const [turnColor, setTurnColor] = useState(1);
  const [passCount, setPassCount] = useState(0);

  const countColor = (color: number) => {
    let i = 0;
    board.forEach((array) => {
      i += array.filter((n) => n === color).length;
    });
    return i;
  };

  const checkCanPlace = (i: number, x1: number, y1: number, dirList: Array<Array<number>>) => {
    const x2 = i % 8;
    const y2 = (i - (i % 8)) / 8;
    for (const dir of dirList) {
      const n = Math.min(
        Math.max(-x1 * dir[0], (7 - x1) * dir[0]),
        Math.max(-y1 * dir[1], (7 - y1) * dir[1])
      );
      for (let k = 1; k <= n; i++) {
        if (board[y1 + k * dir[1]][x1 + k * dir[0]] === 1 && board[y1][x1] <= 0 && n !== 0) {
          board[y2][x2] = -1;
          return true;
        } else if (board[y1 + k * dir[1]][x1 + k * dir[0]] <= 0) {
          return true;
        }
      }
    }
  };

  const checkCanPlaceAll = (
    x: number,
    y: number,
    dirList: Array<Array<number>>,
    board: Array<Array<number>>
  ) => {
    for (let i = 0; i < 64; i++) {
      if (checkCanPlace(i, x, y, dirList)) {
        break;
      }
    }
    return board;
  };

  const clickCell = (x: number, y: number) => {
    const newBoard = JSON.parse(JSON.stringify(board));
    const dirList: Array<Array<number>> = [
      [0, -1],
      [1, 0],
      [0, 1],
      [-1, 0],
      [-1, -1],
      [1, -1],
      [1, 1],
      [-1, 1],
    ];
    // 上方
    for (let i = 1; i <= y; i++) {
      if (board[y - i][x] === turnColor && board[y][x] <= 0) {
        for (let j = 0; j < i; j++) {
          if (i !== 1) {
            newBoard[y - j][x] = turnColor;
            setTurnColor(3 - turnColor);
            setPassCount(0);
          }
        }
        break;
      } else if (board[y - i][x] <= 0) {
        break;
      }
    }
    // 下方
    for (let i = 1; i < 8 - y; i++) {
      if (board[y + i][x] === turnColor && board[y][x] <= 0) {
        for (let j = 0; j < i; j++) {
          if (i !== 1) {
            newBoard[y + j][x] = turnColor;
            setTurnColor(3 - turnColor);
            setPassCount(0);
          }
        }
        break;
      } else if (board[y + i][x] <= 0) {
        break;
      }
    }
    // 左方
    for (let i = 1; i <= x; i++) {
      if (board[y][x - i] === turnColor && board[y][x] <= 0) {
        for (let j = 0; j < i; j++) {
          if (i !== 1) {
            newBoard[y][x - j] = turnColor;
            setTurnColor(3 - turnColor);
            setPassCount(0);
          }
        }
        break;
      } else if (board[y][x - i] <= 0) {
        break;
      }
    }
    // 右方
    for (let i = 1; i < 8 - x; i++) {
      if (board[y][x + i] === turnColor && board[y][x] <= 0) {
        for (let j = 0; j < i; j++) {
          if (i !== 1) {
            newBoard[y][x + j] = turnColor;
            setTurnColor(3 - turnColor);
            setPassCount(0);
          }
        }
        break;
      } else if (board[y][x + i] <= 0) {
        break;
      }
    }
    // 左上
    for (let i = 1; i < Math.min(x, y); i++) {
      if (board[y - i][x - i] === turnColor && board[y][x] <= 0) {
        for (let j = 0; j < i; j++) {
          if (i !== 1) {
            newBoard[y - j][x - j] = turnColor;
            setTurnColor(3 - turnColor);
            setPassCount(0);
          }
        }
        break;
      } else if (board[y - i][x - i] <= 0) {
        break;
      }
    }
    // 右下
    for (let i = 1; i <= Math.min(7 - x, 7 - y); i++) {
      if (board[y + i][x + i] === turnColor && board[y][x] <= 0) {
        for (let j = 0; j < i; j++) {
          if (i !== 1) {
            newBoard[y + j][x + j] = turnColor;
            setTurnColor(3 - turnColor);
            setPassCount(0);
          }
        }
        break;
      } else if (board[y + i][x + i] <= 0) {
        break;
      }
    }
    // 右上
    for (let i = 1; i <= Math.min(7 - x, y); i++) {
      if (board[y - i][x + i] === turnColor && board[y][x] <= 0) {
        for (let j = 0; j < i; j++) {
          if (i !== 1) {
            newBoard[y - j][x + j] = turnColor;
            setTurnColor(3 - turnColor);
            setPassCount(0);
          }
        }
        break;
      } else if (board[y - i][x + i] <= 0) {
        break;
      }
    }
    // 左下
    for (let i = 1; i <= Math.min(x, 7 - y); i++) {
      if (board[y + i][x - i] === turnColor && board[y][x] <= 0) {
        for (let j = 0; j < i; j++) {
          if (i !== 1) {
            newBoard[y + j][x - j] = turnColor;
            setTurnColor(3 - turnColor);
            setPassCount(0);
          }
        }
        break;
      } else if (board[y + i][x - i] <= 0) {
        break;
      }
    }
    setBoard(checkCanPlaceAll(x, y, dirList, newBoard));
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
    console.log(passCount);
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

  const resetGame = () => {
    const newBoard = defaultBoard;
    setBoard(newBoard);
    setPassCount(0);
    setTurnColor(1);
  };

  return (
    <div className={styles.container}>
      <div className={styles.board}>
        {board.map((row, y) =>
          row.map((color, x) => (
            <div
              className={styles.cell}
              key={`${x}_${y}`}
              style={{ backgroundColor: color === -1 ? '#ff0' : '#0000' }}
              onClick={() => clickCell(x, y)}
            >
              {color !== 0 && (
                <div
                  className={styles.disc}
                  style={{ background: color === 1 ? '#000' : '#fff' }}
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
