import React from 'react';
import Square from './Square';
import type { SquareValue, WinningInfo } from '../types';

interface BoardProps {
  squares: SquareValue[];
  onSquareClick: (index: number) => void;
  winningInfo: WinningInfo | null;
  isAiThinking: boolean;
}

const WINNING_LINE_STYLES: { [key: string]: string } = {
  'top-row': 'top-[16.66%] h-1.5 w-full',
  'middle-row': 'top-1/2 -translate-y-1/2 h-1.5 w-full',
  'bottom-row': 'bottom-[16.66%] h-1.5 w-full',
  'left-col': 'left-[16.66%] w-1.5 h-full',
  'middle-col': 'left-1/2 -translate-x-1/2 w-1.5 h-full',
  'right-col': 'right-[16.66%] w-1.5 h-full',
  'diag-1': 'top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-1.5 w-[120%] rotate-45',
  'diag-2': 'top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-1.5 w-[120%] -rotate-45',
};

const Board: React.FC<BoardProps> = ({ squares, onSquareClick, winningInfo, isAiThinking }) => {
  const renderSquare = (i: number) => {
    return (
      <Square
        key={i}
        value={squares[i]}
        onClick={() => onSquareClick(i)}
        disabled={isAiThinking}
      />
    );
  };

  return (
    <div className="relative p-2 bg-brand-line rounded-lg shadow-inner">
      <div className="grid grid-cols-3 gap-2">
        {Array(9).fill(null).map((_, i) => renderSquare(i))}
      </div>
      {winningInfo && (
        <div 
          className={`absolute rounded-full transition-all duration-500 ease-out 
          ${winningInfo.winner === 'X' ? 'bg-brand-x' : 'bg-brand-o'} 
          ${WINNING_LINE_STYLES[winningInfo.direction]}`}
        />
      )}
    </div>
  );
};

export default Board;