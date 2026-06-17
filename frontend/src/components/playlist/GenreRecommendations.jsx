/**
 * Displays music grouped by genre after mood analysis (or from history).
 * Each genre shows name, matched emotion, and a list of TrackRow items.
 * Props: genres[], musicSource ('itunes' | fallback) for the subtitle hint.
 */
import TrackRow from './TrackRow.jsx';

function GenreRecommendations({ genres = [], musicSource }) {
  if (!genres.length) return null;

  return (
    <section className="space-y-8">
      <div>
        <h2 className="text-lg font-semibold">Music for your mood</h2>
        <p className="text-sm text-slate-400 mt-1">
          {musicSource === 'itunes'
            ? 'Real songs by genre from Apple Music / iTunes'
            : 'Sample tracks (live search unavailable)'}
        </p>
      </div>

      {genres.map((genre) => (
        <article key={genre.id} className="space-y-3">
          <header className="flex flex-wrap items-baseline gap-2">
            <h3 className="text-base font-semibold text-moodmix-primary">{genre.name}</h3>
            {genre.matchedEmotion && (
              <span className="text-xs text-slate-500">
                matches &ldquo;{genre.matchedEmotion}&rdquo;
              </span>
            )}
          </header>
          <ul className="space-y-2">
            {(genre.tracks || []).map((track) => (
              <TrackRow key={track.id} track={track} />
            ))}
          </ul>
        </article>
      ))}
    </section>
  );
}

export default GenreRecommendations;
