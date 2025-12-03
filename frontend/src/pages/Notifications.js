// src/pages/Notifications.js
// -----------------------------------------------------------------------------
// Notifications listing page
// - Fetches notifications for the logged-in user from /api/notifications/.
// - Uses unwrapResults() to normalize paginated/flat responses.
// - Displays them in a clean, readable list with read/unread styles.
// - Supports mark_read, mark_unread, and delete actions.
// - Styled with Notifications.module.css
// -----------------------------------------------------------------------------

import React, { useEffect, useState, useCallback } from 'react';
import axiosClient from '../api/axiosClient';
import { unwrapResults } from '../api/apiHelpers'; // ✅ unified helper
import LoadingSpinner from '../components/LoadingSpinner';
import { useToast } from '../context/ToastContext';
import styles from './Notifications.module.css';

export default function Notifications() {
  const { showToast } = useToast();

  // ---------------------------------------------------------------------------
  // Local state
  // ---------------------------------------------------------------------------
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // ---------------------------------------------------------------------------
  // Fetch notifications
  // ---------------------------------------------------------------------------
  const fetchNotifications = useCallback(async () => {
    try {
      setLoading(true);
      const res = await axiosClient.get('/notifications/');
      console.log('Notifications response:', res);
      const unwrapped = unwrapResults(res);
      console.log('Unwrapped notifications:', unwrapped);
      setNotifications(unwrapped); // ✅ consistent
    } catch (err) {
      console.error('Fetch notifications error:', err);
      setError('Failed to load notifications.');
      showToast('Failed to load notifications', 'error');
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  // ---------------------------------------------------------------------------
  // Actions
  // ---------------------------------------------------------------------------
  const markAsRead = async (id) => {
    try {
      await axiosClient.post(`/notifications/${id}/mark_read/`);
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, is_read: true } : n))
      );
      showToast('Marked as read', 'success');
    } catch {
      showToast('Action failed', 'error');
    }
  };

  const markAsUnread = async (id) => {
    try {
      await axiosClient.post(`/notifications/${id}/mark_unread/`);
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, is_read: false } : n))
      );
      showToast('Marked as unread', 'success');
    } catch {
      showToast('Action failed', 'error');
    }
  };

  const markAllRead = async () => {
    try {
      await axiosClient.post(`/notifications/mark_all_read/`);
      setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));
      showToast('All notifications marked as read', 'success');
    } catch {
      showToast('Action failed', 'error');
    }
  };

  const deleteNotification = async (id) => {
    try {
      await axiosClient.delete(`/notifications/${id}/`);
      setNotifications((prev) => prev.filter((n) => n.id !== id));
      showToast('Notification deleted', 'success');
    } catch {
      showToast('Failed to delete notification', 'error');
    }
  };

  // ---------------------------------------------------------------------------
  // Loading / error / empty states
  // ---------------------------------------------------------------------------
  if (loading) return <LoadingSpinner />;
  if (error) return <p className={styles.error}>{error}</p>;
  if (!loading && notifications.length === 0) {
    return <p className={styles.status}>No notifications yet.</p>;
  }

  // ---------------------------------------------------------------------------
  // Render notifications list
  // ---------------------------------------------------------------------------
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Notifications</h1>
        {notifications.some((n) => !n.is_read) && (
          <button onClick={markAllRead} className={styles.actionBtn}>
            Mark All Read
          </button>
        )}
      </div>

      <ul className={styles.list}>
        {notifications.map((n) => (
          <li
            key={n.id}
            className={`${styles.item} ${n.is_read ? styles.read : styles.unread}`}
          >
            <div className={styles.message}>{n.message}</div>
            <div className={styles.meta}>
              <small>{new Date(n.created_at).toLocaleString()}</small>
            </div>
            <div className={styles.actions}>
              {n.is_read ? (
                <button
                  onClick={() => markAsUnread(n.id)}
                  className={styles.actionBtn}
                >
                  Mark Unread
                </button>
              ) : (
                <button
                  onClick={() => markAsRead(n.id)}
                  className={styles.actionBtn}
                >
                  Mark Read
                </button>
              )}
              <button
                onClick={() => deleteNotification(n.id)}
                className={`${styles.actionBtn} ${styles.deleteBtn}`}
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
