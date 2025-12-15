import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAuthData } from '../api/apiClient';
import './Profile.css';

/**
 * Profile page component
 * Allows authenticated users to view and update their username and display_name
 */
// PUBLIC_INTERFACE
function Profile() {
  const [profile, setProfile] = useState(null);
  const [username, setUsername] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [validationErrors, setValidationErrors] = useState({});
  const navigate = useNavigate();
  const { accessToken } = getAuthData();

  const API_BASE_URL = process.env.REACT_APP_BACKEND_URL || '';

  /**
   * Fetch user profile on component mount
   */
  useEffect(() => {
    fetchProfile();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /**
   * Fetches the current user's profile from the backend
   */
  const fetchProfile = async () => {
    setLoading(true);
    setError('');
    
    try {
      const response = await fetch(`${API_BASE_URL}/api/profile`, {
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch profile');
      }

      setProfile(data.profile);
      setUsername(data.profile.username || '');
      setDisplayName(data.profile.display_name || '');
    } catch (err) {
      console.error('Error fetching profile:', err);
      setError(err.message || 'Failed to load profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  /**
   * Validates form inputs
   * @returns {boolean} True if validation passes
   */
  const validateForm = () => {
    const errors = {};

    // Validate username
    if (!username || username.trim().length === 0) {
      errors.username = 'Username is required';
    } else if (username.length > 50) {
      errors.username = 'Username must be 50 characters or less';
    } else if (!/^[a-zA-Z0-9_-]+$/.test(username)) {
      errors.username = 'Username can only contain letters, numbers, underscores, and hyphens';
    }

    // Validate display name
    if (!displayName || displayName.trim().length === 0) {
      errors.displayName = 'Display name is required';
    } else if (displayName.length > 100) {
      errors.displayName = 'Display name must be 100 characters or less';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  /**
   * Handles form submission for profile update
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setValidationErrors({});

    // Client-side validation
    if (!validateForm()) {
      return;
    }

    setSaving(true);

    try {
      const response = await fetch(`${API_BASE_URL}/api/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`
        },
        body: JSON.stringify({
          username: username.trim(),
          display_name: displayName.trim()
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to update profile');
      }

      setProfile(data.profile);
      setSuccess('Profile updated successfully!');
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      console.error('Error updating profile:', err);
      setError(err.message || 'Failed to update profile. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  /**
   * Handles navigation back to home
   */
  const handleBack = () => {
    navigate('/home');
  };

  if (loading) {
    return (
      <div className="profile-container">
        <div className="profile-loading">
          <span className="loading-icon">⏳</span>
          <p>Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="profile-container">
      <div className="profile-card">
        <div className="profile-header">
          <button className="back-button" onClick={handleBack} aria-label="Back to home">
            ← Back
          </button>
          <h1 className="profile-title">Your Profile</h1>
          <p className="profile-subtitle">Update your profile information</p>
        </div>

        <form onSubmit={handleSubmit} className="profile-form">
          {error && <div className="profile-error">{error}</div>}
          {success && <div className="profile-success">{success}</div>}

          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter username"
              disabled={saving}
              className={validationErrors.username ? 'input-error' : ''}
              required
            />
            {validationErrors.username && (
              <span className="field-error">{validationErrors.username}</span>
            )}
            <span className="field-hint">Letters, numbers, underscores, and hyphens only (max 50 characters)</span>
          </div>

          <div className="form-group">
            <label htmlFor="displayName">Display Name</label>
            <input
              id="displayName"
              type="text"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              placeholder="Enter display name"
              disabled={saving}
              className={validationErrors.displayName ? 'input-error' : ''}
              required
            />
            {validationErrors.displayName && (
              <span className="field-error">{validationErrors.displayName}</span>
            )}
            <span className="field-hint">Your public display name (max 100 characters)</span>
          </div>

          <div className="profile-actions">
            <button 
              type="button" 
              className="cancel-button"
              onClick={handleBack}
              disabled={saving}
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="save-button"
              disabled={saving}
            >
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>

        {profile && (
          <div className="profile-metadata">
            <p className="metadata-item">
              <span className="metadata-label">User ID:</span> {profile.user_id}
            </p>
            <p className="metadata-item">
              <span className="metadata-label">Created:</span>{' '}
              {new Date(profile.created_at).toLocaleDateString()}
            </p>
            <p className="metadata-item">
              <span className="metadata-label">Last Updated:</span>{' '}
              {new Date(profile.updated_at).toLocaleDateString()}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Profile;
