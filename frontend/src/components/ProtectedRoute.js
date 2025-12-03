// -----------------------------------------------------------------------------
// src/components/ProtectedRoute.js
// -----------------------------------------------------------------------------
// Guards private routes:
//
// • Checks if the user is authenticated via AuthContext.
// • If not authenticated, automatically redirects to /login.
// • Optionally shows a spinner while the authentication state is still loading.
// -----------------------------------------------------------------------------

import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from './LoadingSpinner'; // ✅ Reusable spinner we built earlier

export default function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();

  // While AuthContext is still figuring out the token status,
  // we don't want to flash the login screen. Show a spinner instead.
  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', marginTop: '4rem' }}>
        <LoadingSpinner size={48} /> {/* ✅ matches our UI polish */}
      </div>
    );
  }

  // If not logged in, bounce the user to the login page.
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Otherwise, render the protected content.
  return children;
}


