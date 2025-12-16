// API Client for backend communication
// PUBLIC_INTERFACE

/**
 * Base URL for API requests - uses environment variable or defaults to same-origin
 */
const API_BASE_URL = process.env.REACT_APP_BACKEND_URL || '';

/**
 * Makes an HTTP request to the backend API
 * @param {string} endpoint - API endpoint path
 * @param {object} options - Fetch options (method, headers, body, etc.)
 * @returns {Promise<object>} Response data
 */
// PUBLIC_INTERFACE
async function apiRequest(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const defaultHeaders = {
    'Content-Type': 'application/json',
  };

  const config = {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
  };

  try {
    const response = await fetch(url, config);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Request failed');
    }

    return data;
  } catch (error) {
    throw error;
  }
}

/**
 * Registers a new user
 * @param {string} email - User email
 * @param {string} password - User password
 * @param {string} username - Optional username
 * @returns {Promise<object>} Registration response with access_token and user
 */
// PUBLIC_INTERFACE
export async function register(email, password, username = null) {
  const body = { email, password };
  if (username) {
    body.username = username;
  }
  
  return apiRequest('/api/auth/register', {
    method: 'POST',
    body: JSON.stringify(body),
  });
}

/**
 * Logs in an existing user
 * @param {string} email - User email
 * @param {string} password - User password
 * @returns {Promise<object>} Login response with access_token and user
 */
// PUBLIC_INTERFACE
export async function login(email, password) {
  return apiRequest('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
}

/**
 * Stores authentication data in localStorage
 * @param {string} accessToken - JWT access token
 * @param {object} user - User object
 */
// PUBLIC_INTERFACE
export function storeAuthData(accessToken, user) {
  localStorage.setItem('access_token', accessToken);
  localStorage.setItem('user', JSON.stringify(user));
}

/**
 * Retrieves stored authentication data
 * @returns {object} Object containing accessToken and user
 */
// PUBLIC_INTERFACE
export function getAuthData() {
  const accessToken = localStorage.getItem('access_token');
  const userStr = localStorage.getItem('user');
  const user = userStr ? JSON.parse(userStr) : null;
  
  return { accessToken, user };
}

/**
 * Clears authentication data from localStorage
 */
// PUBLIC_INTERFACE
export function clearAuthData() {
  localStorage.removeItem('access_token');
  localStorage.removeItem('user');
}

/**
 * Checks if user is authenticated
 * @returns {boolean} True if user has valid token
 */
// PUBLIC_INTERFACE
export function isAuthenticated() {
  const { accessToken } = getAuthData();
  return !!accessToken;
}

/**
 * Creates a new playlist for the authenticated user
 * @param {string} name - Playlist name
 * @param {string} description - Optional playlist description
 * @param {boolean} is_public - Optional public/private status (default true)
 * @returns {Promise<object>} Created playlist data
 */
// PUBLIC_INTERFACE
export async function createPlaylist(name, description = '', is_public = true) {
  const { accessToken } = getAuthData();
  
  if (!accessToken) {
    throw new Error('Not authenticated');
  }

  const payload = { name };
  if (description !== undefined && description !== null) {
    payload.description = description;
  }
  if (is_public !== undefined && is_public !== null) {
    payload.is_public = is_public;
  }

  return apiRequest('/api/playlists', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${accessToken}`
    },
    body: JSON.stringify(payload),
  });
}

/**
 * Fetches a playlist with its items (tracks)
 * @param {string} playlistId - Playlist ID
 * @returns {Promise<object>} Playlist data with items array
 */
// PUBLIC_INTERFACE
export async function getPlaylistWithItems(playlistId) {
  const { accessToken } = getAuthData();
  
  if (!accessToken) {
    throw new Error('Not authenticated');
  }

  return apiRequest(`/api/playlists/${playlistId}`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${accessToken}`
    }
  });
}

/**
 * Updates a playlist's description and/or is_public status
 * @param {string} playlistId - Playlist ID
 * @param {object} updates - Update data object
 * @param {string} updates.description - Optional playlist description
 * @param {boolean} updates.is_public - Optional public/private status
 * @returns {Promise<object>} Updated playlist data
 */
// PUBLIC_INTERFACE
export async function updatePlaylist(playlistId, updates) {
  const { accessToken } = getAuthData();
  
  if (!accessToken) {
    throw new Error('Not authenticated');
  }

  return apiRequest(`/api/playlists/${playlistId}`, {
    method: 'PATCH',
    headers: {
      'Authorization': `Bearer ${accessToken}`
    },
    body: JSON.stringify(updates)
  });
}

/**
 * Adds a track to a playlist
 * @param {string} playlistId - Playlist ID
 * @param {object} trackData - Track data object
 * @param {string} trackData.title - Track title
 * @param {number} trackData.duration_seconds - Track duration in seconds
 * @param {string} trackData.audius_track_id - Audius track ID
 * @param {string} trackData.audius_stream_url - Audius stream URL
 * @param {string} trackData.artist_name - Optional artist name
 * @returns {Promise<object>} Response with success message
 */
// PUBLIC_INTERFACE
export async function addTrackToPlaylist(playlistId, trackData) {
  const { accessToken } = getAuthData();
  
  if (!accessToken) {
    throw new Error('Not authenticated');
  }

  // Validate required fields
  if (!trackData.title || !trackData.duration_seconds || !trackData.audius_track_id || !trackData.audius_stream_url) {
    throw new Error('Missing required track data fields');
  }

  const payload = {
    title: trackData.title,
    duration_seconds: trackData.duration_seconds,
    audius_track_id: trackData.audius_track_id,
    audius_stream_url: trackData.audius_stream_url
  };

  // Include artist_name if provided
  if (trackData.artist_name) {
    payload.artist_name = trackData.artist_name;
  }

  return apiRequest(`/api/playlists/${playlistId}/items`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${accessToken}`
    },
    body: JSON.stringify(payload),
  });
}

/**
 * Fetches all favorites for the authenticated user
 * @returns {Promise<object>} Object containing favorites array with track metadata
 */
// PUBLIC_INTERFACE
export async function getFavorites() {
  const { accessToken } = getAuthData();
  
  if (!accessToken) {
    throw new Error('Not authenticated');
  }

  return apiRequest('/api/favorites', {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${accessToken}`
    }
  });
}

/**
 * Adds a track to favorites
 * @param {string} trackId - UUID of the track to add to favorites
 * @returns {Promise<object>} Response with favorite data
 */
// PUBLIC_INTERFACE
export async function addFavorite(trackId) {
  const { accessToken } = getAuthData();
  
  if (!accessToken) {
    throw new Error('Not authenticated');
  }

  return apiRequest('/api/favorites', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${accessToken}`
    },
    body: JSON.stringify({ track_id: trackId })
  });
}

/**
 * Removes a track from favorites
 * @param {string} trackId - UUID of the track to remove from favorites
 * @returns {Promise<object>} Response with success message
 */
// PUBLIC_INTERFACE
export async function removeFavorite(trackId) {
  const { accessToken } = getAuthData();
  
  if (!accessToken) {
    throw new Error('Not authenticated');
  }

  return apiRequest(`/api/favorites/${trackId}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${accessToken}`
    }
  });
}
