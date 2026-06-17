import { getPool } from '../config/database.js';
import { mapMoodHistoryRow } from '../utils/rowMapper.js';

/** Stored mood analysis per user — PostgreSQL data access */
const MoodHistory = {
  async findRecentByUserId(userId, limit = 50) {
    const { rows } = await getPool().query(
      `SELECT * FROM mood_history
       WHERE user_id = $1
       ORDER BY created_at DESC
       LIMIT $2`,
      [userId, limit]
    );
    return rows.map(mapMoodHistoryRow);
  },

  async create({ userId, text, emotions = [], primaryEmotion, spotifyKeywords = [] }) {
    const { rows } = await getPool().query(
      `INSERT INTO mood_history (user_id, text, emotions, primary_emotion, spotify_keywords)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [userId, text, emotions, primaryEmotion ?? null, spotifyKeywords]
    );
    return mapMoodHistoryRow(rows[0]);
  },
};

export default MoodHistory;
