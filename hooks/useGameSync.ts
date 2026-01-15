import { useEffect, useState } from 'react';
import { db, doc, onSnapshot, isRealDb } from '../services/firebaseConfig';
import { GameState, Player, Question } from '../types';

const INITIAL_STATE: GameState = {
  roomCode: '',
  phase: 'LOBBY' as any,
  currentPlayerTurn: '',
  activeQuestion: null,
  videoSync: { isPlaying: false, currentTime: 0 }
};

export const useGameSync = (roomId: string) => {
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [players, setPlayers] = useState<Player[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!roomId || !isRealDb()) {
        setLoading(false);
        return;
    }

    const roomRef = doc(db, 'rooms', roomId);

    const unsubscribe = onSnapshot(roomRef, (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        setGameState({
          roomCode: roomId,
          phase: data.phase,
          currentPlayerTurn: data.currentPlayerTurn,
          activeQuestion: data.activeQuestion,
          videoSync: data.videoSync || { isPlaying: false, currentTime: 0 }
        });
        setPlayers(data.players || []);
      } else {
        console.log("No such room!");
      }
      setLoading(false);
    }, (error) => {
      console.error("Firestore sync error:", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [roomId]);

  return { gameState, players, loading };
};