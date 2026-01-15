import React, { useEffect, useState, useRef } from 'react';
import ReactPlayer from 'react-player/youtube';
import { useQuestion } from '../contexts/QuestionContext';

interface VideoPlayerProps {
  youtubeId: string;
  startTime: number;
  endTime: number;
  isAudioMode?: boolean;
  isRevealed?: boolean;
}

// Client-side only wrapper to avoid hydration issues
const ClientOnly: React.FC<{children: React.ReactNode}> = ({ children }) => {
    const [hasMounted, setHasMounted] = useState(false);
    useEffect(() => { setHasMounted(true); }, []);
    if (!hasMounted) return null;
    return <>{children}</>;
};

const VideoPlayer: React.FC<VideoPlayerProps> = ({ 
    youtubeId, 
    startTime, 
    endTime, 
    isAudioMode = false, 
    isRevealed = false 
}) => {
  const { videoState, toggleVideoState, isMyTurn } = useQuestion();
  const playerRef = useRef<any>(null);
  const [ready, setReady] = useState(false);
  const [isRestricted, setIsRestricted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Sync seek when question opens or ID changes
  useEffect(() => {
    if (playerRef.current && ready) {
        playerRef.current.seekTo(startTime, 'seconds');
    }
  }, [ready, startTime, youtubeId]);

  // Reset states when ID changes
  useEffect(() => {
    setError(null);
    setIsRestricted(false);
    setReady(false);
  }, [youtubeId]);

  // Construct URL
  const url = `https://www.youtube.com/watch?v=${youtubeId}`;

  const handlePlay = () => {
      // Only the active player controls the global sync
      if (isMyTurn) {
          toggleVideoState(true);
      }
  };

  const handlePause = () => {
      if (isMyTurn) {
          toggleVideoState(false);
      }
  };

  return (
    <div className="w-full h-full flex flex-col items-center bg-black relative group overflow-hidden rounded-xl">
       <ClientOnly>
          <div className="w-full h-full relative">
            
            {/* Loading Spinner */}
            {!ready && !error && !isRestricted && (
                <div className="absolute inset-0 flex items-center justify-center z-20 bg-gray-900 pointer-events-none">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-neon-blue"></div>
                </div>
            )}

            {/* BLIND TEST OVERLAY (Audio Mode) - Hides video until revealed */}
            {isAudioMode && !isRevealed && !isRestricted && (
                 <div className="absolute inset-0 z-30 bg-gray-900 flex flex-col items-center justify-center p-6 text-center border-4 border-neon-pink">
                     <div className="text-6xl mb-4 animate-bounce">🎧</div>
                     <h2 className="text-2xl md:text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-neon-pink to-white uppercase italic tracking-widest">
                         LISTEN CLOSELY
                     </h2>
                     <p className="text-neon-blue mt-2 font-mono">Video hidden until answer reveal</p>
                     <div className="mt-4 flex gap-2">
                        <span className="w-1 h-8 bg-neon-pink animate-pulse"></span>
                        <span className="w-1 h-12 bg-neon-blue animate-pulse delay-75"></span>
                        <span className="w-1 h-6 bg-purple-500 animate-pulse delay-150"></span>
                        <span className="w-1 h-10 bg-neon-pink animate-pulse delay-100"></span>
                     </div>
                 </div>
            )}
            
            {/* RESTRICTED / ERROR FALLBACK UI */}
            {(isRestricted || error) && (
                <div className="absolute inset-0 flex flex-col items-center justify-center z-40 bg-gray-900 text-white p-6 text-center border-2 border-red-500/50 rounded-lg">
                    <div className="text-4xl mb-4">
                        {isAudioMode ? '🔇' : '⚠️'}
                    </div>
                    <p className="text-red-400 font-bold mb-2">
                        {isAudioMode ? 'PLAYBACK RESTRICTED' : 'VIDEO RESTRICTED'}
                    </p>
                    <a 
                        href={`https://www.youtube.com/watch?v=${youtubeId}&t=${startTime}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-red-600 hover:bg-red-500 text-white font-bold py-3 px-6 rounded-full transition-transform transform hover:scale-105 shadow-lg flex items-center gap-2 mt-2"
                    >
                        <span>
                            {isAudioMode ? 'Video Restricted. Click to Listen in New Tab.' : 'Video Restricted. Click to Watch in New Tab.'}
                        </span>
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
                    </a>
                    <p className="text-xs text-gray-500 mt-4">
                         (Error 150/153) - Official content blocked on this domain.
                    </p>
                </div>
            )}

            {/* MAIN PLAYER */}
            {!isRestricted && !error && (
                <ReactPlayer
                    ref={playerRef}
                    url={url}
                    width="100%"
                    height="100%"
                    // MANUAL PLAY: Controlled by global state, but synced via onPlay
                    playing={videoState.isPlaying}
                    controls={true} // ENABLE NATIVE CONTROLS for manual play
                    muted={false} 
                    volume={1}
                    onPlay={handlePlay}
                    onPause={handlePause}
                    onError={(e) => {
                        console.error("YouTube Player Error:", e);
                        // Error 150/153: Embed restricted by owner
                        // Error 101: Same as 150 but for HTML5 player
                        if (e === 150 || e === 153 || e === 101) {
                            setIsRestricted(true);
                        } else if (e === 100) {
                            setError("Video not found (Error 100).");
                        }
                    }}
                    config={{
                        youtube: {
                            playerVars: { 
                                start: startTime,
                                end: endTime,
                                modestbranding: 1,
                                rel: 0,
                                showinfo: 1, // Fix: Show Info as requested
                                origin: typeof window !== 'undefined' ? window.location.origin : undefined // Fix: Origin for restriction resistance
                            }
                        }
                    }}
                    onReady={() => {
                        setReady(true);
                    }}
                />
            )}
          </div>
       </ClientOnly>
    </div>
  );
};

export default VideoPlayer;