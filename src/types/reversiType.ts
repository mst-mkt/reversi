export type Board = number[][];

export type Direction = [number, number];

export type Position = { x: number; y: number };

export type Game = {
  board: Board;
  status: {
    turnColor: number;
    count: {
      white: number;
      black: number;
    };
  };
  handleCellClick: (position: Position) => void;
  resetGame: () => void;
};

export type PlaceHistory = {
  color: number;
  position: Position;
};
