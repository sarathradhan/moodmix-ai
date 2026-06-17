import { getPool } from '../config/database.js';
import { mapPlaylistHistoryRow } from '../utils/rowMapper.js';

/** Playlists returned for a mood session — PostgreSQL data access */
const PlaylistHistory = {
  async findByMoodHistoryId(moodHistoryId) {
    const { rows } = await getPool().query(
      'SELECT * FROM playlist_history WHERE mood_history_id = $1 ORDER BY created_at DESC',
      [moodHistoryId]
    );
    return rows.map(mapPlaylistHistoryRow);
  },

  async create({ userId, moodHistoryId, playlists = [] }) {
    const { rows } = await getPool().query(
      `INSERT INTO playlist_history (user_id, mood_history_id, playlists)
       VALUES ($1, $2, $3)
       RETURNING *`,
      [userId ?? null, moodHistoryId, JSON.stringify(playlists)]
    );
    return mapPlaylistHistoryRow(rows[0]);
  },
};

export default PlaylistHistory;
