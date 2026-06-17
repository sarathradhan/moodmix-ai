import { ITUNES_FETCH_POOL, TRACKS_PER_GENRE } from '../../constants/genres.js';
import { pickRandom } from '../../utils/shuffle.js';
import { pickGenresForMood } from '../mood/emotionGenre.mapper.js';
import { searchTracks } from './itunes.service.js';
import { getMockTracksForGenre } from './mockGenres.service.js';

/**
 * Mood → genre types → TRACKS_PER_GENRE songs per genre (iTunes Search API).
 * Fetches ITUNES_FETCH_POOL hits per genre, shuffles, then picks TRACKS_PER_GENRE.
 */
export async function getRecommendationsForMood({ primary, emotions }) {
  const genreDefs = pickGenresForMood({ emotions, primary, maxGenres: 3 });
  let anyItunes = false;

  const genres = await Promise.all(
    genreDefs.map(async (def) => {
      const pool = await searchTracks(def.searchQuery, ITUNES_FETCH_POOL);
      let tracks;
      if (pool.length) {
        anyItunes = true;
        tracks = pickRandom(pool, TRACKS_PER_GENRE);
      } else {
        tracks = getMockTracksForGenre(def.id, TRACKS_PER_GENRE);
      }

      return {
        id: def.id,
        name: def.name,
        matchedEmotion: def.matchedEmotion,
        searchQuery: def.searchQuery,
        tracks,
      };
    })
  );

  return {
    genres,
    musicSource: anyItunes ? 'itunes' : 'mock',
    musicMessage: anyItunes
      ? null
      : 'Using sample tracks — iTunes search was unavailable. Check your network and try again.',
  };
}
