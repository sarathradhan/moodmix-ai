import { DEFAULT_GENRES, EMOTION_GENRES } from '../../constants/genres.js';

/** Pick up to `maxGenres` unique genres from detected emotions */
export function pickGenresForMood({ emotions = [], primary, maxGenres = 3 }) {
  const ordered = [
    primary,
    ...emotions.filter((e) => e && e !== primary),
  ].filter(Boolean);

  const picked = [];
  const seen = new Set();

  for (const emotion of ordered) {
    const genres = EMOTION_GENRES[emotion] || [];
    for (const genre of genres) {
      if (seen.has(genre.id)) continue;
      seen.add(genre.id);
      picked.push({ ...genre, matchedEmotion: emotion });
      if (picked.length >= maxGenres) return picked;
    }
  }

  for (const genre of DEFAULT_GENRES) {
    if (seen.has(genre.id)) continue;
    seen.add(genre.id);
    picked.push({ ...genre, matchedEmotion: null });
    if (picked.length >= maxGenres) return picked;
  }

  return picked.slice(0, maxGenres);
}
