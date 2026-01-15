import React from 'react';
import { QuestionProvider, useQuestion } from './contexts/QuestionContext';
import PlayerMedia from './components/PlayerMedia';
import GameBoard from './components/GameBoard';
import { GamePhase } from './types';

const Lobby = () => {
    const { setGamePhase } = useQuestion();
    return (
        <div className="flex flex-col items-center justify-center h-screen bg-arcade-dark text-center space-y-8 animate-fade-in relative overflow-hidden">
             {/* Background Grid Effect */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none"></div>
            
            <h1 className="text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-neon-pink to-neon-blue drop-shadow-neon-pink transform -rotate-2 z-10">
                WIT & WAGER
            </h1>
            
            <div className="bg-void/80 p-8 rounded-2xl border-2 border-neon-blue backdrop-blur-md max-w-md w-full shadow-neon-blue z-10">
                <div className="mb-6">
                    <label className="block text-sm font-bold mb-2 text-neon-blue tracking-widest">ENTER ROOM CODE</label>
                    <input 
                        type="text" 
                        defaultValue="NEON-NIGHTS"
                        className="w-full bg-slate-900 border border-neon-blue/50 rounded p-4 text-center text-2xl font-mono tracking-widest focus:outline-none focus:border-neon-pink focus:shadow-neon-pink transition text-white"
                    />
                </div>
                <button 
                    onClick={() => setGamePhase(GamePhase.BOARD)}
                    className="w-full bg-gradient-to-r from-neon-pink to-purple-600 text-white font-black text-xl py-4 rounded-xl shadow-lg hover:shadow-neon-pink transform transition hover:-translate-y-1 active:translate-y-0"
                >
                    INSERT COIN TO START
                </button>
            </div>
        </div>
    );
};

const GameContainer = () => {
    const { gamePhase } = useQuestion();
    
    if (gamePhase === GamePhase.LOBBY) {
        return <Lobby />;
    }

    return (
        <div className="flex w-full h-screen overflow-hidden">
            {/* Main Game Area (75%) */}
            <div className="w-3/4 h-full relative">
                <GameBoard />
            </div>
            
            {/* Sidebar (25%) */}
            <div className="w-1/4 h-full z-30 shadow-2xl">
                <PlayerMedia />
            </div>
        </div>
    );
};

const App: React.FC = () => {
  return (
    <QuestionProvider>
      <div className="min-h-screen bg-arcade-dark text-white font-sans selection:bg-neon-pink selection:text-white">
        <GameContainer />
      </div>
    </QuestionProvider>
  );
};

export default App;