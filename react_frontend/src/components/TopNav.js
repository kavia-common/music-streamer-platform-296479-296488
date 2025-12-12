import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAuthData, clearAuthData } from '../api/apiClient';
import './TopNav.css';

/**
 * Top navigation component with search input and profile button
 * Displays search bar and user profile with logout functionality
 * @param {object} props - Component props
 * @param {function} props.onSearch - Callback function when search is performed
 */
// PUBLIC_INTERFACE
function TopNav({ onSearch }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const { user } = getAuthData();
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // Notify parent component of search query
      if (onSearch) {
        onSearch(searchQuery.trim());
      }
    }
  };

  const handleLogout = () => {
    clearAuthData();
    navigate('/login');
  };

  return (
    <div className="top-nav">
      <form className="search-container" onSubmit={handleSearch}>
        <span className="search-icon">🔍</span>
        <input
          type="text"
          className="search-input"
          placeholder="What do you want to listen to?"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </form>

      <div className="profile-container">
        <button
          className="profile-button"
          onClick={() => setShowProfileMenu(!showProfileMenu)}
        >
          <span className="profile-icon">👤</span>
          <span className="profile-name">{user?.email || 'User'}</span>
        </button>

        {showProfileMenu && (
          <div className="profile-menu">
            <div className="profile-menu-item profile-info">
              {user?.email || 'User'}
            </div>
            <div className="profile-menu-divider"></div>
            <button className="profile-menu-item" onClick={handleLogout}>
              Logout
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default TopNav;
