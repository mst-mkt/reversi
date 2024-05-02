import { useMemo, useState } from 'react';
import styles from './index.module.css';

const directions = [
  [-1, -1],
  [-1, 0],
  [-1, 1],
  [0, 1],
  [1, 1],
  [1, 0],
  [1, -1],
  [0, -1],
];

const initialBoard = [
  [0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 1, 2, 0, 0, 0],
  [0, 0, 0, 2, 1, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0],
];

const canPut = (board: number[][], x: number, y: number, turnColor: number) =>
  directions
    .map(
      ([dx, dy]) =>
        [...Array(8).keys()]
          .map((i) => board[y + dy * i]?.[x + dx * i])
          .filter((v) => v !== undefined)
          .map((v) => Math.max(v, 0))
          .with(0, turnColor)
          .join('')
          .match(/^((12+1)|(21+2))/) !== null,
    )
    .some(Boolean);

const canPutLength = (
  board: number[][],
  x: number,
  y: number,
  turnColor: number,
  [dx, dy]: [number, number],
) => {
  return [...Array(8).keys()]
    .map((i) => board[y + dy * i]?.[x + dx * i])
    .filter((v) => v !== undefined)
    .map((v) => Math.max(v, 0))
    .with(0, turnColor)
    .join('')
    .match(/^((12+1)|(21+2))/)?.[0]?.length;
};

const searchCanPut = (board: number[][], turnColor: number) =>
  board.map((row, y) =>
    row.map(
      (_, x) =>
        [-canPut(board, x, y, turnColor), board[y][x]][Math.max(Math.min(board[y][x], 1), 0)],
    ),
  );

const Home = () => {
  const [turnColor, setTurnColor] = useState(1);
  const [board, setBoard] = useState(initialBoard);
  const [whiteCount, blackCount] = useMemo(
    () => [1, 2].map((color) => board.flat().filter((v) => v === color).length),
    [board],
  );
  const checkedBoard = useMemo(() => searchCanPut(board, turnColor), [board, turnColor]);
  const isGameEnd = useMemo(
    () =>
      [1, 2].every(
        (color) =>
          searchCanPut(board, color)
            .flat()
            .filter((cell) => cell === -1).length === 0,
      ),
    [board],
  );

  const reverseStone = (board: number[][], x: number, y: number): number[][] => {
    const newBoard = structuredClone(board);
    const replacePositions = directions.flatMap(([dx, dy]) => {
      const length = canPutLength(board, x, y, turnColor, [dx, dy]);
      const lengthArray = Array(+Number.isFinite(length) * [...Array(length)].length);
      return [...lengthArray.keys()].map((i) => ({ x: x + dx * i, y: y + dy * i }));
    });

    const replacedBoard = replacePositions.reduce((acc, { x, y }) => {
      acc[y][x] = turnColor;
      return acc;
    }, newBoard);

    return replacedBoard;
  };

  const handleClick = (x: number, y: number) => {
    const action = [
      () => {},
      () => {
        const reversedBoard = reverseStone(board, x, y);
        const shouldPass = searchCanPut(reversedBoard, turnColor ^ 3)
          .flat()
          .every((cell) => cell !== -1);
        setBoard(reversedBoard);
        setTurnColor((turnColor ^ 3) * +!shouldPass + turnColor * +shouldPass);
      },
    ];

    action[-checkedBoard[y][x]]?.();
  };

  const finishGame = () => {
    [
      () => {},
      () => {
        const message = ['白の勝ち', '黒の勝ち', '引き分け'][
          +(blackCount >= whiteCount) + +(blackCount === whiteCount)
        ];
        setTimeout(() => alert(`${message}です`), 0);
      },
    ][+isGameEnd]?.();
  };

  finishGame();

  return (
    <div className={styles.container}>
      <p>{['白', '黒'][turnColor - 1]}のターン</p>
      <p>
        白: {whiteCount}, 黒: {blackCount}
      </p>
      <div className={styles.board}>
        {checkedBoard.map((row, y) =>
          row.map((cell, x) => (
            <div className={styles.cell} key={`${x}-${y}`} onClick={() => handleClick(x, y)}>
              {[
                <></>,
                <div
                  className={styles.stone}
                  key={`${x}-${y}`}
                  style={{ backgroundColor: ['white', 'black'][cell - 1] }}
                />,
                <div key={`${x}-${y}`}>can</div>,
              ].at(Math.min(cell, 1))}
            </div>
          )),
        )}
      </div>
    </div>
  );
};

export default Home;
