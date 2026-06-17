/**
 * Results page (/results) — shows mood quote, emotion tags, ML scores,
 * music warnings, and GenreRecommendations. Redirects to Home if no analysis in context.
 */
import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import GenreRecommendations from '../../components/playlist/GenreRecommendations.jsx';
import { useAppContext } from '../../context/AppContext.jsx';
import { ROUTES } from '../../utils/constants.js';

function Results() {
  const navigate = useNavigate();
  const { moodText, emotions, analysis } = useAppContext();
  const {
    genres,
    primary,
    emotionSource,
    musicSource,
    musicMessage,
    mlPredictions,
  } = analysis;

  const hasResults =
    moodText || emotions.length > 0 || (genres && genres.length > 0);

  // Prevent landing here without going through Home analyze flow first
  useEffect(() => {
    if (!hasResults) {
      navigate(ROUTES.HOME, { replace: true });
    }
  }, [hasResults, navigate]);

  const topMl = mlPredictions?.slice(0, 3) ?? [];

  return (
    <section className="space-y-8">
      <header>
        <h1 className="text-2xl font-bold">Your Recommendations</h1>
        {moodText && <p className="text-slate-400 mt-2">&ldquo;{moodText}&rdquo;</p>}
        <p className="text-xs text-slate-500 mt-2 space-x-3">
          {emotionSource && (
            <span>Mood: {emotionSource === 'ml' ? 'ML model' : 'fallback'}</span>
          )}
          {musicSource && (
            <span>
              Music: {musicSource === 'itunes' ? 'iTunes / Apple Music' : 'sample data'}
            </span>
          )}
        </p>
      </header>

      {emotions.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {emotions.map((emotion) => (
            <span
              key={emotion}
              className={`px-3 py-1 rounded-full text-sm ${
                emotion === primary
                  ? 'bg-moodmix-primary text-white'
                  : 'bg-slate-800 text-slate-300'
              }`}
            >
              {emotion}
            </span>
          ))}
        </div>
      )}

      {topMl.length > 0 && (
        <div className="text-sm text-slate-400 border border-slate-700 rounded-lg p-3">
          <p className="font-medium text-slate-300 mb-2">Model scores (raw)</p>
          <ul className="space-y-1">
            {topMl.map((p) => (
              <li key={p.label}>
                {p.label}: {(p.score * 100).toFixed(1)}%
              </li>
            ))}
          </ul>
        </div>
      )}

      {musicMessage && (
        <p className="text-sm text-amber-400/90 bg-amber-950/30 border border-amber-900/50 rounded-lg px-3 py-2">
          {musicMessage}
        </p>
      )}

      <GenreRecommendations genres={genres} musicSource={musicSource} />

      <div className="flex gap-4 text-sm">
        <Link to={ROUTES.HOME} className="text-moodmix-primary hover:underline">
          Try another mood
        </Link>
        <Link to={ROUTES.HISTORY} className="text-slate-400 hover:text-slate-200">
          View history
        </Link>
      </div>
    </section>
  );
}

export default Results;
