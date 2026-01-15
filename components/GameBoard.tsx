import React, { useMemo, useState } from 'react';
import { useQuestion } from '../contexts/QuestionContext';
import Dice from './Dice';
import TriviaModal from './TriviaModal';
import HostCommentary from './HostCommentary';

const TOTAL_TILES = 24;

const PATH_NODES = [
    { x: 5, y: 85 }, { x: 15, y: 88 }, { x: 25, y: 85 }, { x: 35, y: 80 }, { x: 45, y: 85 }, { x: 55, y: 88 }, { x: 65, y: 85 }, { x: 75, y: 80 }, // Row 1
    { x: 85, y: 65 }, { x: 75, y: 50 }, { x: 65, y: 45 }, { x: 55, y: 48 }, { x: 45, y: 52 }, { x: 35, y: 50 }, { x: 25, y: 45 }, { x: 15, y: 50 }, // Row 2
    { x: 5, y: 35 }, { x: 15, y: 15 }, { x: 25, y: 10 }, { x: 35, y: 12 }, { x: 45, y: 15 }, { x: 55, y: 10 }, { x: 65, y: 8 }, { x: 75, y: 12 }, // Row 3
];

const GameBoard = () => {
    const { 
        players, 
        movePlayer, 
        activeQuestion,
        currentPlayerId,
        isMyTurn,
        endTurn,
        sabotagePlayer,
        winnerId
    } = useQuestion();

    const [showSabotageMenu, setShowSabotageMenu] = useState(false);

    const myPlayer = players.find(p => p.isMe);
    const currentPlayer = players.find(p => p.id === currentPlayerId);
    const isFrozen = myPlayer?.statusEffect === 'frozen';
    const winner = players.find(p => p.id === winnerId);

    // Smooth Path Gen
    const smoothPathD = useMemo(() => {
        if (PATH_NODES.length === 0) return "";
        let d = `M ${PATH_NODES[0].x} ${PATH_NODES[0].y}`;
        for (let i = 0; i < PATH_NODES.length - 1; i++) {
            const p0 = i > 0 ? PATH_NODES[i-1] : PATH_NODES[i];
            const p1 = PATH_NODES[i];
            const p2 = PATH_NODES[i+1];
            const p3 = i !== PATH_NODES.length - 2 ? PATH_NODES[i+2] : p2;
            const cp1x = p1.x + (p2.x - p0.x) / 6;
            const cp1y = p1.y + (p2.y - p0.y) / 6;
            const cp2x = p2.x - (p3.x - p1.x) / 6;
            const cp2y = p2.y - (p3.y - p1.y) / 6;
            d += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${p2.x} ${p2.y}`;
        }
        return d;
    }, []);

    // Win Screen
    if (winnerId) {
        return (
            <div className="relative w-full h-full bg-slate-900 flex flex-col items-center justify-center overflow-hidden">
                <HostCommentary />
                <div className="absolute inset-0 bg-black/80 z-40"></div>
                <div className="z-50 text-center animate-fade-in space-y-8">
                    <h1 className="text-8xl font-black text-transparent bg-clip-text bg-gradient-to-r from-game-gold to-yellow-200 drop-shadow-[0_0_30px_rgba(234,179,8,0.8)]">
                        GAME OVER
                    </h1>
                    <div className="text-6xl animate-bounce">{winner?.avatar}</div>
                    <div className="text-4xl font-bold text-white uppercase tracking-widest">
                        {winner?.name} WINS!
                    </div>
                    <div className="text-xl text-gray-400 font-mono">
                        FINAL SCORE: {winner?.score}
                    </div>
                    <button onClick={() => window.location.reload()} className="mt-8 bg-neon-pink hover:bg-purple-600 text-white font-black py-4 px-12 rounded-full shadow-neon-pink transition-all transform hover:scale-105">
                        PLAY AGAIN
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="relative w-full h-full bg-slate-900 overflow-hidden flex flex-col">
            <HostCommentary />
            {activeQuestion && <TriviaModal />}

            {/* Header */}
            <div className="absolute top-6 left-8 z-10 pointer-events-none">
                <h1 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-neon-pink to-neon-blue uppercase italic transform -skew-x-6 drop-shadow-lg">
                    WIT & WAGER
                </h1>
                <p className="text-neon-blue font-mono tracking-widest text-sm mt-1 opacity-70">S.02 - CHAOS EDITION</p>
            </div>

            {/* Turn Banner */}
            <div className="absolute top-6 right-8 z-10 flex flex-col items-end animate-fade-in pointer-events-none">
                 <div className="text-[10px] text-neon-pink uppercase tracking-[0.2em] font-bold mb-1">Current Turn</div>
                 <div className="flex items-center gap-3">
                    <span className="text-2xl font-black text-white">{currentPlayer?.name}</span>
                    <div className="text-3xl animate-bounce">{currentPlayer?.avatar}</div>
                 </div>
                 {currentPlayer?.statusEffect === 'frozen' && (
                     <div className="text-red-400 font-bold uppercase text-xs mt-1 animate-pulse">❄️ FROZEN - TURN SKIPPED ❄️</div>
                 )}
            </div>

            {/* BOARD */}
            <div className="relative flex-1 w-full flex items-center justify-center p-8">
                {/* SVG Lines */}
                <div className="absolute inset-0 w-full h-full pointer-events-none">
                    <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                        <path d={smoothPathD} fill="none" stroke="#d946ef" strokeWidth="1.5" strokeOpacity="0.4" className="blur-sm" />
                        <path d={smoothPathD} fill="none" stroke="url(#lineGradient)" strokeWidth="0.8" strokeDasharray="2 1" />
                        <defs>
                            <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                                <stop offset="0%" stopColor="#d946ef" />
                                <stop offset="100%" stopColor="#22d3ee" />
                            </linearGradient>
                        </defs>
                    </svg>
                </div>

                {/* Nodes */}
                <div className="absolute inset-0 w-full h-full">
                    {PATH_NODES.map((node, index) => {
                         const isVideo = index % 3 === 0 && index !== 0;
                         const isStart = index === 0;
                         const isEnd = index === PATH_NODES.length - 1;

                         return (
                            <div 
                                key={index}
                                className={`absolute transform -translate-x-1/2 -translate-y-1/2 w-8 h-8 md:w-12 md:h-12 rounded-full border-2 flex items-center justify-center transition-all duration-300
                                    ${isVideo ? 'bg-red-900/40 border-red-500 shadow-[0_0_15px_rgba(239,68,68,0.5)] z-10' : 'bg-slate-800/80 border-slate-600 shadow-lg'}
                                    ${isStart ? 'border-yellow-400 w-14 h-14 bg-yellow-900/30' : ''}
                                    ${isEnd ? 'border-neon-blue w-14 h-14 bg-blue-900/30' : ''}
                                `}
                                style={{ left: `${node.x}%`, top: `${node.y}%` }}
                            >
                                <span className={`text-[10px] md:text-xs font-mono font-bold ${isVideo ? 'text-red-400' : 'text-slate-500'}`}>
                                    {index + 1}
                                </span>
                                {isEnd && <span className="absolute -top-6 text-xs font-black text-neon-blue animate-pulse">GOAL</span>}
                            </div>
                         );
                    })}
                </div>

                {/* Players */}
                <div className="absolute inset-0 w-full h-full pointer-events-none z-20">
                    {players.map((p, idx) => {
                        const posIndex = Math.min(p.position, PATH_NODES.length - 1);
                        const coords = PATH_NODES[posIndex] || PATH_NODES[0];
                        const isCurrentTurn = p.id === currentPlayerId;

                        return (
                            <div 
                                key={p.id}
                                className={`absolute transform -translate-x-1/2 -translate-y-1/2 transition-all duration-1000 ease-in-out flex flex-col items-center justify-center
                                    ${isCurrentTurn ? 'scale-125 z-50 drop-shadow-[0_0_15px_rgba(255,255,255,0.8)]' : 'scale-90 opacity-80 z-30'}
                                `}
                                style={{ 
                                    left: `${coords.x}%`, 
                                    top: `${coords.y}%`,
                                    marginLeft: `${(idx % 2) * 10 - 5}px`,
                                    marginTop: `${Math.floor(idx / 2) * -10}px`
                                }}
                            >
                                <div className="text-4xl filter drop-shadow-md relative">
                                    {p.avatar}
                                    {/* Status Effects */}
                                    {p.statusEffect === 'frozen' && (
                                        <div className="absolute inset-0 bg-blue-400/50 rounded-full backdrop-blur-sm border border-white animate-pulse">❄️</div>
                                    )}
                                </div>
                                {isCurrentTurn && (
                                    <div className="absolute -top-6 text-xl animate-bounce">🔻</div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* CONTROLS */}
            <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-50 flex flex-col items-center gap-4 w-full max-w-md px-4">
                 
                 {/* Dice & Main Controls */}
                 <div className="bg-black/60 backdrop-blur-md p-4 rounded-3xl border border-white/10 shadow-2xl flex items-center gap-6 relative">
                    
                    {/* Sabotage Menu Popover */}
                    {showSabotageMenu && isMyTurn && (
                        <div className="absolute bottom-full left-0 mb-4 w-64 bg-slate-900 border-2 border-red-500 rounded-xl p-4 shadow-neon-pink animate-fade-in flex flex-col gap-2 z-50">
                            <h3 className="text-red-500 font-black uppercase text-sm border-b border-red-900 pb-2 mb-1">Select Target (Cost: 300)</h3>
                            {players.filter(p => !p.isMe).map(target => (
                                <div key={target.id} className="flex gap-2">
                                    <button 
                                        disabled={(myPlayer?.score || 0) < 300}
                                        onClick={() => { sabotagePlayer(target.id, 'freeze'); setShowSabotageMenu(false); }}
                                        className="flex-1 bg-blue-900 hover:bg-blue-700 text-xs py-2 rounded text-blue-200 border border-blue-500 disabled:opacity-50"
                                    >
                                        ❄️ {target.name}
                                    </button>
                                    <button 
                                        disabled={(myPlayer?.score || 0) < 300}
                                        onClick={() => { sabotagePlayer(target.id, 'bomb'); setShowSabotageMenu(false); }}
                                        className="flex-1 bg-red-900 hover:bg-red-700 text-xs py-2 rounded text-red-200 border border-red-500 disabled:opacity-50"
                                    >
                                        💣 {target.name}
                                    </button>
                                </div>
                            ))}
                            <button onClick={() => setShowSabotageMenu(false)} className="text-xs text-gray-500 mt-2 hover:text-white">Cancel</button>
                        </div>
                    )}

                    <Dice 
                        onRoll={(val) => movePlayer(val)}
                        disabled={
                            activeQuestion !== null || 
                            (myPlayer && myPlayer.position >= TOTAL_TILES) ||
                            !isMyTurn || isFrozen
                        } 
                    />
                    
                    <div className="flex flex-col gap-2 min-w-[140px]">
                        {isMyTurn && !activeQuestion ? (
                            isFrozen ? (
                                <button 
                                    onClick={endTurn}
                                    className="bg-blue-500 hover:bg-blue-400 text-white font-black py-3 px-4 rounded-lg shadow-lg uppercase tracking-widest text-xs border-2 border-white animate-pulse"
                                >
                                    FROZEN (SKIP)
                                </button>
                            ) : (
                                <>
                                    <button 
                                        onClick={endTurn}
                                        className="bg-gray-700 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded-lg uppercase text-xs transition-all border border-gray-500"
                                    >
                                        Pass Turn
                                    </button>
                                    <button 
                                        onClick={() => setShowSabotageMenu(!showSabotageMenu)}
                                        className="bg-red-600 hover:bg-red-500 text-white font-black py-2 px-4 rounded-lg uppercase tracking-widest text-xs transition-all border border-red-400 hover:scale-105 active:scale-95 flex items-center justify-center gap-2"
                                    >
                                        😈 Sabotage
                                    </button>
                                </>
                            )
                        ) : (
                            <div className="text-center text-xs font-mono text-gray-400">
                                {!isMyTurn ? "OPPONENT THINKING..." : "ROLL THE DICE"}
                            </div>
                        )}
                    </div>
                 </div>

            </div>
        </div>
    );
};

export default GameBoard;