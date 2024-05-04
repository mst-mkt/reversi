import { Board } from '../components/Board/Board';
import { useBoard } from '../hooks/useBoard';
import styles from './index.module.css';
import '@fontsource/manrope';

const Home = () => {
  const { board, status, handleCellClick } = useBoard();

  return (
    <div className={styles.container}>
      <p>{['白', '黒'][status.turnColor - 1]}のターン</p>
      <p>
        白: {status.count.white}, 黒: {status.count.black}
      </p>
      <Board board={board} handleCellClick={handleCellClick} />
    </div>
  );
};

export default Home;
