import { useState, useEffect, useCallback } from 'react';
import { getAuthData } from '../api/apiClient';

/**
 * Custom hook for fetching and managing user playlists
 * Fetches playlists from the backend API and provides refetch capability
 * @returns {object} Object containing playlists array, loading state, error, and refetch function
 */
// PUBLIC_INTERFACE
export function usePlaylists() {
  const [playlists, setPlaylists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { accessToken } = getAuthData();

  const fetchPlaylists = useCallback(async () => {
    if (!accessToken) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/playlists`, {
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch playlists');
      }
      
      const data = await response.json();
      setPlaylists(data.playlists || []);
    } catch (error) {
      console.error('Error fetching playlists:', error);
      setError(error.message);
      setPlaylists([]);
    } finally {
      setLoading(false);
    }
  }, [accessToken]);

  useEffect(() => {
    fetchPlaylists();
  }, [fetchPlaylists]);

  return { playlists, loading, error, refetch: fetchPlaylists };
}
