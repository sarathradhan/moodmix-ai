import { EMOTION_KEYWORD_MAP } from '../../constants/emotions.js';

/** Maps detected emotions to search keywords for history / metadata */
export function mapEmotionsToKeywords(emotions = []) {
  const keywords = emotions.flatMap((e) => EMOTION_KEYWORD_MAP[e] || []);
  return [...new Set(keywords)];
}
