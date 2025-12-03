// -----------------------------------------------------------------------------
// Projects.js
// -----------------------------------------------------------------------------
// Project listing page
// - Fetches projects from the DRF backend
// - Supports both paginated (`res.data.results`) and non-paginated (`res.data`)
// - Displays them in a responsive grid with clean, clickable cards
// - Handles loading / error / empty states gracefully
// - Includes "+ New Project" button for future expansion
// -----------------------------------------------------------------------------

import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axiosClient from '../api/axiosClient';
import styles from './Projects.module.css'; // ✅ CSS Module for scoped styling
import LoadingSpinner from '../components/LoadingSpinner';
import { useToast } from '../context/ToastContext';

export default function Projects() {
  // ---------------------------------------------------------------------------
  // Local state
  // ---------------------------------------------------------------------------
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { showToast } = useToast();

  // ---------------------------------------------------------------------------
  // Fetch projects on component mount
  // ---------------------------------------------------------------------------
  useEffect(() => {
    async function fetchProjects() {
      try {
        // ✅ DRF may return paginated (results) or flat array
        const res = await axiosClient.get('/projects/');
        setProjects(res.data.results || res.data);
      } catch (err) {
        console.error(err);
        setError('Could not load projects.');
        showToast('Failed to fetch projects', 'error'); // ✅ user-facing feedback
      } finally {
        setLoading(false);
      }
    }
    fetchProjects();
  }, [showToast]);

  // ---------------------------------------------------------------------------
  // Loading / error / empty states
  // ---------------------------------------------------------------------------
  if (loading) return <LoadingSpinner />;
  if (error) return <p className={styles.error}>{error}</p>;
  if (!loading && projects.length === 0) {
    return <p className={styles.status}>No projects available.</p>;
  }

  // ---------------------------------------------------------------------------
  // Render projects grid
  // ---------------------------------------------------------------------------
  return (
    <div className={styles.container}>
      {/* ===== Header ===== */}
      <div className={styles.header}>
        <h1 className={styles.title}>Projects</h1>
        <Link to="/projects/new" className={styles.button}>
          + New Project
        </Link>
      </div>

      {/* ===== Projects Grid ===== */}
      <div className={styles.grid}>
        {projects.map((p) => (
          <Link
            key={p.id}
            to={`/projects/${p.id}`}
            className={styles.card} // ✅ entire card is clickable
          >
            <h2 className={styles.name}>{p.name}</h2>
            <p className={styles.description}>
              {p.description || 'No description provided.'}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}
