import { useState, useEffect } from 'react';

/**
 * Custom hook for searching tracks on Audius API
 * Searches for tracks based on query string and returns results
 * @param {string} query - Search query string
 * @returns {object} Object containing tracks array, loading state, and error state
 */
// PUBLIC_INTERFACE
export function useAudiusSearch(query) {
  const [tracks, setTracks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Don't search if query is empty
    if (!query || query.trim() === '') {
      setTracks([]);
      setLoading(false);
      setError(null);
      return;
    }

    const searchTracks = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const response = await fetch(
          `https://discoveryprovider.audius.co/v1/tracks/search?query=${encodeURIComponent(query)}`
        );
        
        if (!response.ok) {
          throw new Error('Failed to search tracks');
        }
        
        const data = await response.json();
        
        // Extract track data from Audius API response
        if (data && data.data) {
          setTracks(data.data);
        } else {
          setTracks([]);
        }
      } catch (err) {
        console.error('Error searching Audius tracks:', err);
        setError(err.message || 'Failed to search tracks');
        setTracks([]);
      } finally {
        setLoading(false);
      }
    };

    // Debounce search to avoid too many API calls
    const timeoutId = setTimeout(() => {
      searchTracks();
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [query]);

  return { tracks, loading, error };
}
