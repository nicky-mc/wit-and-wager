import React, { createContext, useContext, useState, useCallback, useEffect, useMemo } from 'react';
import { Question, GamePhase, Player } from '../types';
import { STATIC_QUESTIONS } from '../data/questions';
import { db, doc, updateDoc, setDoc, isRealDb } from '../services/firebaseConfig';
import { useGameSync } from '../hooks/useGameSync';

interface QuestionContextType {
  activeQuestion: Question | null;
  isLoadingQuestion: boolean;
  gamePhase: GamePhase;
  players: Player[];
  fetchNewQuestion: () => Promise<void>;
  submitAnswer: (answerIndex: number) => void;
  videoState: { isPlaying: boolean; currentTime: number };
  toggleVideoState: (playing: boolean) => void;
  movePlayer: (steps: number) => void;
  setGamePhase: (phase: GamePhase) => void;
  isMyTurn: boolean;
  amIHost: boolean;
  myId: string;
  currentPlayerId: string;
  endTurn: () => Promise<void>;
  lastEvent: { type: string; value?: any; timestamp: number } | null; // For Host Commentary
}

const QuestionContext = createContext<QuestionContextType | undefined>(undefined);

// Generate a random ID for this session if not persisted
const MY_ID = `player-${Math.floor(Math.random() * 10000)}`;
const ROOM_ID = "NEON-NIGHTS";

// Mock Fallbacks with TRAGEDY AVATARS
const MOCK_PLAYERS: Player[] = [
    { id: MY_ID, name: 'ME', avatar: '🗑️🔥', score: 0, position: 0, isHost: true, isMe: true, mediaStatus: {audio:true, video:true} },
    { id: 'bot1', name: 'CPU 1', avatar: '🤡', score: 0, position: 0, isHost: false, isMe: false, mediaStatus: {audio:true, video:true} },
    { id: 'bot2', name: 'CPU 2', avatar: '🥀', score: 0, position: 0, isHost: false, isMe: false, mediaStatus: {audio:true, video:true} },
    { id: 'bot3', name: 'CPU 3', avatar: '🥛', score: 0, position: 0, isHost: false, isMe: false, mediaStatus: {audio:true, video:true} },
];

export const QuestionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Sync Hook
  const { gameState, players: syncedPlayers, loading } = useGameSync(ROOM_ID);
  
  // Local state for Mock Mode / Transient UI
  const [localPlayers, setLocalPlayers] = useState<Player[]>(MOCK_PLAYERS);
  const [gamePhase, setGamePhase] = useState<GamePhase>(GamePhase.LOBBY);
  const [localActiveQuestion, setLocalActiveQuestion] = useState<Question | null>(null);
  const [localVideoState, setLocalVideoState] = useState({ isPlaying: false, currentTime: 0 });
  const [localCurrentPlayerId, setLocalCurrentPlayerId] = useState<string>(MY_ID);
  
  // Event tracking for the Host Roast System
  const [lastEvent, setLastEvent] = useState<{ type: string; value?: any; timestamp: number } | null>(null);

  // Derived state: Use DB state if available, else use Local state
  const isDb = isRealDb();
  
  const activeQuestion = isDb ? (gameState?.activeQuestion || null) : localActiveQuestion;
  const players = isDb ? syncedPlayers : localPlayers;
  
  // Turn Logic
  const currentPlayerId = isDb ? (gameState?.currentPlayerTurn || MY_ID) : localCurrentPlayerId;
  const isMyTurn = currentPlayerId === MY_ID;
  
  const amIHost = players.find(p => p.id === MY_ID)?.isHost || false;
  const videoState = isDb ? (gameState?.videoSync || { isPlaying: false, currentTime: 0 }) : localVideoState;

  // Initialize Game/Join Room (Real DB)
  useEffect(() => {
      if (!isDb) return;
      // Simplistic "Join" logic placeholder
  }, [isDb]);

  // Helper: Pick a random question
  const getRandomQuestion = (isForVideo: boolean): Question | null => {
     const availableQuestions = STATIC_QUESTIONS.filter(q => q.type === (isForVideo ? 'video' : 'text'));
     if (availableQuestions.length === 0) return null;
     const randomQ = availableQuestions[Math.floor(Math.random() * availableQuestions.length)];
     return {
        ...randomQ,
        id: `q-${Date.now()}`,
        type: randomQ.type as 'text' | 'video',
        youtubeId: randomQ.youtubeId || '',
        startTime: randomQ.startTime || 0,
        endTime: randomQ.endTime || 0
     };
  };

  const movePlayer = useCallback(async (steps: number) => {
    // Event Trigger for Host
    if (steps === 1) {
        setLastEvent({ type: 'rolled_one', value: steps, timestamp: Date.now() });
    }

    // 1. Determine current position
    let currentPos = 0;
    const myPlayer = players.find(p => p.id === MY_ID);
    if (myPlayer) currentPos = myPlayer.position;

    // 2. Calculate New Position
    const newPosition = Math.min(currentPos + steps, 23);
    
    // 3. Check for Question Trigger (every 3rd tile is video, others are text)
    const isVideoTile = newPosition % 3 === 0 && newPosition !== 0;
    const newQuestion = getRandomQuestion(isVideoTile);

    // 4. Update State
    if (isDb) {
        if (!gameState || !isMyTurn) return;

        const updatedPlayers = players.map(p => p.id === MY_ID ? { ...p, position: newPosition } : p);

        await updateDoc(doc(db, 'rooms', ROOM_ID), {
            players: updatedPlayers,
            activeQuestion: newQuestion,
            videoSync: { 
                isPlaying: false, 
                currentTime: (newQuestion && newQuestion.type === 'video') ? newQuestion.startTime : 0 
            }
        });
    } else {
        // Mock Mode
        setLocalPlayers(prev => prev.map(p => {
             if (p.isMe) return { ...p, position: newPosition };
             return p;
        }));
        
        // Trigger question after a small delay to simulate game feel
        if (newQuestion) {
            setTimeout(() => {
                setLocalActiveQuestion(newQuestion);
                if (newQuestion.type === 'video') {
                    setLocalVideoState({ isPlaying: false, currentTime: newQuestion.startTime });
                }
            }, 500);
        }
    }
  }, [isDb, gameState, players, isMyTurn]);

  const toggleVideoState = useCallback(async (playing: boolean) => {
      if (isDb) {
          await updateDoc(doc(db, 'rooms', ROOM_ID), {
              "videoSync.isPlaying": playing
          });
      } else {
          setLocalVideoState(prev => ({ ...prev, isPlaying: playing }));
      }
  }, [isDb]);

  const endTurn = useCallback(async () => {
    const currentIndex = players.findIndex(p => p.id === currentPlayerId);
    const nextIndex = (currentIndex + 1) % players.length;
    const nextPlayerId = players[nextIndex].id;

    if (isDb) {
        await updateDoc(doc(db, 'rooms', ROOM_ID), {
            currentPlayerTurn: nextPlayerId
        });
    } else {
        setLocalCurrentPlayerId(nextPlayerId);
    }
  }, [players, currentPlayerId, isDb]);

  // Mock Bot Turn Loop (Auto-pass turn back to player in mock mode)
  useEffect(() => {
    if (!isDb && currentPlayerId !== MY_ID) {
        const timer = setTimeout(() => {
            endTurn();
        }, 1500);
        return () => clearTimeout(timer);
    }
  }, [isDb, currentPlayerId, endTurn]);

  const submitAnswer = useCallback(async (answerIndex: number) => {
    if (!activeQuestion) return;
    
    const isCorrect = answerIndex === activeQuestion.correctAnswerIndex;
    const points = activeQuestion.type === 'video' ? 200 : 100;

    // Trigger Event for Host
    setLastEvent({ 
        type: isCorrect ? 'streak' : 'missed_question', 
        value: isCorrect, 
        timestamp: Date.now() 
    });

    if (isDb) {
        const updatedPlayers = players.map(p => {
            if (p.id === MY_ID) {
                return { ...p, score: p.score + (isCorrect ? points : 0) };
            }
            return p;
        });

        // Update score and clear active question, BUT DO NOT PASS TURN YET
        await updateDoc(doc(db, 'rooms', ROOM_ID), {
            players: updatedPlayers,
            activeQuestion: null
        });
    } else {
        // Mock Mode
        setLocalPlayers(prev => prev.map(p => p.isMe ? { ...p, score: p.score + (isCorrect ? points : 0)} : p));
        setLocalActiveQuestion(null); 
    }
  }, [activeQuestion, players, isDb]);

  // Compatibility function (not strictly needed with new movePlayer logic but kept for safety)
  const fetchNewQuestion = async () => {};

  return (
    <QuestionContext.Provider value={{
      activeQuestion,
      isLoadingQuestion: loading,
      gamePhase,
      players: players.map(p => ({...p, isMe: p.id === MY_ID})),
      setGamePhase,
      fetchNewQuestion,
      submitAnswer,
      videoState,
      toggleVideoState,
      movePlayer,
      isMyTurn, 
      amIHost,
      myId: MY_ID,
      currentPlayerId,
      endTurn,
      lastEvent
    }}>
      {children}
    </QuestionContext.Provider>
  );
};

export const useQuestion = () => {
  const context = useContext(QuestionContext);
  if (context === undefined) {
    throw new Error('useQuestion must be used within a QuestionProvider');
  }
  return context;
};