import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { register, storeAuthData } from '../api/apiClient';
import './Auth.css';

/**
 * Register page component
 * Allows new users to create an account with email, password, and optional username
 */
// PUBLIC_INTERFACE
function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  /**
   * Handles form submission for registration
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

    if (password.length < 6) {
      setError('Password must be at least 6 characters long');
      setLoading(false);
      return;
    }

    try {
      const response = await register(email, password, username || null);
      
      // Store authentication data
      if (response.access_token && response.user) {
        storeAuthData(response.access_token, response.user);
        
        // Redirect to home page
        navigate('/');
      } else {
        setError('Registration failed. Please try again.');
      }
    } catch (err) {
      setError(err.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container spotify-theme">
      <div className="auth-card spotify-card">
        <h1 className="auth-title spotify-title">Sign up for free to start listening</h1>
        
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
            <label htmlFor="username">Username (optional)</label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Choose a username"
              disabled={loading}
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
            {loading ? 'Creating account...' : 'Sign Up'}
          </button>
        </form>

        <div className="auth-divider"></div>

        <p className="auth-footer spotify-footer">
          Already have an account? <Link to="/login" className="spotify-link">Log in here</Link>
        </p>
      </div>
    </div>
  );
}

export default Register;
