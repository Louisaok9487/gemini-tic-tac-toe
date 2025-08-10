import React from 'react';
import type { SquareValue } from '../types';

interface SquareProps {
  value: SquareValue;
  onClick: () => void;
  disabled: boolean;
}

const Square: React.FC<SquareProps> = ({ value, onClick, disabled }) => {
  const textStyle = 
      value === 'X' ? 'text-brand-x' 
    : value === 'O' ? 'text-brand-o' 
    : '';

  return (
    <button
      className={`w-full h-full aspect-square flex items-center justify-center transition-colors duration-200 bg-brand-board hover:bg-blue-400`}
      onClick={onClick}
      disabled={disabled || value !== null}
      aria-label={`Square ${value ? `with ${value}` : 'empty'}`}
    >
      <span className={`text-6xl md:text-7xl font-black transition-transform duration-200 ease-in-out transform ${value ? 'scale-100' : 'scale-0'} ${textStyle}`}>
        {value}
      </span>
    </button>
  );
};

export default Square;