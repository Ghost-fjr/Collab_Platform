// src/components/ProjectCard.js
// ✅ Enhanced dashboard card for each project
// - Shows comprehensive project metrics
// - Displays members, timeline, budget, and progress
// - Supports inline edit & delete

import React, { useState } from "react";
import { Link } from "react-router-dom";
import axiosClient from "../api/axiosClient";
import styles from './ProjectCard.module.css';

export default function ProjectCard({ project, onDelete }) {
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [data, setData] = useState({
    name: project.name,
    description: project.description,
  });
  const [error, setError] = useState(null);

  // ---- Update project ----
  const handleUpdate = async () => {
    setSaving(true);
    setError(null);
    try {
      await axiosClient.put(`projects/${project.id}/`, data);
      setEditing(false);
    } catch (err) {
      setError("❗ Failed to update project");
    } finally {
      setSaving(false);
    }
  };

  // ---- Delete project ----
  const handleDelete = async () => {
    if (!window.confirm("Delete this project?")) return;
    try {
      await axiosClient.delete(`projects/${project.id}/`);
      onDelete(project.id);
    } catch (err) {
      setError("❗ Failed to delete project");
    }
  };

  // Format date helper
  const formatDate = (dateString) => {
    if (!dateString) return 'Not set';
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  // Format currency helper
  const formatCurrency = (amount) => {
    if (!amount) return '$0.00';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  return (
    <div className={styles.card}>
      {editing ? (
        <div className={styles.editForm}>
          <input
            value={data.name}
            onChange={(e) => setData({ ...data, name: e.target.value })}
            disabled={saving}
            className={styles.input}
          />
          <textarea
            value={data.description}
            onChange={(e) => setData({ ...data, description: e.target.value })}
            disabled={saving}
            className={styles.textarea}
          />
          <div className={styles.actions}>
            <button onClick={handleUpdate} disabled={saving} className={styles.saveButton}>
              {saving ? "Saving…" : "Save"}
            </button>
            <button onClick={() => setEditing(false)} disabled={saving} className={styles.cancelButton}>
              Cancel
            </button>
          </div>
          {error && <p className={styles.error}>{error}</p>}
        </div>
      ) : (
        <>
          {/* Header */}
          <div className={styles.header}>
            <Link to={`/projects/${project.id}`} className={styles.titleLink}>
              <h2 className={styles.title}>{project.name}</h2>
            </Link>
            <div className={styles.menu}>
              <button onClick={() => setEditing(true)} className={styles.iconButton} title="Edit">✎</button>
              <button onClick={handleDelete} className={styles.iconButton} title="Delete">🗑️</button>
            </div>
          </div>

          <p className={styles.description}>{project.description || 'No description'}</p>

          {/* Progress Section */}
          <div className={styles.progressSection}>
            <div className={styles.progressLabel}>
              <span>Progress</span>
              <span className={styles.progressPercent}>{project.progress}%</span>
            </div>
            <div className={styles.progressBar}>
              <div
                className={styles.progressFill}
                style={{ width: `${project.progress}%` }}
              />
            </div>
          </div>

          {/* Dashboard Metrics Grid */}
          <div className={styles.metricsGrid}>
            {/* Members */}
            <div className={styles.metric}>
              <div className={styles.metricIcon}>👥</div>
              <div className={styles.metricContent}>
                <div className={styles.metricLabel}>Team Members</div>
                <div className={styles.metricValue}>
                  {project.member_count || 0} member{project.member_count !== 1 ? 's' : ''}
                </div>
                {project.members_detail && project.members_detail.length > 0 && (
                  <div className={styles.membersList}>
                    {project.members_detail.slice(0, 3).map(member => (
                      <span key={member.id} className={styles.memberBadge}>
                        {member.username}
                      </span>
                    ))}
                    {project.members_detail.length > 3 && (
                      <span className={styles.memberBadge}>
                        +{project.members_detail.length - 3} more
                      </span>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Timeline */}
            <div className={styles.metric}>
              <div className={styles.metricIcon}>📅</div>
              <div className={styles.metricContent}>
                <div className={styles.metricLabel}>Timeline</div>
                <div className={styles.metricValue}>
                  {formatDate(project.start_date)}
                </div>
                <div className={styles.metricSubtext}>
                  to {formatDate(project.end_date)}
                </div>
              </div>
            </div>

            {/* Budget */}
            <div className={styles.metric}>
              <div className={styles.metricIcon}>💰</div>
              <div className={styles.metricContent}>
                <div className={styles.metricLabel}>Budget</div>
                <div className={styles.metricValue}>
                  {formatCurrency(project.funds_allocated)}
                </div>
              </div>
            </div>

            {/* Issues Stats */}
            <div className={styles.metric}>
              <div className={styles.metricIcon}>📊</div>
              <div className={styles.metricContent}>
                <div className={styles.metricLabel}>Issues</div>
                <div className={styles.metricValue}>
                  {project.stats?.total || 0} total
                </div>
                <div className={styles.issueStats}>
                  <span className={styles.statBadge} data-status="open">
                    {project.stats?.open || 0} open
                  </span>
                  <span className={styles.statBadge} data-status="progress">
                    {project.stats?.in_progress || 0} in progress
                  </span>
                  <span className={styles.statBadge} data-status="closed">
                    {project.stats?.closed || 0} closed
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className={styles.footer}>
            <span className={styles.createdDate}>
              Created {new Date(project.created_at).toLocaleDateString()}
            </span>
          </div>

          {error && <p className={styles.error}>{error}</p>}
        </>
      )}
    </div>
  );
}
