/**
 * Single song row — artwork, title, artist, optional preview audio, external link.
 * Used inside GenreRecommendations; track shape comes from the backend/iTunes API.
 */
function TrackRow({ track }) {
  return (
    <li className="flex items-center gap-3 rounded-lg bg-slate-800 border border-slate-700 p-3">
      {track.imageUrl && (
        <img
          src={track.imageUrl}
          alt=""
          className="h-12 w-12 rounded object-cover shrink-0"
        />
      )}
      <div className="min-w-0 flex-1">
        <p className="font-medium truncate">{track.name}</p>
        <p className="text-sm text-slate-400 truncate">{track.artist}</p>
        {track.previewUrl && (
          <audio
            controls
            preload="none"
            src={track.previewUrl}
            className="mt-2 w-full max-w-xs h-8"
          >
            Preview unavailable
          </audio>
        )}
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
  );
}

export default TrackRow;
