import { RotateCcwIcon } from 'lucide-react';
import styles from './Header.module.css';
import type { FC } from 'react';

type HeaderProps = {
  resetGame: () => void;
};

export const Header: FC<HeaderProps> = ({ resetGame }) => (
  <header className={styles.header}>
    <h1 className={styles.title}>Reversi</h1>
    <p className={styles.text}>Created at INIAD.ts</p>
    <button type="button" className={styles.button} onClick={resetGame}>
      <RotateCcwIcon color="#444" />
    </button>
  </header>
);
