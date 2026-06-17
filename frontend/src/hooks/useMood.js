import { useState } from 'react';
import { moodApi } from '../services/api.js';

/** Hook for mood submission — POST /api/v1/mood */
export function useMood() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const analyzeMood = async (text) => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await moodApi.analyze(text);
      return data;
    } catch (err) {
      const message =
        err.response?.data?.error || err.message || 'Failed to analyze mood';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { analyzeMood, loading, error, clearError: () => setError(null) };
}
