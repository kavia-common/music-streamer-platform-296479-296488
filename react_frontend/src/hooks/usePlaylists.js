import { useState, useEffect } from 'react';
import { getAuthData } from '../api/apiClient';

/**
 * Custom hook for fetching and managing user playlists
 * Returns mock/empty state if backend endpoints are not yet available
 * @returns {object} Object containing playlists array and loading state
 */
// PUBLIC_INTERFACE
export function usePlaylists() {
  const [playlists, setPlaylists] = useState([]);
  const [loading, setLoading] = useState(true);
  const { accessToken } = getAuthData();

  useEffect(() => {
    const fetchPlaylists = async () => {
      setLoading(true);
      
      try {
        // TODO: Replace with actual API call when backend endpoint is ready
        // const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/playlists`, {
        //   headers: {
        //     'Authorization': `Bearer ${accessToken}`
        //   }
        // });
        // const data = await response.json();
        // setPlaylists(data);
        
        // Mock data for now
        await new Promise(resolve => setTimeout(resolve, 500));
        setPlaylists([]);
      } catch (error) {
        console.error('Error fetching playlists:', error);
        setPlaylists([]);
      } finally {
        setLoading(false);
      }
    };

    if (accessToken) {
      fetchPlaylists();
    } else {
      setLoading(false);
    }
  }, [accessToken]);

  return { playlists, loading };
}
