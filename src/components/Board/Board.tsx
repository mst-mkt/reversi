import type { FC } from 'react';
import { Cell } from '../Cell/Cell';
import styles from './Board.module.css';

type BoardProps = {
  board: number[][];
  handleCellClick: (x: number, y: number) => void;
};

export const Board: FC<BoardProps> = ({ board, handleCellClick }) => (
  <div className={styles.board}>
    {board.map((row, y) =>
      row.map((cell, x) => (
        <Cell key={`${x}-${y}`} cell={cell} onClick={() => handleCellClick(x, y)} />
      )),
    )}
  </div>
);
