/**
 * Home page (/) — main mood entry flow.
 * User types mood → analyzeMood API → results stored in AppContext → navigate to /results.
 */
import { useNavigate } from 'react-router-dom';
import MoodInput from '../../components/mood/MoodInput.jsx';
import MoodSubmitButton from '../../components/mood/MoodSubmitButton.jsx';
import ErrorMessage from '../../components/common/ErrorMessage.jsx';
import { useAppContext } from '../../context/AppContext.jsx';
import { useMood } from '../../hooks/useMood.js';
import { ROUTES } from '../../utils/constants.js';

function Home() {
  const navigate = useNavigate();
  const { moodText, setMoodText, setMoodAnalysis } = useAppContext();
  const { analyzeMood, loading, error, clearError } = useMood();

  // POST mood text; on success save analysis and go to Results
  const handleSubmit = async () => {
    if (!moodText.trim() || loading) return;
    clearError();

    try {
      const data = await analyzeMood(moodText.trim());
      setMoodAnalysis(data);
      navigate(ROUTES.RESULTS);
    } catch {
      // error state handled by useMood
    }
  };

  return (
    <section className="max-w-2xl mx-auto text-center space-y-6">
      <h1 className="text-3xl font-bold">How are you feeling?</h1>
      <p className="text-slate-400">Describe your mood and we&apos;ll find music that matches.</p>
      <MoodInput
        value={moodText}
        onChange={setMoodText}
        onSubmit={handleSubmit}
        disabled={loading}
      />
      <ErrorMessage message={error} />
      <MoodSubmitButton onClick={handleSubmit} loading={loading} disabled={!moodText.trim()} />
    </section>
  );
}

export default Home;
