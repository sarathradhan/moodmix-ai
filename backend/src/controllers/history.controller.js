import { isDatabaseConnected } from '../config/database.js';
import MoodHistory from '../models/MoodHistory.model.js';
import PlaylistHistory from '../models/PlaylistHistory.model.js';

function parseStoredMusic(data) {
  let genres = [];
  let playlists = [];
  let tracks = [];

  if (Array.isArray(data)) {
    playlists = data;
  } else if (data && typeof data === 'object') {
    genres = data.genres || [];
    playlists = data.playlists || [];
    tracks = data.tracks || [];
  }

  return { genres, playlists, tracks };
}

/** GET /api/v1/history — mood entries for the logged-in user */
export async function getHistory(req, res, next) {
  try {
    if (!isDatabaseConnected()) {
      return res.json({ items: [], message: 'Database not connected' });
    }

    const items = await MoodHistory.findRecentByUserId(req.userId, 50);

    const enriched = await Promise.all(
      items.map(async (mood) => {
        const playlistRows = await PlaylistHistory.findByMoodHistoryId(mood.id);
        let genres = [];
        let playlists = [];
        let tracks = [];

        for (const row of playlistRows) {
          const parsed = parseStoredMusic(row.playlists);
          if (parsed.genres.length) genres = parsed.genres;
          playlists.push(...parsed.playlists);
          tracks.push(...parsed.tracks);
        }

        return { ...mood, genres, playlists, tracks };
      })
    );

    res.json({ items: enriched });
  } catch (err) {
    next(err);
  }
}
