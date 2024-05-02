import { Board } from '../components/Board/Board';
import { useBoard } from '../hooks/useBoard';
import styles from './index.module.css';

const Home = () => {
  const { board, game, handleCellClick } = useBoard();

  return (
    <div className={styles.container}>
      <p>{['白', '黒'][game.turnColor - 1]}のターン</p>
      <p>
        白: {game.count.white}, 黒: {game.count.black}
      </p>
      <Board board={board} handleCellClick={handleCellClick} />
    </div>
  );
};

export default Home;
