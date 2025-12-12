import React from 'react';
import { Link } from 'react-router-dom';
import { usePlaylists } from '../hooks/usePlaylists';
import './Sidebar.css';

/**
 * Sidebar component displaying navigation and user playlists
 * Shows home, search, library links and a list of user playlists
 */
// PUBLIC_INTERFACE
function Sidebar() {
  const { playlists, loading } = usePlaylists();

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <Link to="/" className="sidebar-logo">
          Music Streamer
        </Link>
      </div>

      <nav className="sidebar-nav">
        <Link to="/" className="nav-item">
          <span className="nav-icon">🏠</span>
          <span>Home</span>
        </Link>
        <Link to="/search" className="nav-item">
          <span className="nav-icon">🔍</span>
          <span>Search</span>
        </Link>
        <Link to="/library" className="nav-item">
          <span className="nav-icon">📚</span>
          <span>Your Library</span>
        </Link>
      </nav>

      <div className="sidebar-divider"></div>

      <div className="sidebar-playlists">
        <div className="playlists-header">
          <span>Playlists</span>
        </div>
        {loading ? (
          <div className="playlists-loading">Loading playlists...</div>
        ) : playlists.length > 0 ? (
          <ul className="playlists-list">
            {playlists.map((playlist) => (
              <li key={playlist.id}>
                <Link to={`/playlist/${playlist.id}`} className="playlist-item">
                  {playlist.name}
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <div className="playlists-empty">No playlists yet</div>
        )}
      </div>
    </div>
  );
}

export default Sidebar;
