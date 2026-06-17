/**
 * Global React context for MoodMix.
 * Holds: logged-in user, auth loading flag, current mood text, detected emotions,
 * and the latest analysis payload (genres, ML source, music source, etc.).
 * On mount, calls GET /auth/me to restore session from cookie.
 * Exports AppProvider (wraps the app) and useAppContext() hook for consumers.
 */
import { createContext, useContext, useEffect, useState } from 'react';
import { authApi } from '../services/api.js';

const AppContext = createContext(null);

const initialAnalysis = {
  primary: null,
  spotifyKeywords: [],
  genres: [],
  historyId: null,
  emotionSource: null,
  musicSource: null,
  musicMessage: null,
  mlPredictions: null,
};

export function AppProvider({ children }) {
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [moodText, setMoodText] = useState('');
  const [emotions, setEmotions] = useState([]);
  const [analysis, setAnalysis] = useState(initialAnalysis);

  // Restore session from httpOnly cookie on first load
  useEffect(() => {
    authApi
      .me()
      .then(({ data }) => setUser(data.user))
      .catch(() => setUser(null))
      .finally(() => setAuthLoading(false));
  }, []);

  const setMoodAnalysis = (data) => {
    setEmotions(data.emotions || []);
    setAnalysis({
      primary: data.primary ?? null,
      spotifyKeywords: data.spotifyKeywords || [],
      genres: data.genres || [],
      historyId: data.historyId ?? null,
      emotionSource: data.emotionSource ?? data.source ?? null,
      musicSource: data.musicSource ?? null,
      musicMessage: data.musicMessage ?? null,
      mlPredictions: data.mlPredictions ?? null,
    });
  };

  const clearMoodSession = () => {
    setMoodText('');
    setEmotions([]);
    setAnalysis(initialAnalysis);
  };

  const logout = async () => {
    await authApi.logout();
    setUser(null);
    clearMoodSession();
  };

  const value = {
    user,
    setUser,
    authLoading,
    logout,
    moodText,
    setMoodText,
    emotions,
    setEmotions,
    analysis,
    setMoodAnalysis,
    clearMoodSession,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

/** Hook — read/update global state; must be used inside <AppProvider>. */
export function useAppContext() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useAppContext must be used within AppProvider');
  return ctx;
}
