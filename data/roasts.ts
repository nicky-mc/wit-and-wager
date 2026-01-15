export interface Roast {
  id: string;
  trigger: 'missed_question' | 'rolled_one' | 'timeout' | 'streak' | 'waiting' | 'video_error' | 'chat_message' | 'game_start';
  text: string;
}

export const ROASTS: Roast[] = [
  {
    "id": "intro_1",
    "trigger": "game_start",
    "text": "Welcome to the game. Try not to embarrass yourselves, though statistically, one of you definitely will."
  },
  {
    "id": "fail_1",
    "trigger": "missed_question",
    "text": "That was a 50/50 chance and you still chose disappointment. Your parents must be used to this feeling."
  },
  {
    "id": "fail_1b",
    "trigger": "missed_question",
    "text": "I'd explain why you're wrong, but I don't have the crayons."
  },
  {
    "id": "fail_2",
    "trigger": "rolled_one",
    "text": "A one? Really? The universe is actively conspiring against you, and frankly, I'm on its side."
  },
  {
    "id": "fail_3",
    "trigger": "timeout",
    "text": "Take your time. It’s not like we’re all slowly marching towards the inevitable heat death of the universe or anything."
  },
  {
    "id": "win_1",
    "trigger": "streak",
    "text": "Don't get cocky. Even a broken clock is right twice a day. You're just currently in your 'right' minute."
  },
  {
    "id": "idle_1",
    "trigger": "waiting",
    "text": "Are you thinking, or did your brain just buffer? I've seen glaciers move with more urgency."
  },
  {
    "id": "video_fail",
    "trigger": "video_error",
    "text": "The video won't load. Probably for the best, your attention span was struggling anyway."
  },
  {
    "id": "social_1",
    "trigger": "chat_message",
    "text": "Oh look, typing. If only you put that much effort into being correct."
  }
];

export const getRandomRoast = (trigger: Roast['trigger']): string => {
    const candidates = ROASTS.filter(r => r.trigger === trigger);
    if (candidates.length === 0) return "I have no words for how mediocre that was.";
    return candidates[Math.floor(Math.random() * candidates.length)].text;
};
