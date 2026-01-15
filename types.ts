export type QuestionType = 'text' | 'video';

export interface BaseQuestion {
  id: string;
  type: QuestionType;
  prompt: string;
  options: string[];
  correctAnswerIndex: number;
}

export interface TextQuestion extends BaseQuestion {
  type: 'text';
}

export interface VideoQuestion extends BaseQuestion {
  type: 'video';
  youtubeId: string;
  startTime: number; // in seconds
  endTime: number;   // in seconds
  isAudioQuestion?: boolean; // New optional flag for "Blind Test"
}

export type Question = TextQuestion | VideoQuestion;

export interface Player {
  id: string;
  name: string;
  avatar: string;
  score: number;
  position: number; // Board position (0-40)
  isHost: boolean;
  isMe: boolean;
  mediaStatus: {
    audio: boolean;
    video: boolean;
  };
}

export enum GamePhase {
  LOBBY = 'LOBBY',
  BOARD = 'BOARD',
  TRIVIA_PENDING = 'TRIVIA_PENDING', // Showing prompt/video
  TRIVIA_ANSWERING = 'TRIVIA_ANSWERING', // Inputting answers
  TRIVIA_REVEAL = 'TRIVIA_REVEAL'
}

export interface GameState {
  roomCode: string;
  phase: GamePhase;
  currentPlayerTurn: string; // Player ID
  activeQuestion: Question | null;
  videoSync: {
    isPlaying: boolean;
    currentTime: number;
  };
}