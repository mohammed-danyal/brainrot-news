import { useState, useEffect, useMemo } from 'react';
import { fetchNewsData } from '../lib/api';

// Replace with your actual Google Sheet ID
const SHEET_ID = 'YOUR_GOOGLE_SHEET_ID_HERE'; 

export const useNewsData = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const news = await fetchNewsData(SHEET_ID);
        setData(news);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  // Memoize the derived state to prevent recalc on every render
  const { trending, latest } = useMemo(() => {
    if (!data.length) return { trending: [], latest: [] };
    
    // Top 3 are trending, rest are latest
    return {
      trending: data.slice(0, 3),
      latest: data.slice(3)
    };
  }, [data]);

  return { trending, latest, loading, error };
};