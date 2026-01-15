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
  sabotagePlayer: (targetId: string, type: 'freeze' | 'bomb') => Promise<void>;
  lastEvent: { type: string; value?: any; timestamp: number } | null;
  winnerId: string | null;
}

const QuestionContext = createContext<QuestionContextType | undefined>(undefined);

const MY_ID = `player-${Math.floor(Math.random() * 10000)}`;
const ROOM_ID = "NEON-NIGHTS";

const MOCK_PLAYERS: Player[] = [
    { id: MY_ID, name: 'ME', avatar: '🗑️🔥', score: 300, position: 0, isHost: true, isMe: true, mediaStatus: {audio:true, video:true} },
    { id: 'bot1', name: 'CPU 1', avatar: '🤡', score: 100, position: 0, isHost: false, isMe: false, mediaStatus: {audio:true, video:true} },
    { id: 'bot2', name: 'CPU 2', avatar: '🥀', score: 100, position: 0, isHost: false, isMe: false, mediaStatus: {audio:true, video:true} },
    { id: 'bot3', name: 'CPU 3', avatar: '🥛', score: 100, position: 0, isHost: false, isMe: false, mediaStatus: {audio:true, video:true} },
];

export const QuestionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { gameState, players: syncedPlayers, loading } = useGameSync(ROOM_ID);
  
  const [localPlayers, setLocalPlayers] = useState<Player[]>(MOCK_PLAYERS);
  const [gamePhase, setGamePhase] = useState<GamePhase>(GamePhase.LOBBY);
  const [localActiveQuestion, setLocalActiveQuestion] = useState<Question | null>(null);
  const [localVideoState, setLocalVideoState] = useState({ isPlaying: false, currentTime: 0 });
  const [localCurrentPlayerId, setLocalCurrentPlayerId] = useState<string>(MY_ID);
  const [localWinnerId, setLocalWinnerId] = useState<string | null>(null);
  
  const [lastEvent, setLastEvent] = useState<{ type: string; value?: any; timestamp: number } | null>(null);

  const isDb = isRealDb();
  
  const activeQuestion = isDb ? (gameState?.activeQuestion || null) : localActiveQuestion;
  const players = isDb ? syncedPlayers : localPlayers;
  const currentPlayerId = isDb ? (gameState?.currentPlayerTurn || MY_ID) : localCurrentPlayerId;
  const winnerId = isDb ? (gameState?.winnerId || null) : localWinnerId;
  const isMyTurn = currentPlayerId === MY_ID;
  
  const amIHost = players.find(p => p.id === MY_ID)?.isHost || false;
  const videoState = isDb ? (gameState?.videoSync || { isPlaying: false, currentTime: 0 }) : localVideoState;

  // Initialize
  useEffect(() => {
      if (!isDb) return;
  }, [isDb]);

  const getRandomQuestion = (isForVideo: boolean): Question | null => {
     // Get all eligible questions
     let availableQuestions = STATIC_QUESTIONS;
     
     // 70% chance to follow the tile type (Video vs Text), 30% chance of random chaos
     const strictMode = Math.random() > 0.3;
     if (strictMode) {
         availableQuestions = STATIC_QUESTIONS.filter(q => q.type === (isForVideo ? 'video' : 'text'));
     }

     if (availableQuestions.length === 0) return null;
     const randomQ = availableQuestions[Math.floor(Math.random() * availableQuestions.length)];
     return {
        ...randomQ,
        id: `q-${Date.now()}`,
        // Ensure type consistency if we pulled from a mixed bag
        type: randomQ.type as 'text' | 'video',
        youtubeId: randomQ.youtubeId || '',
        startTime: randomQ.startTime || 0,
        endTime: randomQ.endTime || 0
     };
  };

  const movePlayer = useCallback(async (steps: number) => {
    if (steps === 1) {
        setLastEvent({ type: 'rolled_one', value: steps, timestamp: Date.now() });
    }

    let currentPos = 0;
    const myPlayer = players.find(p => p.id === MY_ID);
    if (myPlayer) currentPos = myPlayer.position;

    // CAP AT 23 (End of board)
    const newPosition = Math.min(currentPos + steps, 23);
    
    // Check Win Condition
    if (newPosition >= 23) {
        setLastEvent({ type: 'win', timestamp: Date.now() });
        if (isDb) {
            await updateDoc(doc(db, 'rooms', ROOM_ID), {
                players: players.map(p => p.id === MY_ID ? { ...p, position: 23 } : p),
                winnerId: MY_ID,
                phase: GamePhase.GAME_OVER
            });
        } else {
            setLocalPlayers(prev => prev.map(p => p.isMe ? { ...p, position: 23 } : p));
            setLocalWinnerId(MY_ID);
        }
        return;
    }

    const isVideoTile = newPosition % 3 === 0 && newPosition !== 0;
    const newQuestion = getRandomQuestion(isVideoTile);

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
        setLocalPlayers(prev => prev.map(p => p.isMe ? { ...p, position: newPosition } : p));
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
          await updateDoc(doc(db, 'rooms', ROOM_ID), { "videoSync.isPlaying": playing });
      } else {
          setLocalVideoState(prev => ({ ...prev, isPlaying: playing }));
      }
  }, [isDb]);

  const endTurn = useCallback(async () => {
    const currentIndex = players.findIndex(p => p.id === currentPlayerId);
    const nextIndex = (currentIndex + 1) % players.length;
    const nextPlayer = players[nextIndex];

    // If next player is FROZEN, skip them too (simplistic) OR just pass turn to them and force them to click "Skip"
    // Let's pass to them, and UI will handle frozen state.

    if (isDb) {
        await updateDoc(doc(db, 'rooms', ROOM_ID), { currentPlayerTurn: nextPlayer.id });
    } else {
        setLocalCurrentPlayerId(nextPlayer.id);
    }
  }, [players, currentPlayerId, isDb]);

  const sabotagePlayer = useCallback(async (targetId: string, type: 'freeze' | 'bomb') => {
      const COST = 300;
      const myPlayer = players.find(p => p.id === MY_ID);
      
      if (!myPlayer || myPlayer.score < COST) return;

      setLastEvent({ type: 'sabotage', value: type, timestamp: Date.now() });

      if (isDb) {
          const updatedPlayers = players.map(p => {
              if (p.id === MY_ID) return { ...p, score: p.score - COST };
              if (p.id === targetId) {
                  if (type === 'freeze') return { ...p, statusEffect: 'frozen' as const };
                  if (type === 'bomb') return { ...p, position: Math.max(0, p.position - 3) };
              }
              return p;
          });
          await updateDoc(doc(db, 'rooms', ROOM_ID), { players: updatedPlayers });
      } else {
          setLocalPlayers(prev => prev.map(p => {
              if (p.id === MY_ID) return { ...p, score: p.score - COST };
              if (p.id === targetId) {
                  if (type === 'freeze') return { ...p, statusEffect: 'frozen' };
                  if (type === 'bomb') return { ...p, position: Math.max(0, p.position - 3) };
              }
              return p;
          }));
      }
  }, [players, isDb]);

  // Handle "Skip Turn" when frozen
  const skipFrozenTurn = useCallback(async () => {
      setLastEvent({ type: 'frozen_turn', timestamp: Date.now() });
      if (isDb) {
           const updatedPlayers = players.map(p => p.id === MY_ID ? { ...p, statusEffect: undefined } : p);
           // Clear status AND end turn
           await updateDoc(doc(db, 'rooms', ROOM_ID), { 
               players: updatedPlayers
           });
           // Small delay before passing turn so UI updates
           setTimeout(() => endTurn(), 500);
      } else {
          setLocalPlayers(prev => prev.map(p => p.isMe ? { ...p, statusEffect: undefined } : p));
          setTimeout(() => endTurn(), 500);
      }
  }, [players, isDb, endTurn]);

  // Mock Bot Turn Loop
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
    setLastEvent({ type: isCorrect ? 'streak' : 'missed_question', value: isCorrect, timestamp: Date.now() });

    if (isDb) {
        const updatedPlayers = players.map(p => {
            if (p.id === MY_ID) return { ...p, score: p.score + (isCorrect ? points : 0) };
            return p;
        });
        await updateDoc(doc(db, 'rooms', ROOM_ID), { players: updatedPlayers, activeQuestion: null });
    } else {
        setLocalPlayers(prev => prev.map(p => p.isMe ? { ...p, score: p.score + (isCorrect ? points : 0)} : p));
        setLocalActiveQuestion(null); 
    }
  }, [activeQuestion, players, isDb]);

  return (
    <QuestionContext.Provider value={{
      activeQuestion,
      isLoadingQuestion: loading,
      gamePhase,
      players: players.map(p => ({...p, isMe: p.id === MY_ID})),
      setGamePhase,
      fetchNewQuestion: async () => {},
      submitAnswer,
      videoState,
      toggleVideoState,
      movePlayer,
      isMyTurn, 
      amIHost,
      myId: MY_ID,
      currentPlayerId,
      endTurn: isMyTurn && players.find(p => p.id === MY_ID)?.statusEffect === 'frozen' ? skipFrozenTurn : endTurn,
      sabotagePlayer,
      lastEvent,
      winnerId
    }}>
      {children}
    </QuestionContext.Provider>
  );
};

export const useQuestion = () => {
  const context = useContext(QuestionContext);
  if (context === undefined) throw new Error('useQuestion must be used within a QuestionProvider');
  return context;
};