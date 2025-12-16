import React, { useRef, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getFavorites, addFavorite, removeFavorite, isAuthenticated } from '../api/apiClient';
import { showSuccess, showError, showInfo } from '../utils/toast';
import './BottomPlayer.css';

// Audius app name from environment variable, fallback to 'spotify-clone'
const APP_NAME = process.env.REACT_APP_AUDIUS_APP_NAME || 'spotify-clone';

/**
 * Bottom player component displaying current song and playback controls
 * Shows song information from Audius track and basic playback controls
 * Integrates with favorites API for heart button functionality
 * @param {object} props - Component props
 * @param {object} props.currentTrack - The currently selected track from Audius
 * @param {string} props.currentTrackId - The UUID track_id from backend (if track exists in DB)
 */
// PUBLIC_INTERFACE
function BottomPlayer({ currentTrack, currentTrackId }) {
  const audioRef = useRef(null);
  const navigate = useNavigate();
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);
  const [favoriteLoading, setFavoriteLoading] = useState(false);

  // Fetch favorites and determine if current track is favorited
  useEffect(() => {
    const fetchFavoriteStatus = async () => {
      if (!isAuthenticated() || !currentTrackId) {
        setIsFavorite(false);
        return;
      }

      try {
        const response = await getFavorites();
        const favorites = response.favorites || [];
        
        // Check if current track is in favorites
        const isFav = favorites.some(fav => fav.track_id === currentTrackId);
        setIsFavorite(isFav);
      } catch (error) {
        console.error('Error fetching favorites:', error);
        // Don't show error toast on initial load, just silently fail
      }
    };

    fetchFavoriteStatus();
  }, [currentTrackId]);

  // Update audio source when track changes
  useEffect(() => {
    if (currentTrack && audioRef.current) {
      // Construct the Audius stream URL exactly as in the working reference
      const streamUrl = `https://discoveryprovider.audius.co/v1/tracks/${currentTrack.id}/stream?app_name=${APP_NAME}`;
      audioRef.current.src = streamUrl;
      audioRef.current.load();
      
      // Auto-play the new track
      audioRef.current.play()
        .then(() => setIsPlaying(true))
        .catch(err => {
          console.error('Error auto-playing track:', err);
          setIsPlaying(false);
        });
    }
  }, [currentTrack]);

  // Handle play/pause toggle
  const togglePlayPause = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
      } else {
        audioRef.current.play()
          .then(() => setIsPlaying(true))
          .catch(err => {
            console.error('Error playing track:', err);
            setIsPlaying(false);
          });
      }
    }
  };

  // Handle favorite toggle
  const handleFavoriteToggle = async () => {
    // Check authentication first
    if (!isAuthenticated()) {
      showInfo('Please log in to add favorites');
      navigate('/login');
      return;
    }

    // Check if we have a valid track ID
    if (!currentTrackId) {
      showError('Cannot favorite this track - track not saved in database');
      return;
    }

    // Prevent multiple simultaneous requests
    if (favoriteLoading) {
      return;
    }

    // Optimistically update UI
    const previousState = isFavorite;
    setIsFavorite(!isFavorite);
    setFavoriteLoading(true);

    try {
      if (previousState) {
        // Remove from favorites
        await removeFavorite(currentTrackId);
        showSuccess('Removed from favorites');
      } else {
        // Add to favorites
        await addFavorite(currentTrackId);
        showSuccess('Added to favorites');
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
      
      // Revert optimistic update on error
      setIsFavorite(previousState);
      
      // Handle 401 Unauthorized
      if (error.message && error.message.includes('401')) {
        showError('Session expired. Please log in again.');
        navigate('/login');
      } else if (error.message && error.message.includes('404')) {
        showError('Track not found in database');
      } else if (error.message && error.message.includes('409')) {
        // Track already in favorites - sync state
        setIsFavorite(true);
        showInfo('Track already in favorites');
      } else {
        showError('Failed to update favorites');
      }
    } finally {
      setFavoriteLoading(false);
    }
  };

  // Update current time as audio plays
  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  // Update duration when metadata is loaded
  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
    }
  };

  // Handle progress bar click
  const handleProgressClick = (e) => {
    if (audioRef.current) {
      const progressBar = e.currentTarget;
      const rect = progressBar.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const newTime = (clickX / rect.width) * duration;
      audioRef.current.currentTime = newTime;
      setCurrentTime(newTime);
    }
  };

  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div className="bottom-player">
      <audio
        ref={audioRef}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={() => setIsPlaying(false)}
        controls={false}
        autoPlay
      />
      
      <div className="player-left">
        {currentTrack ? (
          <>
            <div className="song-thumbnail">
              {currentTrack.artwork && currentTrack.artwork['150x150'] ? (
                <img 
                  src={currentTrack.artwork['150x150']} 
                  alt={currentTrack.title || 'Track artwork'}
                  className="thumbnail-image"
                />
              ) : (
                <span>🎵</span>
              )}
            </div>
            <div className="song-info">
              <div className="song-title">{currentTrack.title || 'Unknown Track'}</div>
              <div className="song-artist">{currentTrack.user?.name || 'Unknown Artist'}</div>
            </div>
            <button 
              className={`like-button ${isFavorite ? 'active' : ''}`}
              onClick={handleFavoriteToggle}
              disabled={favoriteLoading}
              aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
              aria-pressed={isFavorite}
            >
              {isFavorite ? '❤️' : '♡'}
            </button>
          </>
        ) : (
          <div className="no-song">No song selected</div>
        )}
      </div>

      <div className="player-center">
        <div className="player-controls">
          <button className="control-button" aria-label="Shuffle">
            🔀
          </button>
          <button className="control-button" aria-label="Previous">
            ⏮️
          </button>
          <button 
            className="control-button play-button" 
            aria-label={isPlaying ? "Pause" : "Play"}
            onClick={togglePlayPause}
            disabled={!currentTrack}
          >
            {isPlaying ? '⏸️' : '▶️'}
          </button>
          <button className="control-button" aria-label="Next">
            ⏭️
          </button>
          <button className="control-button" aria-label="Repeat">
            🔁
          </button>
        </div>
        <div className="progress-bar">
          <span className="time-current">{formatTime(currentTime)}</span>
          <div className="progress-track" onClick={handleProgressClick}>
            <div className="progress-fill" style={{ width: `${progressPercent}%` }}></div>
          </div>
          <span className="time-total">
            {currentTrack && duration 
              ? formatTime(duration)
              : currentTrack && currentTrack.duration
              ? formatDuration(currentTrack.duration) 
              : '0:00'}
          </span>
        </div>
      </div>

      <div className="player-right">
        <button className="control-button" aria-label="Volume">
          🔊
        </button>
        <div className="volume-bar">
          <div className="volume-fill" style={{ width: '70%' }}></div>
        </div>
      </div>
    </div>
  );
}

/**
 * Formats time from seconds to MM:SS format
 * @param {number} seconds - Time in seconds
 * @returns {string} Formatted time string
 */
function formatTime(seconds) {
  if (!seconds || isNaN(seconds)) return '0:00';
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
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

export default BottomPlayer;
