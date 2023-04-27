import { useState } from 'react';
import styles from './index.module.css';

const Home = () => {
  // prettier-ignore
  const [board, setBoard] = useState([
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 1, 2, 0, 0, 0],
    [0, 0, 0, 2, 1, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0]
  ]);

  const [turnColor, setTurnColor] = useState(1);

  const clickCell = (x: number, y: number) => {
    const newBoard = JSON.parse(JSON.stringify(board));
    // 上方
    for (let i = 1; i < y; i++) {
      if (board[y - i][x] === turnColor && board[y][x] === 0) {
        for (let j = 0; j < i; j++) {
          if (i !== 1) {
            newBoard[y - j][x] = turnColor;
            setTurnColor(3 - turnColor);
          }
        }
        break;
      } else if (board[y - i][x] === 0) {
        break;
      }
    }
    // 下方
    for (let i = 1; i < 8 - y; i++) {
      if (board[y + i][x] === turnColor && board[y][x] === 0) {
        for (let j = 0; j < i; j++) {
          if (i !== 1) {
            newBoard[y + j][x] = turnColor;
            setTurnColor(3 - turnColor);
          }
        }
        break;
      } else if (board[y + i][x] === 0) {
        break;
      }
    }
    // 左方
    for (let i = 1; i < x; i++) {
      if (board[y][x - i] === turnColor && board[y][x] === 0) {
        for (let j = 0; j < i; j++) {
          if (i !== 1) {
            newBoard[y][x - j] = turnColor;
            setTurnColor(3 - turnColor);
          }
        }
        break;
      } else if (board[y][x - i] === 0) {
        break;
      }
    }
    // 右方
    for (let i = 1; i < 8 - x; i++) {
      if (board[y][x + i] === turnColor && board[y][x] === 0) {
        for (let j = 0; j < i; j++) {
          if (i !== 1) {
            newBoard[y][x + j] = turnColor;
            setTurnColor(3 - turnColor);
          }
        }
        break;
      } else if (board[y][x + i] === 0) {
        break;
      }
    }
    // 左上
    for (let i = 1; i < Math.min(x, y); i++) {
      if (board[y - i][x - i] === turnColor && board[y][x] === 0) {
        for (let j = 0; j < i; j++) {
          if (i !== 1) {
            newBoard[y - j][x - j] = turnColor;
            setTurnColor(3 - turnColor);
          }
        }
        break;
      } else if (board[y - i][x - i] === 0) {
        break;
      }
    }
    // 右下
    for (let i = 1; i < Math.min(8 - x, 8 - y); i++) {
      if (board[y + i][x + i] === turnColor && board[y][x] === 0) {
        for (let j = 0; j < i; j++) {
          if (i !== 1) {
            newBoard[y + j][x + j] = turnColor;
            setTurnColor(3 - turnColor);
          }
        }
        break;
      } else if (board[y + i][x + i] === 0) {
        break;
      }
    }
    // 右上
    for (let i = 1; i < Math.min(8 - x, y); i++) {
      if (board[y - i][x + i] === turnColor && board[y][x] === 0) {
        for (let j = 0; j < i; j++) {
          if (i !== 1) {
            newBoard[y - j][x + j] = turnColor;
            setTurnColor(3 - turnColor);
          }
        }
        break;
      } else if (board[y - i][x + i] === 0) {
        break;
      }
    }
    // 左下
    for (let i = 1; i < Math.min(x, 8 - y); i++) {
      if (board[y + i][x - i] === turnColor && board[y][x] === 0) {
        for (let j = 0; j < i; j++) {
          if (i !== 1) {
            newBoard[y + j][x - j] = turnColor;
            setTurnColor(3 - turnColor);
          }
        }
        break;
      } else if (board[y + i][x - i] === 0) {
        break;
      }
    }
    setBoard(newBoard);
  };

  return (
    <div className={styles.container}>
      <div className={styles.board}>
        {board.map((row, y) =>
          row.map((cell, x) => (
            <div className={styles.cell} key={`${x}_${y}`} onClick={() => clickCell(x, y)}>
              {cell !== 0 && (
                <div className={styles.disc} style={{ background: cell === 1 ? '#000' : '#fff' }} />
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Home;
