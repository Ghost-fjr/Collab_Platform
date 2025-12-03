// src/pages/ProjectDetail.js
// -----------------------------------------------------------------------------
// ProjectDetail page
// - Fetches a single project from the DRF backend by ID
// - Displays project info (name, description, members, owner)
// - Lists issues related to the project (nested from serializer)
// - Handles loading / error / empty states
// - Styled with ProjectDetail.module.css for consistency
// -----------------------------------------------------------------------------

import React, { useEffect, useState, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import axiosClient from '../api/axiosClient';
import LoadingSpinner from '../components/LoadingSpinner';
import { useToast } from '../context/ToastContext';
import styles from './ProjectDetail.module.css';

export default function ProjectDetail() {
  const { id } = useParams();
  const { showToast } = useToast();

  // ---------------------------------------------------------------------------
  // Local state
  // ---------------------------------------------------------------------------
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // ---------------------------------------------------------------------------
  // Fetch project
  // ---------------------------------------------------------------------------
  const fetchProject = useCallback(async () => {
    try {
      const res = await axiosClient.get(`/projects/${id}/`);
      setProject(res.data);
    } catch (err) {
      console.error(err);
      setError('Failed to load project.');
      showToast('Failed to load project', 'error');
    } finally {
      setLoading(false);
    }
  }, [id, showToast]);

  useEffect(() => {
    fetchProject();
  }, [fetchProject]);

  // ---------------------------------------------------------------------------
  // Loading / error / empty states
  // ---------------------------------------------------------------------------
  if (loading) return <LoadingSpinner />;
  if (error) return <p className={styles.error}>{error}</p>;
  if (!project) return <p className={styles.status}>Project not found.</p>;

  // ---------------------------------------------------------------------------
  // Render
  // ---------------------------------------------------------------------------
  return (
    <div className={styles.container}>
      {/* ===== Project Info ===== */}
      <h1 className={styles.title}>{project.name}</h1>
      <p className={styles.description}>{project.description}</p>

      <p>
        <strong>Owner:</strong> {project.owner?.username || '—'}
      </p>
      <p>
        <strong>Members:</strong>{' '}
        {project.members && project.members.length > 0
          ? project.members.join(', ')
          : 'No members yet.'}
      </p>

      {/* ===== Issues Section ===== */}
      <div className={styles.issuesSection}>
        <div className={styles.header}>
          <h2 className={styles.subtitle}>Issues</h2>
          <Link
            to={`/issues/new?project=${project.id}`}
            className={styles.newBtn}
          >
            + New Issue
          </Link>
        </div>

        {project.issues && project.issues.length > 0 ? (
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Title</th>
                <th>Status</th>
                <th>Priority</th>
              </tr>
            </thead>
            <tbody>
              {project.issues.map((issue) => (
                <tr key={issue.id}>
                  <td>
                    <Link to={`/issues/${issue.id}`} className={styles.link}>
                      {issue.title}
                    </Link>
                  </td>
                  <td>{issue.status}</td>
                  <td>{issue.priority}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className={styles.status}>No issues for this project yet.</p>
        )}
      </div>
    </div>
  );
}
