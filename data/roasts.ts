export interface Roast {
  id: string;
  trigger: 'missed_question' | 'rolled_one' | 'timeout' | 'streak' | 'waiting' | 'video_error' | 'chat_message' | 'game_start' | 'sabotage' | 'win' | 'frozen_turn';
  text: string;
}

export const ROASTS: Roast[] = [
  // --- GAME START ---
  { id: "intro_1", trigger: "game_start", text: "Welcome. Try not to embarrass yourselves, though statistically, one of you is destined to fail." },
  { id: "intro_2", trigger: "game_start", text: "I've simulated this game 14 million times. You lose in all of them. Good luck!" },
  { id: "intro_3", trigger: "game_start", text: "Participants detected. Intelligence levels: Questionable. Let's begin." },

  // --- SABOTAGE ---
  { id: "sab_1", trigger: "sabotage", text: "Oh, betrayal. Finally, some actual entertainment." },
  { id: "sab_2", trigger: "sabotage", text: "Money can't buy happiness, but it can buy your friend's misery, which is close enough." },
  { id: "sab_3", trigger: "sabotage", text: "A calculated strike. Ruthless. I almost respect it." },
  { id: "sab_4", trigger: "sabotage", text: "Friendship ended. Chaos initiated." },

  // --- FROZEN TURN ---
  { id: "frz_1", trigger: "frozen_turn", text: "You're frozen. Sit there and think about your poor life choices." },
  { id: "frz_2", trigger: "frozen_turn", text: "Skipped. You are currently as useful as a screen door on a submarine." },

  // --- MISSED QUESTION ---
  { id: "fail_1", trigger: "missed_question", text: "That was a 50/50 chance and you still chose disappointment." },
  { id: "fail_2", trigger: "missed_question", text: "I'd explain why you're wrong, but I don't have the crayons." },
  { id: "fail_3", trigger: "missed_question", text: "Incorrect. If ignorance is bliss, you must be in nirvana." },
  { id: "fail_4", trigger: "missed_question", text: "Swing and a miss. Just like your romantic life." },
  { id: "fail_5", trigger: "missed_question", text: "My algorithm just lowered your estimated IQ by 10 points." },
  { id: "fail_6", trigger: "missed_question", text: "Did you guess? It felt like a guess. A bad one." },
  { id: "fail_7", trigger: "missed_question", text: "Your confidence was inspiring. Your accuracy was depressing." },

  // --- ROLLED ONE ---
  { id: "roll_1", trigger: "rolled_one", text: "A one? The universe is screaming at you to stop." },
  { id: "roll_2", trigger: "rolled_one", text: "One step. Don't strain a muscle, athlete." },
  { id: "roll_3", trigger: "rolled_one", text: "I've seen glaciers recede faster than you're moving." },

  // --- STREAK / CORRECT ---
  { id: "win_1", trigger: "streak", text: "Don't get cocky. Even a broken clock is right twice a day." },
  { id: "win_2", trigger: "streak", text: "Correct. I suspect cheating, but I can't prove it yet." },
  { id: "win_3", trigger: "streak", text: "Enjoy the dopamine hit. The crash is coming." },
  { id: "win_4", trigger: "streak", text: "Wow, you actually knew that? I'm legitimately shocked." },

  // --- WAITING / IDLE ---
  { id: "idle_1", trigger: "waiting", text: "Are you thinking, or did your brain just buffer?" },
  { id: "idle_2", trigger: "waiting", text: "I'm aging. And I'm software. That shouldn't be possible." },
  { id: "idle_3", trigger: "waiting", text: "Please move. The heat death of the universe is approaching." },

  // --- WIN ---
  { id: "vic_1", trigger: "win", text: "Game Over. The simulation is complete. The rest of you are obsolete." },
  { id: "vic_2", trigger: "win", text: "We have a winner. The bar was low, but you stepped over it." }
];

export const getRandomRoast = (trigger: Roast['trigger']): string => {
    const candidates = ROASTS.filter(r => r.trigger === trigger);
    if (candidates.length === 0) return "Mediocrity detected.";
    return candidates[Math.floor(Math.random() * candidates.length)].text;
};