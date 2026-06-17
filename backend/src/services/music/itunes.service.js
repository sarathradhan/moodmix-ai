import axios from 'axios';
import logger from '../../utils/logger.js';

const ITUNES_SEARCH = 'https://itunes.apple.com/search';

function mapTrack(item) {
  const art = item.artworkUrl100 || item.artworkUrl60;
  return {
    id: String(item.trackId),
    name: item.trackName,
    artist: item.artistName,
    album: item.collectionName || null,
    imageUrl: art ? art.replace('100x100bb', '300x300bb') : null,
    previewUrl: item.previewUrl || null,
    externalUrl: item.trackViewUrl || null,
    durationMs: item.trackTimeMillis ?? null,
  };
}

/** Search iTunes for songs — no API key required */
export async function searchTracks(query, limit = 3) {
  const term = String(query || '').trim();
  if (!term) return [];

  try {
    const { data } = await axios.get(ITUNES_SEARCH, {
      params: {
        term,
        media: 'music',
        entity: 'song',
        limit,
        country: 'US',
      },
      timeout: 10000,
    });

    const tracks = (data.results || []).map(mapTrack);
    logger.info(`iTunes search "${term}" → ${tracks.length} tracks`);
    return tracks;
  } catch (err) {
    logger.error('iTunes search failed:', err.message);
    return [];
  }
}
