import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import { isAuthenticated, getAuthData, clearAuthData } from './api/apiClient';
import logo from './logo.svg';
import './App.css';

/**
 * Home page component
 */
// PUBLIC_INTERFACE
function Home() {
  const [theme, setTheme] = useState('light');
  const { user } = getAuthData();
  const navigate = useNavigate();

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prevTheme => prevTheme === 'light' ? 'dark' : 'light');
  };

  const handleLogout = () => {
    clearAuthData();
    navigate('/login');
  };

  return (
    <div className="App">
      <header className="App-header">
        <button 
          className="theme-toggle" 
          onClick={toggleTheme}
          aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
        >
          {theme === 'light' ? '🌙 Dark' : '☀️ Light'}
        </button>
        
        <img src={logo} className="App-logo" alt="logo" />
        
        {isAuthenticated() && user ? (
          <>
            <p>Welcome, {user.email}!</p>
            <button className="auth-button" onClick={handleLogout}>
              Logout
            </button>
          </>
        ) : (
          <>
            <p>
              Edit <code>src/App.js</code> and save to reload.
            </p>
            <p>
              Current theme: <strong>{theme}</strong>
            </p>
            <a
              className="App-link"
              href="https://reactjs.org"
              target="_blank"
              rel="noopener noreferrer"
            >
              Learn React
            </a>
          </>
        )}
      </header>
    </div>
  );
}

/**
 * Main App component with routing
 */
// PUBLIC_INTERFACE
function App() {
  return (
    <Router>
      <nav className="nav-bar">
        <div className="nav-container">
          <Link to="/" className="nav-logo">Music Streamer</Link>
          <div className="nav-links">
            {!isAuthenticated() ? (
              <>
                <Link to="/login" className="nav-link">Login</Link>
                <Link to="/register" className="nav-link">Register</Link>
              </>
            ) : (
              <span className="nav-link">Authenticated</span>
            )}
          </div>
        </div>
      </nav>
      
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </Router>
  );
}

export default App;
