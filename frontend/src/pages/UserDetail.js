// src/pages/UserDetail.js
// -----------------------------------------------------------------------------
// Single user detail page
// - Fetches a user from the DRF backend (`/api/users/:id/`).
// - Shows extended info (username, role, bio, email, etc.).
// - Handles loading / error states consistently.
// - Styled with UserDetail.module.css
// -----------------------------------------------------------------------------

import React, { useEffect, useState, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import axiosClient from '../api/axiosClient';
import LoadingSpinner from '../components/LoadingSpinner';
import { useToast } from '../context/ToastContext';
import styles from './UserDetail.module.css';

export default function UserDetail() {
  const { id } = useParams();
  const { showToast } = useToast();

  // ---------------------------------------------------------------------------
  // Local state
  // ---------------------------------------------------------------------------
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // ---------------------------------------------------------------------------
  // Fetch user
  // ---------------------------------------------------------------------------
  const fetchUser = useCallback(async () => {
    try {
      setLoading(true);
      const res = await axiosClient.get(`/users/${id}/`); // ✅ correct endpoint
      setUser(res.data);
    } catch (err) {
      console.error(err);
      setError('Failed to load user.');
      showToast('Failed to load user', 'error');
    } finally {
      setLoading(false);
    }
  }, [id, showToast]);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  // ---------------------------------------------------------------------------
  // Render
  // ---------------------------------------------------------------------------
  if (loading) return <LoadingSpinner />;
  if (error) return <p className={styles.error}>{error}</p>;
  if (!user) return <p className={styles.status}>User not found.</p>;

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h1 className={styles.username}>{user.username}</h1>

        <div className={styles.info}>
          <p><span className={styles.label}>Role:</span> {user.role || '—'}</p>
          <p>
            <span className={styles.label}>Name:</span>{' '}
            {user.first_name || '—'} {user.last_name || ''}
          </p>
          <p><span className={styles.label}>Email:</span> {user.email || '—'}</p>
          <p><span className={styles.label}>Bio:</span> {user.bio || '—'}</p>
          <p>
            <span className={styles.label}>Joined:</span>{' '}
            {user.date_joined
              ? new Date(user.date_joined).toLocaleString()
              : '—'}
          </p>
          {user.last_login && (
            <p>
              <span className={styles.label}>Last Login:</span>{' '}
              {new Date(user.last_login).toLocaleString()}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
