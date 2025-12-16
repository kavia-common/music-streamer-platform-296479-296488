import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import MainHome from './pages/MainHome';
import Profile from './pages/Profile';
import PlaylistView from './pages/PlaylistView';
import PrivateRoute from './components/PrivateRoute';
import { isAuthenticated } from './api/apiClient';
import './App.css';

/**
 * Main App component with routing
 * Routes authenticated users to MainHome, unauthenticated to Login
 */
// PUBLIC_INTERFACE
function App() {
  return (
    <Router>
      <Routes>
        <Route 
          path="/" 
          element={
            isAuthenticated() ? (
              <Navigate to="/home" replace />
            ) : (
              <Navigate to="/login" replace />
            )
          } 
        />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route 
          path="/home" 
          element={
            <PrivateRoute>
              <MainHome />
            </PrivateRoute>
          } 
        />
        <Route 
          path="/search" 
          element={
            <PrivateRoute>
              <MainHome />
            </PrivateRoute>
          } 
        />
        <Route 
          path="/library" 
          element={
            <PrivateRoute>
              <MainHome />
            </PrivateRoute>
          } 
        />
        <Route 
          path="/playlists/:id" 
          element={
            <PrivateRoute>
              <PlaylistView />
            </PrivateRoute>
          } 
        />
        <Route 
          path="/profile" 
          element={
            <PrivateRoute>
              <Profile />
            </PrivateRoute>
          } 
        />
      </Routes>
    </Router>
  );
}

export default App;
