import React, { useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { usePlaylists } from '../hooks/usePlaylists';
import CreatePlaylistPopover from './CreatePlaylistPopover';
import './Sidebar.css';

/**
 * Sidebar component displaying navigation and user playlists
 * Shows home, search, library links and a list of user playlists with create functionality
 */
// PUBLIC_INTERFACE
function Sidebar() {
  const { playlists, loading, refetch } = usePlaylists();
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const createButtonRef = useRef(null);
  const navigate = useNavigate();

  /**
   * Handle create playlist button click
   * Opens the popover for creating a new playlist
   */
  const handleCreatePlaylist = () => {
    setIsPopoverOpen(true);
  };

  /**
   * Handle popover close
   */
  const handlePopoverClose = () => {
    setIsPopoverOpen(false);
  };

  /**
   * Handle successful playlist creation
   * Refetches playlists and navigates to the new playlist
   */
  const handlePlaylistCreated = async (newPlaylist) => {
    // Refetch playlists to update the sidebar
    await refetch();
    
    // Navigate to the newly created playlist
    if (newPlaylist && newPlaylist.id) {
      navigate(`/playlists/${newPlaylist.id}`);
    }
  };

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
        <Link to="/favorites" className="nav-item">
          <span className="nav-icon">❤️</span>
          <span>Favorites</span>
        </Link>
      </nav>

      <div className="sidebar-divider"></div>

      <div className="sidebar-playlists">
        <div className="playlists-header">
          <span>Playlists</span>
          <div style={{ position: 'relative', overflow: 'visible' }}>
            <button 
              ref={createButtonRef}
              className="create-playlist-btn" 
              onClick={handleCreatePlaylist}
              title="Create a new playlist"
              aria-label="Create a new playlist"
              aria-haspopup="dialog"
              aria-expanded={isPopoverOpen}
            >
              +
            </button>
            <CreatePlaylistPopover
              isOpen={isPopoverOpen}
              onClose={handlePopoverClose}
              onSuccess={handlePlaylistCreated}
              anchorRef={createButtonRef}
            />
          </div>
        </div>
        {loading ? (
          <div className="playlists-loading">Loading playlists...</div>
        ) : playlists.length > 0 ? (
          <ul className="playlists-list">
            {playlists.map((playlist) => (
              <li key={playlist.id}>
                <Link 
                  to={`/playlists/${playlist.id}`} 
                  className="playlist-item-link"
                >
                  <span className="playlist-icon">📻</span>
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
