import React, { useState, useEffect, useCallback } from 'react';
import Board from './components/Board';
import GameStatus from './components/GameStatus';
import ResetButton from './components/ResetButton';
import { getAiMove } from './services/geminiService';
import type { Player, SquareValue, WinningInfo } from './types';

const INITIAL_BOARD = Array(9).fill(null);
const USER_PLAYER: Player = 'X';
const AI_PLAYER: Player = 'O';

const calculateWinner = (squares: SquareValue[]): WinningInfo | null => {
  const lines = [
    { line: [0, 1, 2], direction: 'top-row' },
    { line: [3, 4, 5], direction: 'middle-row' },
    { line: [6, 7, 8], direction: 'bottom-row' },
    { line: [0, 3, 6], direction: 'left-col' },
    { line: [1, 4, 7], direction: 'middle-col' },
    { line: [2, 5, 8], direction: 'right-col' },
    { line: [0, 4, 8], direction: 'diag-1' },
    { line: [2, 4, 6], direction: 'diag-2' },
  ];
  for (let i = 0; i < lines.length; i++) {
    const { line, direction } = lines[i];
    const [a, b, c] = line;
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return { winner: squares[a] as Player, line, direction };
    }
  }
  return null;
};

const App: React.FC = () => {
  const [board, setBoard] = useState<SquareValue[]>(INITIAL_BOARD);
  const [currentPlayer, setCurrentPlayer] = useState<Player>(USER_PLAYER);
  const [winningInfo, setWinningInfo] = useState<WinningInfo | null>(null);
  const [isDraw, setIsDraw] = useState<boolean>(false);
  const [isAiThinking, setIsAiThinking] = useState<boolean>(false);

  const winner = winningInfo ? winningInfo.winner : null;

  const handleUserMove = (index: number) => {
    if (winner || board[index] || currentPlayer !== USER_PLAYER) {
      return;
    }
    const newBoard = [...board];
    newBoard[index] = USER_PLAYER;
    setBoard(newBoard);
    setCurrentPlayer(AI_PLAYER);
  };

  const resetGame = useCallback(() => {
    setBoard(INITIAL_BOARD);
    setCurrentPlayer(USER_PLAYER);
    setWinningInfo(null);
    setIsDraw(false);
    setIsAiThinking(false);
  }, []);

  const triggerAiMove = useCallback(async (currentBoard: SquareValue[]) => {
    setIsAiThinking(true);
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const aiMoveIndex = await getAiMove(currentBoard);

    if (aiMoveIndex !== -1 && currentBoard[aiMoveIndex] === null) {
      const newBoard = [...currentBoard];
      newBoard[aiMoveIndex] = AI_PLAYER;
      setBoard(newBoard);
    } else if (aiMoveIndex === -1) {
       console.log("No moves left for AI, this might be a draw");
    } else {
       console.error("AI tried to make an invalid move to index:", aiMoveIndex);
    }

    setIsAiThinking(false);
    setCurrentPlayer(USER_PLAYER);
  }, []);


  useEffect(() => {
    const calculatedWinnerInfo = calculateWinner(board);
    if (calculatedWinnerInfo) {
      setWinningInfo(calculatedWinnerInfo);
    } else if (!board.includes(null)) {
      setIsDraw(true);
    } else if (currentPlayer === AI_PLAYER && !winner) {
      triggerAiMove(board);
    }
  }, [board, currentPlayer, winner, triggerAiMove]);


  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <main className="w-full max-w-xs bg-brand-panel rounded-lg shadow-2xl text-white">
        <div className="p-5">
            {/* Top Bar */}
            <div className="flex justify-between items-center mb-4">
                <div className="relative">
                    <button className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors">
                        <span>Medium</span>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                    </button>
                </div>
                <button className="text-gray-400 hover:text-white transition-colors" aria-label="Share game">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.684 13.342C8.886 12.938 9 12.482 9 12s-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.368a3 3 0 105.367 2.684 3 3 0 00-5.367 2.684z" />
                    </svg>
                </button>
            </div>
            {/* Player Info */}
            <div className="flex justify-center items-stretch gap-2 sm:gap-4 mb-4">
                <div className={`p-3 rounded-lg flex-1 text-center border-2 ${winner === 'X' ? 'border-brand-x bg-brand-x/10' : 'border-gray-600'} flex items-center justify-between px-4 sm:px-6 transition-all`}>
                    <span className="text-3xl font-black text-brand-x">X</span>
                    <span className="text-2xl text-gray-400 font-bold">-</span>
                </div>
                <div className={`p-3 rounded-lg flex-1 text-center border-2 ${winner === 'O' ? 'border-brand-o bg-brand-o/10' : 'border-gray-600'} flex items-center justify-between px-4 sm:px-6 transition-all`}>
                    <span className="text-3xl font-black text-brand-o">O</span>
                    <span className="text-2xl text-gray-400 font-bold">-</span>
                </div>
            </div>

            <GameStatus
              winner={winner}
              isDraw={isDraw}
              currentPlayer={currentPlayer}
              isAiThinking={isAiThinking}
            />

            <Board
              squares={board}
              onSquareClick={handleUserMove}
              winningInfo={winningInfo}
              isAiThinking={isAiThinking || !!winner}
            />
        </div>
        
        <ResetButton onReset={resetGame} />
      </main>
    </div>
  );
};

export default App;