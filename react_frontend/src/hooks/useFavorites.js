import { useState, useEffect, useCallback } from 'react';
import { getFavorites, isAuthenticated } from '../api/apiClient';

/**
 * Custom hook to fetch and cache user favorites
 * Provides favorites data, loading state, error handling, and refetch capability
 * @returns {object} Object containing favorites array, loading state, error, and refetch function
 */
// PUBLIC_INTERFACE
export function useFavorites() {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  /**
   * Fetches favorites from the backend API
   */
  const fetchFavorites = useCallback(async () => {
    // Only fetch if user is authenticated
    if (!isAuthenticated()) {
      setFavorites([]);
      setLoading(false);
      setError('Not authenticated');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      const response = await getFavorites();
      const favoritesData = response.favorites || [];
      
      setFavorites(favoritesData);
    } catch (err) {
      console.error('Error fetching favorites:', err);
      setError(err.message || 'Failed to load favorites');
      setFavorites([]);
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Refetch favorites (useful after adding/removing favorites)
   */
  const refetch = useCallback(() => {
    return fetchFavorites();
  }, [fetchFavorites]);

  // Fetch favorites on mount
  useEffect(() => {
    fetchFavorites();
  }, [fetchFavorites]);

  return {
    favorites,
    loading,
    error,
    refetch
  };
}
