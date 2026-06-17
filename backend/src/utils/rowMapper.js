/** Maps PostgreSQL snake_case rows to API-friendly camelCase */
export function mapMoodHistoryRow(row) {
  return {
    id: row.id,
    userId: row.user_id,
    text: row.text,
    emotions: row.emotions,
    primaryEmotion: row.primary_emotion,
    spotifyKeywords: row.spotify_keywords,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export function mapUserRow(row) {
  return {
    id: row.id,
    email: row.email,
    passwordHash: row.password_hash,
    displayName: row.display_name,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export function mapPlaylistHistoryRow(row) {
  return {
    id: row.id,
    userId: row.user_id,
    moodHistoryId: row.mood_history_id,
    playlists: row.playlists,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}
