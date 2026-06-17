import { useState, useEffect, useCallback } from 'react';
import { historyApi } from '../services/api.js';

/** Hook for mood history — GET /api/v1/history */
export function useHistory({ autoFetch = true } = {}) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchHistory = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await historyApi.list();
      setItems(data.items || []);
    } catch (err) {
      const message =
        err.response?.data?.error || err.message || 'Failed to load history';
      setError(message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (autoFetch) fetchHistory();
  }, [autoFetch, fetchHistory]);

  return { items, loading, error, refetch: fetchHistory };
}
