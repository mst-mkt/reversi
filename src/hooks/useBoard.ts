import { useCallback, useMemo, useState } from 'react';
import { COLORS, DIRECTIONS, INITIAL_BOARD } from '../constants/defaultValues';
import type { Board, Direction, Game, PlaceHistory, Position } from '../types/reversiType';

const omitUndefinedFromNumber = (value: number | undefined, replaceValue: number = 0) => {
  return (
    [...Array(value)].length * +Number.isFinite(value) + replaceValue * +!Number.isFinite(value)
  );
};

const countPlaceableLength = (
  board: Board,
  turnColor: number,
  { x, y }: Position,
  [dx, dy]: Direction,
) => {
  const placeableRegex = new RegExp(`^0${turnColor ^ 3}+${turnColor}`);
  const length = [...Array(7).keys()]
    .map((i) => board[y + dy * i]?.[x + dx * i])
    .filter((v) => v !== undefined)
    .map((v) => Math.max(v, 0))
    .join('')
    .match(placeableRegex)?.[0]?.length;
  const lengthOmitUndefined = omitUndefinedFromNumber(length);
  return lengthOmitUndefined;
};

const checkCanPlace = (board: Board, position: Position, turnColor: number): boolean => {
  const canPlace = DIRECTIONS.map((direction) =>
    countPlaceableLength(board, turnColor, position, direction),
  ).some((length) => length > 0);
  return canPlace;
};

const applySuggest = (board: Board, turnColor: number): Board => {
  const suggestedBoard = board.map((row, y) =>
    row.map((_, x) => {
      const isPlaceable = checkCanPlace(board, { x, y }, turnColor);
      const hasDisc = Math.max(Math.min(board[y][x], 1), 0);
      const cell = [-isPlaceable, board[y][x]][hasDisc];
      return cell;
    }),
  );
  return suggestedBoard;
};

const reverseDisc = (board: Board, { x, y }: Position, turnColor: number): Board => {
  const replacePositions: Position[] = DIRECTIONS.flatMap(([dx, dy]) => {
    const length = countPlaceableLength(board, turnColor, { x, y }, [dx, dy]);
    const lengthRange = [...Array(length).keys()];
    const positions = lengthRange.map((i) => ({ x: x + dx * i, y: y + dy * i }));
    return positions;
  });

  const replacedBoard = replacePositions.reduce((acc, { x, y }) => {
    acc[y][x] = turnColor;
    return acc;
  }, structuredClone(board));

  return replacedBoard;
};

export const useBoard = (): Game => {
  const [placeHistory, setPlaceHistory] = useState<PlaceHistory[]>([]);

  const board = useMemo(() => {
    return placeHistory.reduce(
      (acc, { color, position }) => reverseDisc(acc, position, color),
      structuredClone(INITIAL_BOARD),
    );
  }, [placeHistory]);

  const turnColor = useMemo(() => {
    const lastTurn = placeHistory.at(-1)?.color;
    const lastTurnOmitUndefined = omitUndefinedFromNumber(lastTurn, 2);
    const lastEnemyTurn = lastTurnOmitUndefined ^ 3;
    const suggestedBoard = applySuggest(board, lastEnemyTurn);
    const shouldPass = suggestedBoard.flat().every((cell) => cell >= 0);
    const nextTurnColor = lastEnemyTurn * +!shouldPass + lastTurnOmitUndefined * +shouldPass;
    return nextTurnColor;
  }, [placeHistory, board]);

  const suggestedBoard = useMemo(() => applySuggest(board, turnColor), [board, turnColor]);
  const [whiteCount, blackCount] = useMemo(
    () => COLORS.map((color) => board.flat().filter((v) => v === color).length),
    [board],
  );
  const isGameEnd = useMemo(
    () =>
      COLORS.flatMap((color) => applySuggest(board, color))
        .flat()
        .every((cell) => cell >= 0),
    [board],
  );

  const checkFinishGame = useCallback(() => {
    const winnerNumber = +(blackCount >= whiteCount) + +(blackCount === whiteCount);
    const gameStatus = ['白の勝ち', '黒の勝ち', '引き分け'][winnerNumber];
    const finishAlert = () => setTimeout(() => alert(`${gameStatus}です`), 100);
    const actions = [undefined, finishAlert];
    actions[+isGameEnd]?.();
  }, [blackCount, whiteCount, isGameEnd]);
  const resetGame = useCallback(() => {
    setPlaceHistory([]);
  }, []);

  const handleCellClick = ({ x, y }: Position) => {
    const canPlaceNumber = Math.max(-suggestedBoard[y][x], 0);
    const actions = [
      () => {},
      () => {
        setPlaceHistory((prev) => [...prev, { color: turnColor, position: { x, y } }]);
      },
    ];

    actions[canPlaceNumber]();
  };

  checkFinishGame();

  return {
    board: suggestedBoard,
    status: {
      turnColor,
      count: {
        white: whiteCount,
        black: blackCount,
      },
    },
    handleCellClick,
    resetGame,
  };
};
