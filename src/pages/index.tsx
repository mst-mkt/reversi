import { Board } from '../components/Board/Board';
import { Header } from '../components/Header/Header';
import { Status } from '../components/Status/Status';
import { useBoard } from '../hooks/useBoard';
import styles from './index.module.css';
import '@fontsource/manrope';

const Home = () => {
  const { board, status, handleCellClick } = useBoard();

  return (
    <div className={styles.container}>
      <Header />
      <Board board={board} handleCellClick={handleCellClick} />
      <Status {...status} />
    </div>
  );
};

export default Home;
