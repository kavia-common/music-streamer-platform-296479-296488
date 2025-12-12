import React, { useState } from 'react';
import Sidebar from '../components/Sidebar';
import TopNav from '../components/TopNav';
import BottomPlayer from '../components/BottomPlayer';
import { useAudiusTrending } from '../hooks/useAudiusTrending';
import './MainHome.css';

/**
 * Main authenticated home page with Spotify-like layout
 * Displays sidebar, top navigation, Audius trending tracks, and bottom player
 */
// PUBLIC_INTERFACE
function MainHome() {
  const { tracks, loading, error } = useAudiusTrending();
  const [currentTrack, setCurrentTrack] = useState(null);

  /**
   * Handles track selection for playback
   * @param {object} track - The selected track object from Audius
   */
  const handleTrackClick = (track) => {
    setCurrentTrack(track);
  };

  return (
    <div className="main-home">
      <Sidebar />
      
      <div className="main-content">
        <TopNav />
        
        <div className="content-area">
          <h1 className="welcome-title">Trending on Audius</h1>
          <p className="welcome-subtitle">Top 20 tracks trending right now</p>
          
          {loading && (
            <div className="trending-loading">
              <span className="loading-icon">⏳</span>
              <p>Loading trending tracks...</p>
            </div>
          )}
          
          {error && (
            <div className="trending-error">
              <span className="error-icon">⚠️</span>
              <p>{error}</p>
            </div>
          )}
          
          {!loading && !error && tracks.length > 0 && (
            <div className="trending-tracks">
              {tracks.map((track, index) => (
                <div 
                  key={track.id || index} 
                  className="track-item"
                  onClick={() => handleTrackClick(track)}
                >
                  <div className="track-number">{index + 1}</div>
                  <div className="track-artwork">
                    {track.artwork && track.artwork['150x150'] ? (
                      <img 
                        src={track.artwork['150x150']} 
                        alt={track.title || 'Track artwork'}
                      />
                    ) : (
                      <span className="artwork-placeholder">🎵</span>
                    )}
                  </div>
                  <div className="track-info">
                    <div className="track-title">{track.title || 'Unknown Track'}</div>
                    <div className="track-artist">{track.user?.name || 'Unknown Artist'}</div>
                  </div>
                  <div className="track-duration">
                    {track.duration ? formatDuration(track.duration) : '--:--'}
                  </div>
                  <div className="track-play-count">
                    {track.play_count ? formatPlayCount(track.play_count) : '0'} plays
                  </div>
                </div>
              ))}
            </div>
          )}
          
          {!loading && !error && tracks.length === 0 && (
            <div className="trending-empty">
              <span className="empty-icon">🎵</span>
              <p>No trending tracks available at the moment</p>
            </div>
          )}
        </div>
      </div>
      
      <BottomPlayer currentTrack={currentTrack} />
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

/**
 * Formats play count with K/M suffix for thousands/millions
 * @param {number} count - Play count number
 * @returns {string} Formatted play count string
 */
function formatPlayCount(count) {
  if (count >= 1000000) {
    return `${(count / 1000000).toFixed(1)}M`;
  } else if (count >= 1000) {
    return `${(count / 1000).toFixed(1)}K`;
  }
  return count.toString();
}

export default MainHome;
