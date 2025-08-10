import React from 'react';
import type { Player } from '../types';

interface GameStatusProps {
  winner: Player | null;
  isDraw: boolean;
  currentPlayer: Player;
  isAiThinking: boolean;
}

const GameStatus: React.FC<GameStatusProps> = ({ winner, isDraw, currentPlayer, isAiThinking }) => {
  const getStatusText = () => {
    if (winner) {
        return winner === 'X' ? 'YOU WIN!' : 'AI WINS!';
    }
    if (isDraw) {
        return "IT'S A DRAW!";
    }
    if (isAiThinking) {
        return 'AI IS THINKING...';
    }
    return currentPlayer === 'X' ? 'YOUR TURN' : 'O TURN';
  };

  const status = getStatusText();

  return (
    <div className="text-center text-gray-400 text-sm font-semibold tracking-wider mb-4 h-6 flex items-center justify-center gap-2">
      {!(winner || isDraw) && currentPlayer === 'O' && (
        <div className={`w-2.5 h-2.5 rounded-full bg-brand-o ${isAiThinking ? 'animate-pulse' : ''}`}></div>
      )}
      <p className={`${winner || isDraw ? 'text-lg text-white font-bold' : ''}`}>
        {status}
      </p>
    </div>
  );
};

export default GameStatus;