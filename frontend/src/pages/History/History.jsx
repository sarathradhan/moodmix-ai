/**
 * History page (/history) — lists past mood entries for the logged-in user.
 * Fetches via useHistory; each entry shows text, emotions, date, and saved genres/tracks.
 */
import { Link } from 'react-router-dom';
import LoadingSpinner from '../../components/common/LoadingSpinner.jsx';
import ErrorMessage from '../../components/common/ErrorMessage.jsx';
import GenreRecommendations from '../../components/playlist/GenreRecommendations.jsx';
import { useHistory } from '../../hooks/useHistory.js';
import { ROUTES } from '../../utils/constants.js';

function History() {
  const { items, loading, error, refetch } = useHistory();

  return (
    <section className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Your History</h1>
        <button
          type="button"
          onClick={refetch}
          className="text-sm text-moodmix-primary hover:underline"
          disabled={loading}
        >
          Refresh
        </button>
      </div>

      {loading && <LoadingSpinner />}
      <ErrorMessage message={error} />

      {!loading && !error && items.length === 0 && (
        <p className="text-slate-400">
          No mood entries yet.{' '}
          <Link to={ROUTES.HOME} className="text-moodmix-primary hover:underline">
            Analyze your first mood
          </Link>
        </p>
      )}

      <ul className="space-y-10">
        {items.map((entry) => (
          <li key={entry.id} className="border border-slate-700 rounded-lg p-4 space-y-4">
            <p className="text-slate-300">&ldquo;{entry.text}&rdquo;</p>
            <div className="flex flex-wrap gap-2 text-sm">
              {(entry.emotions || []).map((e) => (
                <span key={e} className="bg-slate-800 px-2 py-0.5 rounded">
                  {e}
                </span>
              ))}
            </div>
            <p className="text-xs text-slate-500">
              {entry.createdAt
                ? new Date(entry.createdAt).toLocaleString()
                : 'Unknown date'}
            </p>
            {entry.genres?.length > 0 && (
              <GenreRecommendations genres={entry.genres} />
            )}
          </li>
        ))}
      </ul>
    </section>
  );
}

export default History;
