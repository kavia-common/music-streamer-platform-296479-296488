import React from 'react';
import './BottomPlayer.css';

/**
 * Bottom player component displaying current song and playback controls
 * Shows song information and basic playback controls (placeholder)
 */
// PUBLIC_INTERFACE
function BottomPlayer() {
  // Placeholder state - will be connected to actual player state later
  const currentSong = null;

  return (
    <div className="bottom-player">
      <div className="player-left">
        {currentSong ? (
          <>
            <div className="song-thumbnail">
              <span>🎵</span>
            </div>
            <div className="song-info">
              <div className="song-title">{currentSong.title}</div>
              <div className="song-artist">{currentSong.artist}</div>
            </div>
            <button className="like-button" aria-label="Like song">
              ♡
            </button>
          </>
        ) : (
          <div className="no-song">No song playing</div>
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
          <span className="time-total">0:00</span>
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

export default BottomPlayer;
