import React, { useState, useEffect } from 'react';
import VideoPlayer from './VideoPlayer';
import { useQuestion } from '../contexts/QuestionContext';

const TriviaModal: React.FC = () => {
    const { activeQuestion, submitAnswer } = useQuestion();
    const [selectedOption, setSelectedOption] = useState<number | null>(null);
    const [isReveal, setIsReveal] = useState(false);

    // Reset state when new question appears
    useEffect(() => {
        setSelectedOption(null);
        setIsReveal(false);
    }, [activeQuestion?.id]);

    if (!activeQuestion) return null;

    const handleOptionClick = (idx: number) => {
        if (isReveal) return; // Prevent double clicking
        setSelectedOption(idx);
        setIsReveal(true);

        // Wait 3 seconds before submitting to show feedback clearly
        setTimeout(() => {
            submitAnswer(idx);
        }, 3000);
    };

    const getOptionClass = (idx: number) => {
        const baseClass = "p-6 border-2 rounded-xl text-left transition-all duration-300 group relative overflow-hidden flex items-center";
        
        if (!isReveal) {
            return `${baseClass} bg-gradient-to-br from-indigo-900 to-slate-900 border-indigo-500/30 hover:border-neon-pink hover:shadow-neon-pink active:scale-95`;
        }

        const isCorrect = idx === activeQuestion.correctAnswerIndex;
        const isSelected = idx === selectedOption;

        // Correct Answer (Always highlights Green)
        if (isCorrect) {
            return `${baseClass} bg-green-900/90 border-green-400 shadow-[0_0_30px_rgba(74,222,128,0.6)] scale-105 z-20 ring-2 ring-green-300`;
        }
        
        // Wrong Selection (Highlights Red)
        if (isSelected && !isCorrect) {
            return `${baseClass} bg-red-900/90 border-red-500 shadow-[0_0_30px_rgba(239,68,68,0.6)] opacity-100 scale-95 ring-2 ring-red-500`;
        }

        // Unselected, Incorrect Options (Dimmed)
        return `${baseClass} bg-gray-900/50 border-gray-800 opacity-30 grayscale blur-[1px]`;
    };

    const isAudio = activeQuestion.type === 'video' && activeQuestion.isAudioQuestion;
    const headerTitle = isAudio ? '🎧 BLIND TEST' : (activeQuestion.type === 'video' ? '📺 VIDEO CHALLENGE' : '🧠 TRIVIA CHALLENGE');

    return (
        <div className="absolute inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-8 animate-fade-in">
            <div className="w-full max-w-6xl bg-arcade-dark border-4 border-neon-pink rounded-3xl p-6 shadow-neon-pink relative overflow-hidden flex flex-col gap-6 max-h-[90vh] overflow-y-auto">
                
                {/* Decorative Background Elements */}
                <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-neon-pink to-neon-blue"></div>
                
                {/* Header */}
                <div className="flex justify-between items-center border-b border-white/10 pb-4">
                    <h2 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-neon-pink to-white uppercase italic tracking-widest transform -skew-x-12">
                        {headerTitle}
                    </h2>
                    <div className="text-white font-mono text-xl animate-pulse text-right">
                        <div className="text-xs text-neon-blue uppercase">Reward</div>
                        {activeQuestion.type === 'video' ? '200 PTS' : '100 PTS'}
                    </div>
                </div>

                {/* Content Layout */}
                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Media Section (Video) */}
                    {activeQuestion.type === 'video' && (
                        <div className="flex-1 lg:max-w-[50%] flex flex-col">
                            <div className="aspect-video w-full rounded-xl overflow-hidden border-2 border-neon-blue shadow-lg bg-black relative">
                                <VideoPlayer 
                                    youtubeId={activeQuestion.youtubeId} 
                                    startTime={activeQuestion.startTime} 
                                    endTime={activeQuestion.endTime}
                                    isAudioMode={activeQuestion.isAudioQuestion}
                                    isRevealed={isReveal}
                                />
                            </div>
                            <p className="text-xs text-center text-gray-500 mt-2 font-mono">
                                Video not playing? Ensure sound is on.
                            </p>
                        </div>
                    )}

                    {/* Interaction Section */}
                    <div className="flex-1 flex flex-col justify-center gap-6">
                        {/* Prompt */}
                        <div className="bg-white/5 p-6 rounded-xl border-l-4 border-game-gold relative transition-all">
                             <h3 className="text-2xl font-bold leading-relaxed text-white">
                                {activeQuestion.prompt}
                            </h3>
                             {/* Feedback Banner */}
                             {isReveal && (
                                <div className={`absolute -top-4 -right-4 px-6 py-2 rounded-full font-black text-white shadow-lg transform rotate-6 animate-bounce border-2 border-white
                                    ${selectedOption === activeQuestion.correctAnswerIndex ? 'bg-green-500' : 'bg-red-600'}
                                `}>
                                    {selectedOption === activeQuestion.correctAnswerIndex ? 'CORRECT!' : 'WRONG!'}
                                </div>
                            )}
                        </div>

                        {/* Options Grid */}
                        <div className="grid grid-cols-1 gap-4">
                            {activeQuestion.options.map((option, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => handleOptionClick(idx)}
                                    disabled={isReveal}
                                    className={getOptionClass(idx)}
                                >
                                    {/* Option Letter */}
                                    <span className={`text-2xl font-black mr-4 w-10 flex-shrink-0
                                        ${isReveal && idx === activeQuestion.correctAnswerIndex ? 'text-white drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)]' : 'text-neon-blue'}
                                    `}>
                                        {String.fromCharCode(65 + idx)}
                                    </span>
                                    
                                    {/* Option Text */}
                                    <span className={`font-semibold text-lg text-left flex-grow
                                        ${isReveal && idx === activeQuestion.correctAnswerIndex ? 'text-white drop-shadow-md' : 'text-gray-100'}
                                    `}>
                                        {option}
                                    </span>
                                    
                                    {/* SVG Result Icons */}
                                    {isReveal && idx === activeQuestion.correctAnswerIndex && (
                                        <div className="bg-green-500 rounded-full p-1 shadow-lg ml-3 animate-in fade-in zoom-in duration-300">
                                            <svg className="w-6 h-6 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                            </svg>
                                        </div>
                                    )}
                                    
                                    {isReveal && idx === selectedOption && idx !== activeQuestion.correctAnswerIndex && (
                                        <div className="bg-red-500 rounded-full p-1 shadow-lg ml-3 animate-in fade-in zoom-in duration-300">
                                            <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                            </svg>
                                        </div>
                                    )}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TriviaModal;