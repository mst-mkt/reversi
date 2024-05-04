import type { FC } from 'react';
import styles from './Status.module.css';

type StatusProps = {
  turnColor: number;
  count: {
    white: number;
    black: number;
  };
};

export const Status: FC<StatusProps> = ({ turnColor, count }) => (
  <div className={styles.status}>
    <section>
      <h2>TURN</h2>
      <p>{['白', '黒'][turnColor - 1]}のターン</p>
    </section>
    <section>
      <h2>SCORE</h2>
      <p>
        <span>{count.white}</span>
        <span>{count.black}</span>
      </p>
    </section>
  </div>
);
