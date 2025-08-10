
export type Player = 'X' | 'O';
export type SquareValue = Player | null;

export interface WinningInfo {
  winner: Player;
  line: number[];
  direction: string;
}
