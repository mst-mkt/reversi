import { useState } from 'react';
import styles from './index.module.css';

const Home = () => {
  const [turnColor, setTurnColor] = useState(1);
  const [board, setBoard] = useState([
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 1, 2, 0, 0, 0],
    [0, 0, 0, 2, 1, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
  ]);

  const directions = [
    [0, -1],
    [1, -1],
    [1, 0],
    [1, 1],
    [0, 1],
    [-1, 1],
    [-1, 0],
    [-1, -1],
  ];

  const handleClick = (x: number, y: number) => {
    if (board[y][x] !== 0) return;

    const newBoard = structuredClone(board);

    for (const [dx, dy] of directions) {
      if (board[y + dy]?.[x + dx] === 3 - turnColor) {
        let nx = x + dx;
        let ny = y + dy;
        while (board[ny]?.[nx] === 3 - turnColor) {
          nx += dx;
          ny += dy;
        }
        if (board[ny]?.[nx] === turnColor) {
          while (nx !== x || ny !== y) {
            newBoard[ny][nx] = turnColor;
            nx -= dx;
            ny -= dy;
          }
          newBoard[y][x] = turnColor;
        }
      }
    }

    setBoard(newBoard);
    setTurnColor(3 - turnColor);
  };

  return (
    <div className={styles.container}>
      <p>{['白', '黒'][turnColor - 1]}のターン</p>
      <div className={styles.board}>
        {board.map((row, y) =>
          row.map((cell, x) => (
            <div className={styles.cell} key={`${x}-${y}`} onClick={() => handleClick(x, y)}>
              {cell !== 0 && (
                <div
                  className={styles.stone}
                  style={{ backgroundColor: cell === 1 ? '#fff' : '#000' }}
                />
              )}
            </div>
          )),
        )}
      </div>
    </div>
  );
};

export default Home;
