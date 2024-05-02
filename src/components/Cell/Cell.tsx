import type { FC } from 'react';
import styles from './Cell.module.css';

type CellProps = {
  cell: number;
  onClick: () => void;
};

export const Cell: FC<CellProps> = ({ cell, onClick }) => {
  const discs = [
    <></>,
    <div
      key={1}
      className={styles.stone}
      style={{ backgroundColor: ['white', 'black'][cell - 1] }}
    />,
    <div key={2}>can</div>,
  ];

  return (
    <div className={styles.cell} onClick={onClick}>
      {discs.at(Math.min(cell, 1))}
    </div>
  );
};
