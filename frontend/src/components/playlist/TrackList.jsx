/**
 * Flat list of recommended tracks (alternative to genre-grouped layout).
 * Not wired into any page yet — kept for a simpler "all songs in one list" UI.
 */
function TrackList({ tracks = [] }) {
  if (!tracks.length) return null;

  return (
    <section className="space-y-3">
      <h2 className="text-lg font-semibold">Recommended songs</h2>
      <ul className="space-y-2">
        {tracks.map((track) => (
          <li
            key={track.id}
            className="flex items-center gap-3 rounded-lg bg-slate-800 border border-slate-700 p-3"
          >
            {track.imageUrl && (
              <img
                src={track.imageUrl}
                alt=""
                className="h-12 w-12 rounded object-cover shrink-0"
              />
            )}
            <div className="min-w-0 flex-1 text-left">
              <p className="font-medium truncate">{track.name}</p>
              <p className="text-sm text-slate-400 truncate">{track.artist}</p>
            </div>
            {track.externalUrl && (
              <a
                href={track.externalUrl}
                target="_blank"
                rel="noreferrer"
                className="text-sm text-moodmix-primary shrink-0 hover:underline"
              >
                Open
              </a>
            )}
          </li>
        ))}
      </ul>
    </section>
  );
}

export default TrackList;
