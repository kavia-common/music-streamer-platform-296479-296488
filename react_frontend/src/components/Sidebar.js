import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { usePlaylists } from '../hooks/usePlaylists';
import { createPlaylist } from '../api/apiClient';
import './Sidebar.css';

/**
 * Sidebar component displaying navigation and user playlists
 * Shows home, search, library links and a list of user playlists with create functionality
 */
// PUBLIC_INTERFACE
function Sidebar() {
  const { playlists, loading, refetch } = usePlaylists();
  const [isCreating, setIsCreating] = useState(false);

  /**
   * Handle create playlist button click
   * Prompts user for playlist name and creates the playlist
   */
  const handleCreatePlaylist = async () => {
    const playlistName = prompt('Enter playlist name:');
    
    if (!playlistName || playlistName.trim().length === 0) {
      return; // User cancelled or entered empty name
    }

    if (playlistName.length > 100) {
      alert('Playlist name must be 100 characters or less');
      return;
    }

    setIsCreating(true);
    
    try {
      await createPlaylist(playlistName.trim());
      // Refetch playlists to update the sidebar
      await refetch();
      alert('Playlist created successfully!');
    } catch (error) {
      console.error('Error creating playlist:', error);
      alert(`Failed to create playlist: ${error.message}`);
    } finally {
      setIsCreating(false);
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
      </nav>

      <div className="sidebar-divider"></div>

      <div className="sidebar-playlists">
        <div className="playlists-header">
          <span>Playlists</span>
          <button 
            className="create-playlist-btn" 
            onClick={handleCreatePlaylist}
            disabled={isCreating}
            title="Create a new playlist"
          >
            {isCreating ? '...' : '+'}
          </button>
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
