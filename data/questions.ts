import { Question } from '../types';

export const STATIC_QUESTIONS: any[] = [
  // --- TEXT QUESTIONS (General Knowledge / Science / Weird) ---
  {
    "id": "t1",
    "type": "text",
    "prompt": "What is the official collective noun for a group of pugs?",
    "options": ["A Grumble", "A Snort", "A Wrinkle", "A Wheeze"],
    "correctAnswerIndex": 0
  },
  {
    "id": "t2",
    "type": "text",
    "prompt": "Which planet in our solar system spins clockwise (retrograde rotation)?",
    "options": ["Mars", "Venus", "Jupiter", "Neptune"],
    "correctAnswerIndex": 1
  },
  {
    "id": "t3",
    "type": "text",
    "prompt": "In professional pac-man, what is the maximum possible score?",
    "options": ["3,333,360", "999,999", "1,000,000", "500,000"],
    "correctAnswerIndex": 0
  },
  {
    "id": "t4",
    "type": "text",
    "prompt": "What is the only mammal capable of true flight?",
    "options": ["Flying Squirrel", "Bat", "Sugar Glider", "Colugo"],
    "correctAnswerIndex": 1
  },
  {
    "id": "t5",
    "type": "text",
    "prompt": "Which element has the chemical symbol 'W'?",
    "options": ["Tungsten", "Wolframite", "Westonium", "Waspium"],
    "correctAnswerIndex": 0
  },
  {
    "id": "t6",
    "type": "text",
    "prompt": "How many hearts does an octopus have?",
    "options": ["One", "Two", "Three", "Four"],
    "correctAnswerIndex": 2
  },
  {
    "id": "t7",
    "type": "text",
    "prompt": "What was the first toy to be advertised on television?",
    "options": ["Barbie", "Mr. Potato Head", "GI Joe", "Slinky"],
    "correctAnswerIndex": 1
  },
  {
    "id": "t8",
    "type": "text",
    "prompt": "In what year was the first iPhone released?",
    "options": ["2005", "2006", "2007", "2008"],
    "correctAnswerIndex": 2
  },
  {
    "id": "t9",
    "type": "text",
    "prompt": "What is the tiny piece at the end of a shoelace called?",
    "options": ["Aglet", "Tablet", "Eyelet", "Piglet"],
    "correctAnswerIndex": 0
  },
  {
    "id": "t10",
    "type": "text",
    "prompt": "Which country consumes the most chocolate per capita?",
    "options": ["USA", "Belgium", "Switzerland", "Germany"],
    "correctAnswerIndex": 2
  },

  // --- VIDEO QUESTIONS (Movies / TV / Memes) ---
  {
    "id": "v1",
    "type": "video",
    "isAudioQuestion": false,
    "prompt": "In this scene from 'The Matrix', how does Neo dodge the bullets?",
    "youtubeId": "NEuZgK669zY", 
    "startTime": 165,
    "endTime": 180,
    "options": ["He jumps over them", "He bends backwards", "He stops them", "He uses a shield"],
    "correctAnswerIndex": 1
  },
  {
    "id": "v2",
    "type": "video",
    "isAudioQuestion": false,
    "prompt": "In the 'Jurassic Park' T-Rex breakout scene, what item lures the dinosaur?",
    "youtubeId": "Rc_i5TKdmhs",
    "startTime": 125,
    "endTime": 140,
    "options": ["A flashlight", "A flare", "A sandwich", "A goat leg"],
    "correctAnswerIndex": 1
  },
  {
    "id": "v3",
    "type": "video",
    "isAudioQuestion": false,
    "prompt": "In 'Titanic', who is standing behind Jack during this iconic scene?",
    "youtubeId": "2e-eXJ6HgkQ",
    "startTime": 10,
    "endTime": 25,
    "options": ["Fabrizio", "Rose", "The Captain", "No one"],
    "correctAnswerIndex": 0
  },
  {
    "id": "v4",
    "type": "video",
    "isAudioQuestion": false,
    "prompt": "What happens immediately after this moment in 'The Office' (Parkour)?",
    "youtubeId": "0KxG8hF0iIA",
    "startTime": 5,
    "endTime": 15,
    "options": ["Andy falls into a box", "Michael jumps on a truck", "Dwight peppersprays himself", "They break a lamp"],
    "correctAnswerIndex": 0
  },
  {
    "id": "v5",
    "type": "video",
    "isAudioQuestion": false,
    "prompt": "What color is the pill Morpheus offers Neo in the OTHER hand?",
    "youtubeId": "zE7PKRjrid4",
    "startTime": 40,
    "endTime": 55,
    "options": ["Blue", "Red", "Green", "Yellow"],
    "correctAnswerIndex": 0
  },

  // --- BLIND AUDIO TESTS (Music / Scores) ---
  {
    "id": "a1",
    "type": "video",
    "isAudioQuestion": true,
    "prompt": "Listen closely! Which 90s Sitcom uses this theme song?",
    "youtubeId": "iJ_0UqN8kM0",
    "startTime": 0,
    "endTime": 15,
    "options": ["Friends", "Full House", "Fresh Prince", "Seinfeld"],
    "correctAnswerIndex": 0
  },
  {
    "id": "a2",
    "type": "video",
    "isAudioQuestion": true,
    "prompt": "Name this iconic video game theme song.",
    "youtubeId": "M6PbdJiAK84",
    "startTime": 0,
    "endTime": 15,
    "options": ["Zelda", "Mario Bros", "Tetris", "Sonic"],
    "correctAnswerIndex": 1
  },
  {
    "id": "a3",
    "type": "video",
    "isAudioQuestion": true,
    "prompt": "Who is the artist singing this hit song?",
    "youtubeId": "fJ9rUzIMcZQ", 
    "startTime": 55,
    "endTime": 70,
    "options": ["The Beatles", "David Bowie", "Queen", "Elton John"],
    "correctAnswerIndex": 2
  },
  {
    "id": "a4",
    "type": "video",
    "isAudioQuestion": true,
    "prompt": "This dramatic score belongs to which movie franchise?",
    "youtubeId": "sFfqIHHojWo",
    "startTime": 10,
    "endTime": 25,
    "options": ["Harry Potter", "Star Wars", "LOTR", "Indiana Jones"],
    "correctAnswerIndex": 1
  },
  {
    "id": "a5",
    "type": "video",
    "isAudioQuestion": true,
    "prompt": "Identify this Netflix Intro Sound.",
    "youtubeId": "GV3HUDMQ-HK",
    "startTime": 0,
    "endTime": 4,
    "options": ["Hulu", "Netflix", "HBO", "Disney+"],
    "correctAnswerIndex": 1
  }
];