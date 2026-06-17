export const EMOTIONS = [
  'happy',
  'sad',
  'angry',
  'relaxed',
  'anxious',
  'energetic',
  'calm',
];

/** Emotion → search keyword mapping (stored in mood_history.spotify_keywords) */
export const EMOTION_KEYWORD_MAP = {
  happy: ['upbeat', 'feel good'],
  sad: ['sad', 'melancholy'],
  angry: ['rock', 'intense'],
  relaxed: ['chill', 'lo-fi'],
  anxious: ['ambient', 'calming'],
  energetic: ['workout', 'dance'],
  calm: ['peaceful', 'meditation'],
};
