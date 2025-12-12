import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { login, storeAuthData } from '../api/apiClient';
import './Auth.css';

/**
 * Login page component
 * Allows users to authenticate with email and password
 */
// PUBLIC_INTERFACE
function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  /**
   * Handles form submission for login
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Basic validation
    if (!email || !password) {
      setError('Email and password are required');
      setLoading(false);
      return;
    }

    try {
      const response = await login(email, password);
      
      // Store authentication data
      if (response.access_token && response.user) {
        storeAuthData(response.access_token, response.user);
        
        // Redirect to home page
        navigate('/');
      } else {
        setError('Login failed. Please try again.');
      }
    } catch (err) {
      setError(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container spotify-theme">
      <div className="auth-card spotify-card">
        <h1 className="auth-title spotify-title">Log in to Music Streamer</h1>
        
        <form onSubmit={handleSubmit} className="auth-form">
          {error && <div className="error-message spotify-error">{error}</div>}
          
          <div className="form-group">
            <label htmlFor="email">Email address</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email address"
              disabled={loading}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              disabled={loading}
              required
            />
          </div>

          <button 
            type="submit" 
            className="auth-button spotify-button"
            disabled={loading}
          >
            {loading ? 'Logging in...' : 'Log In'}
          </button>
        </form>

        <div className="auth-divider"></div>

        <p className="auth-footer spotify-footer">
          Don't have an account? <Link to="/register" className="spotify-link">Sign up for Music Streamer</Link>
        </p>
      </div>
    </div>
  );
}

export default Login;
