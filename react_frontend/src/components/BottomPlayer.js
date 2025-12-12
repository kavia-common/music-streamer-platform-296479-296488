import React from 'react';
import './BottomPlayer.css';

/**
 * Bottom player component displaying current song and playback controls
 * Shows song information from Audius track and basic playback controls
 * @param {object} props - Component props
 * @param {object} props.currentTrack - The currently selected track from Audius
 */
// PUBLIC_INTERFACE
function BottomPlayer({ currentTrack }) {
  return (
    <div className="bottom-player">
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
          <button className="control-button play-button" aria-label="Play">
            ▶️
          </button>
          <button className="control-button" aria-label="Next">
            ⏭️
          </button>
          <button className="control-button" aria-label="Repeat">
            🔁
          </button>
        </div>
        <div className="progress-bar">
          <span className="time-current">0:00</span>
          <div className="progress-track">
            <div className="progress-fill" style={{ width: '0%' }}></div>
          </div>
          <span className="time-total">
            {currentTrack && currentTrack.duration 
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
