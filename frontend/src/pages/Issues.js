// -----------------------------------------------------------------------------
// Issues.js
// -----------------------------------------------------------------------------
// Issues listing page
// - Fetches issues from the DRF backend (paginated).
// - Fetches projects to map project IDs → project names.
// - Displays issues in a responsive table with clickable titles.
// - Handles loading, error, and empty states gracefully.
// - Styled with Issues.module.css
// -----------------------------------------------------------------------------

import React, { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import axiosClient from '../api/axiosClient';
import { unwrapResults } from '../api/apiHelpers';
import LoadingSpinner from '../components/LoadingSpinner';
import { useToast } from '../context/ToastContext';
import styles from './Issues.module.css';

export default function Issues() {
  const { showToast } = useToast();

  // ---------------------------------------------------------------------------
  // Local state
  // ---------------------------------------------------------------------------
  const [issues, setIssues] = useState([]);
  const [projects, setProjects] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('');

  // ---------------------------------------------------------------------------
  // Fetch projects (map IDs → names)
  // ---------------------------------------------------------------------------
  const fetchProjects = useCallback(async () => {
    try {
      const res = await axiosClient.get('/projects/');
      const projectsArray = unwrapResults(res);

      const map = {};
      projectsArray.forEach((p) => {
        map[p.id] = p.name;
      });
      setProjects(map);
    } catch (err) {
      console.error(err);
      setError('Failed to load projects.');
      showToast('Failed to load projects', 'error');
    }
  }, [showToast]);

  // ---------------------------------------------------------------------------
  // Fetch issues
  // ---------------------------------------------------------------------------
  const fetchIssues = useCallback(async () => {
    try {
      setLoading(true);
      const res = await axiosClient.get('/issues/');
      setIssues(unwrapResults(res));
    } catch (err) {
      console.error(err);
      setError('Failed to load issues.');
      showToast('Failed to load issues', 'error');
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  // ---------------------------------------------------------------------------
  // Initial load (fetch projects + issues in parallel)
  // ---------------------------------------------------------------------------
  useEffect(() => {
    (async () => {
      await Promise.all([fetchProjects(), fetchIssues()]);
    })();
  }, [fetchProjects, fetchIssues]);

  // ---------------------------------------------------------------------------
  // Loading / error / empty states
  // ---------------------------------------------------------------------------
  if (loading) return <LoadingSpinner />;
  if (error) return <p className={styles.error}>{error}</p>;
  if (!loading && issues.length === 0) {
    return <p className={styles.noIssues}>No issues found.</p>;
  }

  // ---------------------------------------------------------------------------
  // Render
  // ---------------------------------------------------------------------------
  return (
    <div className={styles.container}>
      {/* ===== Header with "New Issue" button ===== */}
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Issues</h1>
          <p className={styles.subtitle}>Track and manage project tasks</p>
        </div>
        <Link to="/issues/new" className={styles.button}>
          + New Issue
        </Link>
      </div>

      {/* ===== Filters ===== */}
      <div className={styles.filters}>
        <div className={styles.filterGroup}>
          <label className={styles.filterLabel}>Search</label>
          <input
            type="text"
            placeholder="Search issues..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className={styles.searchInput}
          />
        </div>

        <div className={styles.filterGroup}>
          <label className={styles.filterLabel}>Status</label>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className={styles.filterSelect}
          >
            <option value="">All Statuses</option>
            <option value="open">Open</option>
            <option value="in_progress">In Progress</option>
            <option value="closed">Closed</option>
          </select>
        </div>

        <div className={styles.filterGroup}>
          <label className={styles.filterLabel}>Priority</label>
          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className={styles.filterSelect}
          >
            <option value="">All Priorities</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
        </div>
      </div>

      {/* ===== Issues Grid ===== */}
      {(() => {
        // Apply filters
        let filteredIssues = issues;

        // Filter by search text
        if (search.trim()) {
          filteredIssues = filteredIssues.filter((issue) =>
            issue.title.toLowerCase().includes(search.toLowerCase())
          );
        }

        // Filter by status
        if (statusFilter) {
          filteredIssues = filteredIssues.filter((issue) => issue.status === statusFilter);
        }

        // Filter by priority
        if (priorityFilter) {
          filteredIssues = filteredIssues.filter((issue) => issue.priority === priorityFilter);
        }

        // Render filtered results
        if (loading) {
          return <LoadingSpinner />;
        }

        if (error) {
          return <div className={styles.error}>{error}</div>;
        }

        if (filteredIssues.length === 0) {
          return (
            <div className={styles.empty}>
              <h3>No issues found</h3>
              <p>Try adjusting your filters or create a new issue.</p>
            </div>
          );
        }

        return (
          <div className={styles.issueList}>
            {filteredIssues.map((issue) => (
              <Link to={`/issues/${issue.id}`} key={issue.id} className={styles.issueCard}>
                <div className={styles.issueHeader}>
                  <span className={styles.issueTitle}>{issue.title}</span>
                  <span className={styles.issueMeta}>
                    <span className={styles.date}>
                      {new Date(issue.created_at).toLocaleDateString()}
                    </span>
                  </span>
                </div>

                <div className={styles.issueDescription}>
                  {projects[issue.project] || 'Project'} • {issue.reporter ? `Reported by ${issue.reporter.username}` : 'No reporter'}
                </div>

                <div className={styles.issueMeta}>
                  <span className={`${styles.badge} ${issue.status === 'open' ? styles.statusOpen :
                    issue.status === 'in_progress' ? styles.statusInProgress :
                      styles.statusClosed
                    }`}>
                    {issue.status.replace('_', ' ')}
                  </span>
                  <span className={`${styles.badge} ${issue.priority === 'high' ? styles.priorityHigh :
                    issue.priority === 'medium' ? styles.priorityMedium :
                      styles.priorityLow
                    }`}>
                    {issue.priority}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        );
      })()}
    </div>
  );
}
