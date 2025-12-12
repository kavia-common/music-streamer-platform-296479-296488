import { useState, useEffect } from 'react';

/**
 * Custom hook for fetching trending tracks from Audius API
 * Fetches top 20 trending tracks on mount
 * @returns {object} Object containing tracks array, loading state, and error state
 */
// PUBLIC_INTERFACE
export function useAudiusTrending() {
  const [tracks, setTracks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTrendingTracks = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const response = await fetch('https://discoveryprovider.audius.co/v1/tracks/trending?limit=20');
        
        if (!response.ok) {
          throw new Error('Failed to fetch trending tracks');
        }
        
        const data = await response.json();
        
        // Extract track data from Audius API response
        if (data && data.data) {
          setTracks(data.data);
        } else {
          setTracks([]);
        }
      } catch (err) {
        console.error('Error fetching Audius trending tracks:', err);
        setError(err.message || 'Failed to load trending tracks');
        setTracks([]);
      } finally {
        setLoading(false);
      }
    };

    fetchTrendingTracks();
  }, []);

  return { tracks, loading, error };
}
