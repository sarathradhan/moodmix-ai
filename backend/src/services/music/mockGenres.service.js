/** Offline fallback tracks when iTunes is unreachable */

import { pickRandom } from '../../utils/shuffle.js';

const MOCK_TRACKS = {
  pop: [
    { id: 'm-pop-1', name: 'Sunshine Day', artist: 'The Brights', album: 'Feel Good', imageUrl: 'https://placehold.co/300x300/4c1d95/fff?text=Pop', previewUrl: null, externalUrl: 'https://music.apple.com' },
    { id: 'm-pop-2', name: 'Golden Hour', artist: 'Luna Ray', album: 'Golden Hour', imageUrl: 'https://placehold.co/300x300/6d28d9/fff?text=Pop', previewUrl: null, externalUrl: 'https://music.apple.com' },
    { id: 'm-pop-3', name: 'City Lights', artist: 'Metro Pulse', album: 'Neon', imageUrl: 'https://placehold.co/300x300/7c3aed/fff?text=Pop', previewUrl: null, externalUrl: 'https://music.apple.com' },
  ],
  'lo-fi': [
    { id: 'm-lofi-1', name: 'Rain on Glass', artist: 'Desk Coffee', album: 'Late Night', imageUrl: 'https://placehold.co/300x300/0f766e/fff?text=Lo-Fi', previewUrl: null, externalUrl: 'https://music.apple.com' },
    { id: 'm-lofi-2', name: 'Study Session', artist: 'Quiet Keys', album: 'Focus', imageUrl: 'https://placehold.co/300x300/115e59/fff?text=Lo-Fi', previewUrl: null, externalUrl: 'https://music.apple.com' },
    { id: 'm-lofi-3', name: 'Window Seat', artist: 'Soft Transit', album: 'Drift', imageUrl: 'https://placehold.co/300x300/134e4a/fff?text=Lo-Fi', previewUrl: null, externalUrl: 'https://music.apple.com' },
  ],
  ambient: [
    { id: 'm-amb-1', name: 'Deep Breath', artist: 'Aether Field', album: 'Still', imageUrl: 'https://placehold.co/300x300/1e3a5f/fff?text=Ambient', previewUrl: null, externalUrl: 'https://music.apple.com' },
    { id: 'm-amb-2', name: 'Floating', artist: 'Cloud Mind', album: 'Space', imageUrl: 'https://placehold.co/300x300/1e40af/fff?text=Ambient', previewUrl: null, externalUrl: 'https://music.apple.com' },
    { id: 'm-amb-3', name: 'Horizon', artist: 'Slow Dawn', album: 'Calm', imageUrl: 'https://placehold.co/300x300/1d4ed8/fff?text=Ambient', previewUrl: null, externalUrl: 'https://music.apple.com' },
  ],
  dance: [
    { id: 'm-dance-1', name: 'Night Pulse', artist: 'Club Nova', album: 'Dance Floor', imageUrl: 'https://placehold.co/300x300/db2777/fff?text=Dance', previewUrl: null, externalUrl: 'https://music.apple.com' },
    { id: 'm-dance-2', name: 'Move Together', artist: 'Beat Collective', album: 'Party', imageUrl: 'https://placehold.co/300x300/be185d/fff?text=Dance', previewUrl: null, externalUrl: 'https://music.apple.com' },
    { id: 'm-dance-3', name: 'Strobe', artist: 'DJ Prism', album: 'Lights', imageUrl: 'https://placehold.co/300x300/9d174d/fff?text=Dance', previewUrl: null, externalUrl: 'https://music.apple.com' },
  ],
  edm: [
    { id: 'm-edm-1', name: 'Peak Hour', artist: 'Synth Drive', album: 'Energy', imageUrl: 'https://placehold.co/300x300/0891b2/fff?text=EDM', previewUrl: null, externalUrl: 'https://music.apple.com' },
    { id: 'm-edm-2', name: 'Bass Drop', artist: 'Voltage', album: 'Workout', imageUrl: 'https://placehold.co/300x300/0e7490/fff?text=EDM', previewUrl: null, externalUrl: 'https://music.apple.com' },
    { id: 'm-edm-3', name: 'Riser', artist: 'Echo Unit', album: 'Build', imageUrl: 'https://placehold.co/300x300/155e75/fff?text=EDM', previewUrl: null, externalUrl: 'https://music.apple.com' },
  ],
  'indie-folk': [
    { id: 'm-folk-1', name: 'Empty Room', artist: 'Willow Street', album: 'Quiet Roads', imageUrl: 'https://placehold.co/300x300/475569/fff?text=Folk', previewUrl: null, externalUrl: 'https://music.apple.com' },
    { id: 'm-folk-2', name: 'Letters', artist: 'Paper Moon', album: 'Winter', imageUrl: 'https://placehold.co/300x300/64748b/fff?text=Folk', previewUrl: null, externalUrl: 'https://music.apple.com' },
    { id: 'm-folk-3', name: 'Fading Light', artist: 'North Cabin', album: 'Dusk', imageUrl: 'https://placehold.co/300x300/334155/fff?text=Folk', previewUrl: null, externalUrl: 'https://music.apple.com' },
  ],
  rock: [
    { id: 'm-rock-1', name: 'Breaker', artist: 'Iron Voltage', album: 'Live Wire', imageUrl: 'https://placehold.co/300x300/7f1d1d/fff?text=Rock', previewUrl: null, externalUrl: 'https://music.apple.com' },
    { id: 'm-rock-2', name: 'Afterburn', artist: 'Redline', album: 'Drive', imageUrl: 'https://placehold.co/300x300/991b1b/fff?text=Rock', previewUrl: null, externalUrl: 'https://music.apple.com' },
    { id: 'm-rock-3', name: 'Thunder Lane', artist: 'Stage Rush', album: 'Arena', imageUrl: 'https://placehold.co/300x300/b91c1c/fff?text=Rock', previewUrl: null, externalUrl: 'https://music.apple.com' },
  ],
};

const DEFAULT_MOCK = MOCK_TRACKS.pop;

export function getMockTracksForGenre(genreId, limit = 3) {
  const pool = MOCK_TRACKS[genreId] || DEFAULT_MOCK;
  return pickRandom(pool, limit);
}
