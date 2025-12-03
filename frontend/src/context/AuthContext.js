// -----------------------------------------------------------------------------
// AuthContext.js
// -----------------------------------------------------------------------------
// Global authentication context
// • Tracks authentication state across the app.
// • Stores access/refresh tokens in localStorage.
// • Fetches and exposes the current user object.
// -----------------------------------------------------------------------------

import React, { createContext, useContext, useEffect, useState } from 'react';
import axiosClient from '../api/axiosClient';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(
    !!localStorage.getItem('access')
  );
  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem('user')) || null
  );

  // ---------------------------------------------------------------------------
  // Keep authentication state in sync with localStorage
  // ---------------------------------------------------------------------------
  useEffect(() => {
    const handler = () => {
      setIsAuthenticated(!!localStorage.getItem('access'));
      const storedUser = localStorage.getItem('user');
      setUser(storedUser ? JSON.parse(storedUser) : null);
    };
    window.addEventListener('storage', handler);
    return () => window.removeEventListener('storage', handler);
  }, []);

  // ---------------------------------------------------------------------------
  // Fetch the current user from API
  // ---------------------------------------------------------------------------
  const fetchCurrentUser = async () => {
    try {
      const res = await axiosClient.get('/users/me/');
      setUser(res.data);
      localStorage.setItem('user', JSON.stringify(res.data));
    } catch (err) {
      console.error('Failed to fetch current user:', err);
      setUser(null);
      localStorage.removeItem('user');
    }
  };

  // ---------------------------------------------------------------------------
  // Login / Logout handlers
  // ---------------------------------------------------------------------------
  const login = async (access, refresh) => {
    localStorage.setItem('access', access);
    localStorage.setItem('refresh', refresh);
    setIsAuthenticated(true);
    await fetchCurrentUser(); // ✅ immediately fetch user info
  };

  const logout = () => {
    localStorage.removeItem('access');
    localStorage.removeItem('refresh');
    localStorage.removeItem('user');
    setIsAuthenticated(false);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
