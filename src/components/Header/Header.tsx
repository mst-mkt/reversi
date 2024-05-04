import { RotateCcwIcon } from 'lucide-react';
import styles from './Header.module.css';

export const Header = () => (
  <header className={styles.header}>
    <h1 className={styles.title}>Reversi</h1>
    <p className={styles.text}>Created at INIAD.ts</p>
    <button type="button" className={styles.button}>
      <RotateCcwIcon color="#444" />
    </button>
  </header>
);
