import React from 'react';

interface ResetButtonProps {
  onReset: () => void;
}

const ResetButton: React.FC<ResetButtonProps> = ({ onReset }) => {
  return (
    <div className="bg-brand-panel rounded-b-lg px-5 py-3 text-center border-t border-brand-bg">
        <button
            onClick={onReset}
            className="text-gray-400 hover:text-white text-md font-semibold"
            >
            Restart game
        </button>
    </div>
  );
};

export default ResetButton;