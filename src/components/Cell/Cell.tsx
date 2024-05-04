import type { FC } from 'react';
import styles from './Cell.module.css';

type CellProps = {
  cell: number;
  onClick: () => void;
};

export const Cell: FC<CellProps> = ({ cell, onClick }) => (
  <div className={`${styles.cell} ${['', styles.clickable][Math.max(-cell, 0)]}`} onClick={onClick}>
    <div className={`${styles.stone} ${['', styles.black, styles.white][Math.max(cell, 0)]}`} />
    <div className={styles.suggest} />
  </div>
);
