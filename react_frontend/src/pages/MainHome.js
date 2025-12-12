import React from 'react';
import Sidebar from '../components/Sidebar';
import TopNav from '../components/TopNav';
import BottomPlayer from '../components/BottomPlayer';
import './MainHome.css';

/**
 * Main authenticated home page with Spotify-like layout
 * Displays sidebar, top navigation, main content area, and bottom player
 */
// PUBLIC_INTERFACE
function MainHome() {
  return (
    <div className="main-home">
      <Sidebar />
      
      <div className="main-content">
        <TopNav />
        
        <div className="content-area">
          <h1 className="welcome-title">Welcome back</h1>
          <p className="welcome-subtitle">Start listening to your favorite music</p>
          
          <div className="content-placeholder">
            <div className="placeholder-card">
              <span className="placeholder-icon">🎵</span>
              <p>Your recently played songs will appear here</p>
            </div>
            <div className="placeholder-card">
              <span className="placeholder-icon">📊</span>
              <p>Your listening statistics will appear here</p>
            </div>
          </div>
        </div>
      </div>
      
      <BottomPlayer />
    </div>
  );
}

export default MainHome;
