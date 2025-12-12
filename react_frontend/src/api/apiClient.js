// API Client for backend communication
// PUBLIC_INTERFACE

/**
 * Base URL for API requests - uses environment variable or defaults to localhost
 */
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001';

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
