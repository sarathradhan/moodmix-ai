/**
 * Rule-based emotion detection — fallback when ML service is down
 * or USE_ML_SERVICE=false (Phase 3 uses HuggingFace as primary).
 */

const RULES = [
  { words: ['happy', 'joy', 'excited', 'great', 'amazing'], emotions: ['happy', 'energetic'] },
  { words: ['sad', 'lonely', 'depressed', 'down', 'cry'], emotions: ['sad'] },
  { words: ['angry', 'mad', 'furious', 'rage'], emotions: ['angry', 'energetic'] },
  { words: ['tired', 'stress', 'stressed', 'anxious', 'worried', 'overwhelmed'], emotions: ['anxious', 'calm'] },
  { words: ['relax', 'relaxed', 'peaceful', 'chill'], emotions: ['relaxed', 'calm'] },
  { words: ['focus', 'productive', 'work', 'study'], emotions: ['calm', 'energetic'] },
  { words: ['energy', 'energetic', 'pump', 'hype'], emotions: ['energetic', 'happy'] },
];

export function detectEmotionsFromText(text) {
  const lower = text.toLowerCase();
  const matched = new Set();

  for (const rule of RULES) {
    if (rule.words.some((w) => lower.includes(w))) {
      rule.emotions.forEach((e) => matched.add(e));
    }
  }

  const emotions = matched.size > 0 ? [...matched] : ['calm'];
  return {
    emotions,
    primary: emotions[0],
    scores: Object.fromEntries(emotions.map((e, i) => [e, 1 - i * 0.1])),
  };
}
