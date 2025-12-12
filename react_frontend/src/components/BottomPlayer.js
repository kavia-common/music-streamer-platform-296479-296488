import React, { useRef, useEffect, useState } from 'react';
import './BottomPlayer.css';

// Audius app name from environment variable, fallback to 'spotify-clone'
const APP_NAME = process.env.REACT_APP_AUDIUS_APP_NAME || 'spotify-clone';

/**
 * Bottom player component displaying current song and playback controls
 * Shows song information from Audius track and basic playback controls
 * @param {object} props - Component props
 * @param {object} props.currentTrack - The currently selected track from Audius
 */
// PUBLIC_INTERFACE
function BottomPlayer({ currentTrack }) {
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

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
            <button className="like-button" aria-label="Like song">
              ♡
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
