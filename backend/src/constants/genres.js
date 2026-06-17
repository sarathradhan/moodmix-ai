/** Mood emotion → music genres (types) with iTunes search queries */
export const EMOTION_GENRES = {
  happy: [
    { id: 'pop', name: 'Pop', searchQuery: 'upbeat pop hits' },
    { id: 'dance', name: 'Dance', searchQuery: 'feel good dance party' },
  ],
  sad: [
    { id: 'indie-folk', name: 'Indie Folk', searchQuery: 'sad indie acoustic' },
    { id: 'soul', name: 'Soul', searchQuery: 'melancholy soul ballads' },
  ],
  angry: [
    { id: 'rock', name: 'Rock', searchQuery: 'intense rock anthems' },
    { id: 'metal', name: 'Metal', searchQuery: 'heavy metal energy' },
  ],
  relaxed: [
    { id: 'lo-fi', name: 'Lo-Fi', searchQuery: 'chill lo-fi beats' },
    { id: 'chillout', name: 'Chillout', searchQuery: 'relaxing chillout lounge' },
  ],
  anxious: [
    { id: 'ambient', name: 'Ambient', searchQuery: 'calming ambient meditation' },
    { id: 'classical', name: 'Classical', searchQuery: 'peaceful classical piano' },
  ],
  energetic: [
    { id: 'edm', name: 'EDM', searchQuery: 'workout edm electronic' },
    { id: 'hip-hop', name: 'Hip-Hop', searchQuery: 'energetic hip hop' },
  ],
  calm: [
    { id: 'acoustic', name: 'Acoustic', searchQuery: 'soft acoustic peaceful' },
    { id: 'new-age', name: 'New Age', searchQuery: 'spa new age relaxation' },
  ],
};

export const DEFAULT_GENRES = [
  { id: 'chill', name: 'Chill', searchQuery: 'chill relaxing background music' },
  { id: 'indie', name: 'Indie', searchQuery: 'indie alternative mood' },
];

export const TRACKS_PER_GENRE = 3;
/** iTunes results to fetch per genre before shuffling down to TRACKS_PER_GENRE */
export const ITUNES_FETCH_POOL = 50;
