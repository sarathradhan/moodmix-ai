/**
 * Responsive grid of playlist cards — maps playlists[] to PlaylistCard.
 * Not used in current routes; intended for Spotify-style playlist browsing.
 */
import PlaylistCard from './PlaylistCard.jsx';

function PlaylistGrid({ playlists = [] }) {
  if (!playlists.length) {
    return <p className="text-slate-400">No playlists to display yet.</p>;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {playlists.map((playlist, index) => (
        <PlaylistCard key={playlist.id || index} {...playlist} />
      ))}
    </div>
  );
}

export default PlaylistGrid;
