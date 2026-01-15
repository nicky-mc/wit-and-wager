import { Question } from '../types';

export const STATIC_QUESTIONS: any[] = [
  // --- TEXT QUESTIONS ---
  {
    "id": "1",
    "type": "text",
    "prompt": "What is the official collective noun for a group of pugs?",
    "options": ["A Grumble", "A Snort", "A Wrinkle", "A Wheeze"],
    "correctAnswerIndex": 0
  },
  {
    "id": "2",
    "type": "text",
    "prompt": "Which planet in our solar system spins clockwise (retrograde rotation)?",
    "options": ["Mars", "Venus", "Jupiter", "Neptune"],
    "correctAnswerIndex": 1
  },
  {
    "id": "3",
    "type": "text",
    "prompt": "In professional pac-man, what is the maximum possible score?",
    "options": ["3,333,360", "999,999", "1,000,000", "500,000"],
    "correctAnswerIndex": 0
  },

  // --- STANDARD VIDEO QUESTIONS (Official Movie/TV Clips) ---
  {
    "id": "4",
    "type": "video",
    "isAudioQuestion": false,
    "prompt": "In this scene from 'The Matrix', how does Neo dodge the bullets?",
    "youtubeId": "NEuZgK669zY", // Official Warner Bros
    "startTime": 165,
    "endTime": 180,
    "options": ["He jumps over them", "He bends backwards", "He stops them in mid-air", "He uses a shield"],
    "correctAnswerIndex": 1
  },
  {
    "id": "5",
    "type": "video",
    "isAudioQuestion": false,
    "prompt": "In the 'Jurassic Park' T-Rex breakout scene, what item lures the dinosaur to the kids?",
    "youtubeId": "Rc_i5TKdmhs", // Official Movieclips
    "startTime": 125,
    "endTime": 140,
    "options": ["A flashlight", "A flare", "A sandwich", "A goat leg"],
    "correctAnswerIndex": 1
  },
  {
    "id": "6",
    "type": "video",
    "isAudioQuestion": false,
    "prompt": "In the 'Titanic' king of the world scene, who is standing behind Jack?",
    "youtubeId": "2e-eXJ6HgkQ", // Official Titanic Clip
    "startTime": 10,
    "endTime": 25,
    "options": ["Fabrizio", "Rose", "The Captain", "No one"],
    "correctAnswerIndex": 0
  },

  // --- AUDIO / BLIND TEST QUESTIONS (Official Music Videos / Themes) ---
  {
    "id": "7",
    "type": "video",
    "isAudioQuestion": true, // BLIND TEST
    "prompt": "Listen closely! Which 90s Sitcom uses this theme song?",
    "youtubeId": "iJ_0UqN8kM0", // The Rembrandts - I'll Be There For You (Official Video)
    "startTime": 0,
    "endTime": 15,
    "options": ["Friends", "Full House", "Fresh Prince", "Seinfeld"],
    "correctAnswerIndex": 0
  },
  {
    "id": "8",
    "type": "video",
    "isAudioQuestion": true, // BLIND TEST
    "prompt": "Name this iconic video game theme song.",
    "youtubeId": "M6PbdJiAK84", // Super Mario Bros. Theme (Official Nintendo/Orchestra)
    "startTime": 0,
    "endTime": 15,
    "options": ["Zelda", "Mario Bros", "Tetris", "Sonic"],
    "correctAnswerIndex": 1
  },
  {
    "id": "9",
    "type": "video",
    "isAudioQuestion": true, // BLIND TEST
    "prompt": "Who is the artist singing this hit song?",
    "youtubeId": "fJ9rUzIMcZQ", // Bohemian Rhapsody (Queen Official)
    "startTime": 55,
    "endTime": 70,
    "options": ["The Beatles", "David Bowie", "Queen", "Elton John"],
    "correctAnswerIndex": 2
  },
  {
    "id": "10",
    "type": "video",
    "isAudioQuestion": true, // BLIND TEST
    "prompt": "This dramatic score belongs to which movie franchise?",
    "youtubeId": "sFfqIHHojWo", // Star Wars - The Imperial March (Official)
    "startTime": 10,
    "endTime": 25,
    "options": ["Harry Potter", "Star Wars", "Lord of the Rings", "Indiana Jones"],
    "correctAnswerIndex": 1
  }
];