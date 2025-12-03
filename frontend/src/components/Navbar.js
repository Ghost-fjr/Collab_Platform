// -----------------------------------------------------------------------------
// Navbar.js
// -----------------------------------------------------------------------------
// Top navigation bar for the Collaboration & Issue Resolution Platform
// • Uses NavLink to automatically highlight the active route.
// • If logged in, shows the current user's profile (with dropdown) on the right.
// • Logout is nested inside the profile dropdown.
// • Dropdown closes when clicking outside OR after selecting an option.
// • Styling is isolated in a CSS module for easier maintenance.
// -----------------------------------------------------------------------------

import React, { useEffect, useRef, useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axiosClient from '../api/axiosClient';
import styles from './Navbar.module.css'; // ✅ import the CSS module

export default function Navbar() {
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  // ---------------------------------------------------------------------------
  // Local state for current user (fetched from /users/me/) + dropdown open
  // ---------------------------------------------------------------------------
  const [user, setUser] = useState(null);
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    if (isAuthenticated) {
      axiosClient
        .get('/users/me/')
        .then((res) => setUser(res.data))
        .catch(() => setUser(null));
    }
  }, [isAuthenticated]);

  // ---------------------------------------------------------------------------
  // Close dropdown if clicking outside
  // ---------------------------------------------------------------------------
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  /**
   * Handle user logout:
   * 1️⃣ Clear authentication tokens via AuthContext.
   * 2️⃣ Redirect the user back to the Login page.
   */
  const handleLogout = () => {
    logout();
    setOpen(false); // ✅ close dropdown after logout
    navigate('/login');
  };

  /**
   * NavLink lets us check if a route is active via the isActive prop.
   * We return a dynamic className string that adds the `active` style
   * when the link matches the current route.
   */
  const linkClass = ({ isActive }) =>
    isActive ? `${styles.link} ${styles.active}` : styles.link;

  return (
    <nav className={styles.navbar}>
      {/* ===== Left section: main site links ===== */}
      <NavLink to="/" className={linkClass} end>
        Home
      </NavLink>
      <NavLink to="/projects" className={linkClass}>
        Projects
      </NavLink>
      <NavLink to="/issues" className={linkClass}>
        Issues
      </NavLink>
      <NavLink to="/chats" className={linkClass}>
        Chats
      </NavLink>
      <NavLink to="/notifications" className={linkClass}>
        Notifications
      </NavLink>

      {/* ===== Right section: authentication controls ===== */}
      {isAuthenticated && user ? (
        // Profile dropdown with avatar + username + logout
        <div className={styles.dropdown} ref={dropdownRef}>
          <button
            className={styles.dropdownToggle}
            onClick={() => setOpen((prev) => !prev)}
          >
            {/* ✅ Avatar circle with first letter of username */}
            <span className={styles.avatar}>
              {user.username?.charAt(0).toUpperCase() || 'U'}
            </span>
            {user.username} ▾
          </button>
          {open && (
            <div className={styles.dropdownMenu}>
              <NavLink
                to={`/users/${user.id}`}
                className={styles.dropdownItem}
                onClick={() => setOpen(false)} // ✅ close dropdown after profile click
              >
                Profile
              </NavLink>
              <button
                onClick={handleLogout}
                className={`${styles.dropdownItem} ${styles.logoutBtn}`}
              >
                Logout
              </button>
            </div>
          )}
        </div>
      ) : (
        // Otherwise show a login link
        <NavLink
          to="/login"
          className={({ isActive }) =>
            `${linkClass({ isActive })} ${styles.loginLink}`
          }
        >
          Login
        </NavLink>
      )}
    </nav>
  );
}
