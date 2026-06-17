/**
 * One playlist tile — cover image, name, link to open on Spotify.
 * Consumed by PlaylistGrid only (not used on live pages yet).
 */
function PlaylistCard({ name, imageUrl, externalUrl }) {
  return (
    <article className="rounded-lg bg-slate-800 p-4 border border-slate-700">
      {imageUrl && (
        <img src={imageUrl} alt={name} className="w-full aspect-square object-cover rounded-md mb-3" />
      )}
      <h3 className="font-semibold">{name || 'Playlist'}</h3>
      {externalUrl && (
        <a href={externalUrl} target="_blank" rel="noreferrer" className="text-sm text-moodmix-primary mt-2 inline-block">
          Open in Spotify
        </a>
      )}
    </article>
  );
}

export default PlaylistCard;
