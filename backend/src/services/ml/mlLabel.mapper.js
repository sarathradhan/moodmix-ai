/**
 * Maps HuggingFace model labels → MoodMix emotion vocabulary.
 *
 * HF model (j-hartmann/emotion-english-distilroberta-base):
 *   anger, disgust, fear, joy, neutral, sadness, surprise
 *
 * MoodMix app emotions:
 *   happy, sad, angry, relaxed, anxious, energetic, calm
 */

export const ML_LABEL_TO_MOODMIX = {
  joy: ['happy', 'energetic'],
  sadness: ['sad'],
  anger: ['angry'],
  fear: ['anxious'],
  disgust: ['angry'],
  surprise: ['energetic', 'happy'],
  neutral: ['calm', 'relaxed'],
};

const SCORE_THRESHOLD = 0.08;
const MAX_MOODMIX_EMOTIONS = 4;

/**
 * Converts raw ML /predict response into MoodMix emotion format.
 * @param {Array<{label: string, score: number}>} predictions
 */
export function normalizeMlPredictions(predictions = []) {
  const sorted = [...predictions].sort((a, b) => b.score - a.score);

  const moodmixScores = {};
  for (const { label, score } of sorted) {
    const key = label.toLowerCase();
    const mapped = ML_LABEL_TO_MOODMIX[key] || ['calm'];
    for (const emotion of mapped) {
      moodmixScores[emotion] = Math.max(moodmixScores[emotion] || 0, score);
    }
  }

  const ranked = Object.entries(moodmixScores)
    .filter(([, score]) => score >= SCORE_THRESHOLD)
    .sort((a, b) => b[1] - a[1])
    .slice(0, MAX_MOODMIX_EMOTIONS);

  const emotions = ranked.map(([e]) => e);
  const primary = emotions[0] || 'calm';

  return {
    emotions: emotions.length ? emotions : ['calm'],
    primary,
    scores: Object.fromEntries(ranked),
    mlPredictions: sorted,
  };
}
