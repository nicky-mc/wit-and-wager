import React, { useEffect, useState } from 'react';
import { useQuestion } from '../contexts/QuestionContext';
import { getRandomRoast } from '../data/roasts';

const HostCommentary: React.FC = () => {
    const { lastEvent, players, myId } = useQuestion();
    const [message, setMessage] = useState<string>("");
    const [visible, setVisible] = useState(false);
    const [isThinking, setIsThinking] = useState(false);

    // Initial greeting
    useEffect(() => {
        const intro = getRandomRoast('game_start');
        triggerMessage(intro);
    }, []);

    // Listen for game events
    useEffect(() => {
        if (!lastEvent) return;

        let roast = "";
        
        switch (lastEvent.type) {
            case 'rolled_one':
                roast = getRandomRoast('rolled_one');
                break;
            case 'missed_question':
                roast = getRandomRoast('missed_question');
                break;
            case 'streak':
                if (Math.random() > 0.6) {
                    roast = getRandomRoast('streak');
                }
                break;
            case 'sabotage':
                roast = getRandomRoast('sabotage');
                break;
            case 'frozen_turn':
                roast = getRandomRoast('frozen_turn');
                break;
            case 'win':
                roast = getRandomRoast('win');
                break;
            default:
                break;
        }

        if (roast) {
            triggerMessage(roast);
        }

    }, [lastEvent?.timestamp]);

    // Idle timer logic
    useEffect(() => {
        const idleTimer = setInterval(() => {
             if (!visible && Math.random() > 0.8) {
                 triggerMessage(getRandomRoast('waiting'));
             }
        }, 30000); // Check every 30s
        return () => clearInterval(idleTimer);
    }, [visible]);

    const triggerMessage = (text: string) => {
        setVisible(false);
        setIsThinking(true);
        
        setTimeout(() => {
            setIsThinking(false);
            setMessage(text);
            setVisible(true);
            setTimeout(() => setVisible(false), 8000);
        }, 1000);
    };

    return (
        <div className={`
            absolute top-32 left-8 z-40 max-w-xs transition-all duration-500
            ${visible || isThinking ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10 pointer-events-none'}
        `}>
            {/* The Host Avatar (Shadowy Figure) */}
            <div className="flex items-end gap-3">
                <div className="w-16 h-16 rounded-full bg-black border-2 border-neon-pink shadow-[0_0_20px_#d946ef] relative overflow-hidden shrink-0 group">
                     <div className="absolute bottom-0 w-full h-4/5 bg-gray-900 rounded-t-full mx-auto left-0 right-0 max-w-[80%]"></div>
                     <div className="absolute top-6 left-3 w-3 h-1 bg-white shadow-[0_0_5px_white] animate-pulse"></div>
                     <div className="absolute top-6 right-3 w-3 h-1 bg-white shadow-[0_0_5px_white] animate-pulse"></div>
                     <div className="absolute inset-0 bg-red-500/0 group-hover:bg-red-500/20 transition-colors"></div>
                </div>

                {/* Speech Bubble */}
                <div className="relative bg-black/90 border border-white/20 p-4 rounded-t-2xl rounded-br-2xl text-sm font-mono leading-relaxed shadow-xl max-w-[250px] animate-in slide-in-from-left duration-300">
                    <div className="text-neon-pink text-xs font-bold uppercase mb-1 tracking-widest flex justify-between">
                        <span>The Host</span>
                        {isThinking && <span className="animate-pulse">...</span>}
                    </div>
                    {isThinking ? (
                        <div className="flex gap-1 h-5 items-center">
                            <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"></div>
                            <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce delay-100"></div>
                            <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce delay-200"></div>
                        </div>
                    ) : (
                        <p className="text-gray-200 italic">"{message}"</p>
                    )}
                    
                    {/* Tail */}
                    <div className="absolute bottom-0 -left-2 w-4 h-4 bg-black/90 border-b border-l border-white/20 transform rotate-45"></div>
                </div>
            </div>
        </div>
    );
};

export default HostCommentary;