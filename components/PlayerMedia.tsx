import React, { useEffect, useRef, useState } from 'react';
import { useQuestion } from '../contexts/QuestionContext';

const PlayerMedia: React.FC = () => {
  const { players } = useQuestion();
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const [isMuted, setIsMuted] = useState(false);

  useEffect(() => {
    const startVideo = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = stream;
        }
      } catch (err) {
        console.error("Error accessing media devices:", err);
      }
    };
    startVideo();
  }, []);

  const toggleMute = () => {
    if (localVideoRef.current && localVideoRef.current.srcObject) {
       const stream = localVideoRef.current.srcObject as MediaStream;
       stream.getAudioTracks().forEach(track => track.enabled = !track.enabled);
       setIsMuted(!isMuted);
    }
  };

  const myPlayer = players.find(p => p.isMe);
  const otherPlayers = players.filter(p => !p.isMe);

  return (
    <div className="h-full w-full bg-void border-l-2 border-neon-blue flex flex-col p-4 gap-4 overflow-y-auto">
      <h3 className="text-neon-pink font-bold tracking-widest text-center mb-2 uppercase text-sm border-b border-white/10 pb-2">
        Live Feeds
      </h3>
      
      {/* Local Player */}
      <div className="relative aspect-video w-full bg-black rounded-xl overflow-hidden border-2 border-neon-pink shadow-neon-pink group shrink-0">
        <video 
            ref={localVideoRef} 
            autoPlay 
            muted 
            playsInline 
            className="w-full h-full object-cover transform scale-x-[-1]" 
        />
        
        {/* Name & Score Badge */}
        <div className="absolute bottom-2 left-2 flex flex-col items-start gap-1">
            <div className="text-xs font-bold bg-black/70 px-2 py-0.5 rounded text-white border border-neon-pink/50">
                YOU
            </div>
            <div className="text-xs font-black bg-game-gold text-black px-2 py-0.5 rounded shadow-lg border border-white/30 flex items-center gap-1">
                <span>🏆</span>
                {myPlayer?.score || 0}
            </div>
        </div>

        <button 
            onClick={toggleMute}
            className={`absolute top-2 right-2 p-1.5 rounded-full transition-colors ${isMuted ? 'bg-red-500' : 'bg-gray-600/50 hover:bg-gray-600'}`}
        >
            {isMuted ? (
                 <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" /></svg>
            ) : (
                <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" /></svg>
            )}
        </button>
      </div>

      {/* Remote Players from Context */}
      {otherPlayers.map((player) => (
        <div key={player.id} className="relative aspect-video w-full bg-gray-800 rounded-xl overflow-hidden border border-neon-blue/50 opacity-90 hover:opacity-100 transition hover:shadow-neon-blue hover:border-neon-blue shrink-0">
             <img src={`https://picsum.photos/300/200?random=${player.id}`} alt="Player" className="w-full h-full object-cover" />
             
             {/* Name & Score Badge */}
             <div className="absolute bottom-2 left-2 flex flex-col items-start gap-1">
                <div className="text-xs font-bold bg-black/70 px-2 py-0.5 rounded text-white border border-white/10">
                    {player.name}
                </div>
                <div className="text-xs font-bold bg-slate-700 text-white px-2 py-0.5 rounded shadow-lg border border-white/20">
                    {player.score} PTS
                </div>
            </div>

             <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
             </div>
        </div>
      ))}
      
      {/* Chat remains at bottom */}
      <div className="mt-auto p-4 bg-white/5 rounded-xl border border-white/10">
        <h4 className="text-xs text-gray-400 uppercase tracking-wide mb-2">Game Chat</h4>
        <div className="h-32 overflow-y-auto text-sm space-y-2 pr-2">
            <p><span className="text-neon-pink font-bold">P1:</span> LOL that video!</p>
            <p><span className="text-neon-blue font-bold">P2:</span> My ears hurt</p>
            <p><span className="text-white font-bold">You:</span> Wait for the next one</p>
        </div>
        <input type="text" placeholder="Type..." className="w-full mt-2 bg-black/30 border border-white/20 rounded px-2 py-1 text-sm focus:border-neon-pink outline-none"/>
      </div>
    </div>
  );
};

export default PlayerMedia;