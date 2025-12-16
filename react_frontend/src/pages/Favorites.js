import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import TopNav from '../components/TopNav';
import BottomPlayer from '../components/BottomPlayer';
import { useFavorites } from '../hooks/useFavorites';
import { usePlaylists } from '../hooks/usePlaylists';
import { addTrackToPlaylist } from '../api/apiClient';
import { showSuccess, showError } from '../utils/toast';
import './MainHome.css';
import './AddToPlaylist.css';
import './Profile.css';

// Audius app name from environment variable
const APP_NAME = process.env.REACT_APP_AUDIUS_APP_NAME || 'spotify-clone';

/**
 * Favorites page displaying user's favorited tracks
 * Shows a list of favorite tracks with playback and playlist management
 */
// PUBLIC_INTERFACE
function Favorites() {
  const navigate = useNavigate();
  const { favorites, loading, error, refetch } = useFavorites();
  const [currentTrack, setCurrentTrack] = useState(null);
  const [currentTrackId, setCurrentTrackId] = useState(null);

  // Popover state for add to playlist
  const [openPopoverForTrackId, setOpenPopoverForTrackId] = useState(null);
  const [addingToPlaylist, setAddingToPlaylist] = useState(false);
  const popoverRefs = useRef({});

  // Playlists data
  const { playlists, loading: playlistsLoading, error: playlistsError } = usePlaylists();

  // Handle 401 errors by redirecting to login
  useEffect(() => {
    if (error && error.includes('401')) {
      showError('Session expired. Please log in again.');
      navigate('/login');
    } else if (error && error.includes('Not authenticated')) {
      navigate('/login');
    }
  }, [error, navigate]);

  // Close popover when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      const openId = openPopoverForTrackId;
      if (!openId) return;
      const node = popoverRefs.current[openId];
      if (node && !node.contains(event.target)) {
        setOpenPopoverForTrackId(null);
      }
    };
    if (openPopoverForTrackId) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [openPopoverForTrackId]);

  /**
   * Handles track selection for playback
   * @param {object} favorite - The favorite object containing track data
   */
  const handleTrackClick = (favorite) => {
    if (!favorite || !favorite.track) return;

    const track = favorite.track;
    
    // Construct Audius-compatible track object for player
    const audiusTrack = {
      id: track.audius_track_id,
      title: track.title,
      duration: track.duration_seconds,
      user: {
        name: track.artist_name || 'Unknown Artist'
      },
      artwork: null // We don't store artwork in DB, player will show placeholder
    };

    setCurrentTrack(audiusTrack);
    setCurrentTrackId(track.id); // Backend UUID
  };

  const togglePopover = (e, trackId) => {
    e.stopPropagation();
    e.preventDefault();
    setOpenPopoverForTrackId(prev => (prev === trackId ? null : trackId));
  };

  const handlePopoverKeyDown = (e) => {
    if (e.key === 'Escape') {
      e.stopPropagation();
      setOpenPopoverForTrackId(null);
    }
  };

  const handlePlaylistSelect = async (e, playlist, favorite) => {
    e.stopPropagation();
    e.preventDefault();
    
    const track = favorite.track;
    
    if (!track || !track.id || !track.title) {
      showError('Invalid track data');
      return;
    }

    if (addingToPlaylist) {
      return;
    }

    setAddingToPlaylist(true);
    
    try {
      // Construct stream URL
      const streamUrl = track.audius_stream_url || 
        `https://discoveryprovider.audius.co/v1/tracks/${track.audius_track_id}/stream?app_name=${APP_NAME}`;
      
      // Prepare track data
      const trackData = {
        title: track.title,
        duration_seconds: track.duration_seconds || 0,
        audius_track_id: track.audius_track_id,
        audius_stream_url: streamUrl,
        artist_name: track.artist_name || null
      };

      // Add track to playlist
      await addTrackToPlaylist(playlist.id, trackData);
      
      showSuccess(`"${track.title}" added to "${playlist.name}"`);
      setOpenPopoverForTrackId(null);
    } catch (error) {
      console.error('Error adding track to playlist:', error);
      
      if (error.message && (
        error.message.includes('already exists') || 
        error.message.includes('duplicate') ||
        error.message.includes('already in playlist')
      )) {
        showSuccess(`"${track.title}" is already in "${playlist.name}"`);
        setOpenPopoverForTrackId(null);
      } else {
        showError(error.message || 'Failed to add track to playlist');
      }
    } finally {
      setAddingToPlaylist(false);
    }
  };

  return (
    <div className="main-home">
      <Sidebar />
      
      <div className="main-content">
        <TopNav />
        
        <div className="content-area">
          <h1 className="welcome-title">My Favorites</h1>
          <p className="welcome-subtitle">
            {loading ? 'Loading...' : `${favorites.length} favorite track${favorites.length !== 1 ? 's' : ''}`}
          </p>
          
          {loading && (
            <div className="trending-loading">
              <span className="loading-icon">⏳</span>
              <p>Loading favorites...</p>
            </div>
          )}
          
          {error && !error.includes('Not authenticated') && !error.includes('401') && (
            <div className="trending-error">
              <span className="error-icon">⚠️</span>
              <p>{error}</p>
              <button 
                onClick={refetch}
                style={{ 
                  marginTop: '1rem',
                  padding: '0.5rem 1rem',
                  background: '#2563EB',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
              >
                Retry
              </button>
            </div>
          )}
          
          {!loading && !error && favorites.length > 0 && (
            <div className="trending-tracks">
              {favorites.map((favorite, index) => {
                const track = favorite.track;
                const trackId = track?.id || `idx-${index}`;
                const isOpen = openPopoverForTrackId === trackId;
                
                if (!track) return null;

                return (
                  <div 
                    key={trackId} 
                    className="track-item"
                    onClick={() => handleTrackClick(favorite)}
                    ref={(el) => { if (el) popoverRefs.current[trackId] = el; }}
                  >
                    <div className="track-number">{index + 1}</div>
                    <div className="track-artwork">
                      <span className="artwork-placeholder">🎵</span>
                    </div>
                    <div className="track-info">
                      <div className="track-title">{track.title || 'Unknown Track'}</div>
                      <div className="track-artist">{track.artist_name || 'Unknown Artist'}</div>
                    </div>
                    <div className="track-duration">
                      {track.duration_seconds ? formatDuration(track.duration_seconds) : '--:--'}
                    </div>
                    <div className="track-play-count">
                      <span style={{ color: '#F59E0B' }}>❤️</span> Favorited
                    </div>

                    {/* Add to playlist button and popover */}
                    <div className="add-to-playlist-container" onClick={(e) => e.stopPropagation()}>
                      <button
                        type="button"
                        className="add-to-playlist-btn"
                        aria-label="Add to playlist"
                        aria-haspopup="menu"
                        aria-expanded={isOpen}
                        disabled={addingToPlaylist}
                        onClick={(e) => togglePopover(e, trackId)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' || e.key === ' ') {
                            togglePopover(e, trackId);
                          }
                        }}
                      >
                        {addingToPlaylist ? '...' : '+'}
                      </button>
                      {isOpen && (
                        <div
                          className="playlist-popover"
                          role="menu"
                          tabIndex={-1}
                          onKeyDown={handlePopoverKeyDown}
                          style={{ opacity: addingToPlaylist ? 0.6 : 1, pointerEvents: addingToPlaylist ? 'none' : 'auto' }}
                        >
                          <div className="playlist-popover-header">
                            {addingToPlaylist ? 'Adding track...' : 'Add to playlist'}
                          </div>
                          
                          {playlistsLoading && (
                            <div className="playlist-popover-loading">Loading playlists...</div>
                          )}
                          {!playlistsLoading && playlistsError && (
                            <div className="playlist-popover-error" role="alert">
                              {playlistsError}
                            </div>
                          )}
                          {!playlistsLoading && !playlistsError && (
                            <>
                              {playlists.length === 0 ? (
                                <div className="playlist-popover-empty">
                                  No playlists yet
                                </div>
                              ) : (
                                <ul className="playlist-popover-list">
                                  {playlists.map((p) => (
                                    <li key={p.id}>
                                      <button
                                        type="button"
                                        className="playlist-popover-item-btn"
                                        role="menuitem"
                                        disabled={addingToPlaylist}
                                        onClick={(e) => handlePlaylistSelect(e, p, favorite)}
                                      >
                                        <span>📻</span>
                                        <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                          {p.name}
                                        </span>
                                      </button>
                                    </li>
                                  ))}
                                </ul>
                              )}
                            </>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
          
          {!loading && !error && favorites.length === 0 && (
            <div className="trending-empty">
              <span className="empty-icon">💙</span>
              <p>No favorites yet</p>
              <p style={{ fontSize: '0.9rem', color: '#6b7280', marginTop: '0.5rem' }}>
                Start adding tracks to your favorites by clicking the heart icon
              </p>
            </div>
          )}
        </div>
      </div>
      
      <BottomPlayer currentTrack={currentTrack} currentTrackId={currentTrackId} />
    </div>
  );
}

/**
 * Formats duration from seconds to MM:SS format
 * @param {number} seconds - Duration in seconds
 * @returns {string} Formatted duration string
 */
function formatDuration(seconds) {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

export default Favorites;
