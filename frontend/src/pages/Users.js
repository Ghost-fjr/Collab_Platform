// src/pages/Users.js
// -----------------------------------------------------------------------------
// Users listing page
// - Fetches users from the DRF backend (`/api/users/`).
// - Displays them in a responsive table with clickable usernames.
// - Handles loading / error / empty states consistently.
// - Styled with Users.module.css
// -----------------------------------------------------------------------------

import React, { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import axiosClient from '../api/axiosClient';
import { unwrapResults } from '../api/apiHelpers'; // ✅ use wrapper
import LoadingSpinner from '../components/LoadingSpinner';
import { useToast } from '../context/ToastContext';
import styles from './Users.module.css';

export default function Users() {
  const { showToast } = useToast();

  // ---------------------------------------------------------------------------
  // Local state
  // ---------------------------------------------------------------------------
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // ---------------------------------------------------------------------------
  // Fetch users
  // ---------------------------------------------------------------------------
  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);
      const res = await axiosClient.get('/users/'); // ✅ correct endpoint
      setUsers(unwrapResults(res)); // ✅ unwrap `results` safely
    } catch (err) {
      console.error(err);
      setError('Failed to load users.');
      showToast('Failed to load users', 'error');
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  // ---------------------------------------------------------------------------
  // Loading / error / empty states
  // ---------------------------------------------------------------------------
  if (loading) return <LoadingSpinner />;
  if (error) return <p className={styles.error}>{error}</p>;
  if (users.length === 0) {
    return <p className={styles.status}>No users found.</p>;
  }

  // ---------------------------------------------------------------------------
  // Render users table
  // ---------------------------------------------------------------------------
  return (
    <div className={styles.container}>
      {/* ===== Header ===== */}
      <div className={styles.header}>
        <h1 className={styles.title}>Users</h1>
      </div>

      {/* ===== Users Table ===== */}
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Username</th>
            <th>Role</th>
            <th>First Name</th>
            <th>Last Name</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u) => (
            <tr key={u.id}>
              <td>
                <Link to={`/users/${u.id}`} className={styles.link}>
                  {u.username}
                </Link>
              </td>
              <td>{u.role || '—'}</td>
              <td>{u.first_name || '—'}</td>
              <td>{u.last_name || '—'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
