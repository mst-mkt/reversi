import type { FC } from 'react';
import { Cell } from '../Cell/Cell';
import styles from './Board.module.css';
import type { Board as BoardType, Position } from '../../types/reversiType';

type BoardProps = {
  board: BoardType;
  handleCellClick: (position: Position) => void;
};

export const Board: FC<BoardProps> = ({ board, handleCellClick }) => (
  <div className={styles.board}>
    {board.map((row, y) =>
      row.map((cell, x) => (
        <Cell key={`${x}-${y}`} cell={cell} onClick={() => handleCellClick({ x, y })} />
      )),
    )}
  </div>
);
