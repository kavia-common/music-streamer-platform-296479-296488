import React from 'react';
import { Navigate } from 'react-router-dom';
import { isAuthenticated } from '../api/apiClient';

/**
 * Private route wrapper component that guards authenticated routes
 * Redirects to login if user is not authenticated
 * @param {object} props - Component props
 * @param {React.ReactNode} props.children - Child components to render if authenticated
 * @returns {React.ReactNode} Children if authenticated, otherwise Navigate to login
 */
// PUBLIC_INTERFACE
function PrivateRoute({ children }) {
  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

export default PrivateRoute;
