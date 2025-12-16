import React, { useState, useEffect, useRef } from 'react';
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
  const profileContainerRef = useRef(null);

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

  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileContainerRef.current && !profileContainerRef.current.contains(event.target)) {
        setShowProfileMenu(false);
      }
    };

    if (showProfileMenu) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }
  }, [showProfileMenu]);

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

      <div className="profile-dropdown" ref={profileContainerRef}>
        <button
          className="profile-button"
          onClick={() => setShowProfileMenu(!showProfileMenu)}
          aria-expanded={showProfileMenu}
          aria-haspopup="true"
        >
          <span className="profile-icon">👤</span>
          <span className="profile-name">{user?.email || 'User'}</span>
        </button>

        {showProfileMenu && (
          <div className="profile-menu" role="menu">
            <div className="profile-menu-item profile-info" role="menuitem">
              {user?.email || 'User'}
            </div>
            <div className="profile-menu-divider"></div>
            <button 
              className="profile-menu-item" 
              role="menuitem"
              onClick={() => {
                setShowProfileMenu(false);
                navigate('/profile');
              }}
            >
              Profile
            </button>
            <button 
              className="profile-menu-item" 
              role="menuitem"
              onClick={handleLogout}
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default TopNav;
