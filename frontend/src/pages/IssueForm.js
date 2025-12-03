// src/pages/IssueForm.js
// -----------------------------------------------------------------------------
// IssueForm component
// - Used for both creating and editing issues
// - Handles its own submission logic (no onSubmit prop needed)
// - Fields: title, description, project, assignees, status, priority
// - Styled with IssueForm.module.css for consistency
// -----------------------------------------------------------------------------

import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axiosClient from '../api/axiosClient';
import { unwrapResults } from '../api/apiHelpers';
import LoadingSpinner from '../components/LoadingSpinner';
import { useToast } from '../context/ToastContext';
import styles from './IssueForm.module.css';

export default function IssueForm({ isEdit = false }) {
  const { id } = useParams(); // ✅ for edit mode
  const navigate = useNavigate();
  const { showToast } = useToast();

  // ---------------------------------------------------------------------------
  // Local state
  // ---------------------------------------------------------------------------
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    project: '',
    assignees: [],
    status: 'open',
    priority: 'medium',
  });

  const [projects, setProjects] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(isEdit); // only show spinner if editing
  const [submitting, setSubmitting] = useState(false);

  // ---------------------------------------------------------------------------
  // Fetch supporting data (projects + users)
  // ---------------------------------------------------------------------------
  const fetchProjects = useCallback(async () => {
    const res = await axiosClient.get('/projects/');
    setProjects(unwrapResults(res));
  }, []);

  const fetchUsers = useCallback(async () => {
    const res = await axiosClient.get('/users/');
    setUsers(unwrapResults(res));
  }, []);

  const fetchIssue = useCallback(async () => {
    if (!isEdit) return;
    try {
      const res = await axiosClient.get(`/issues/${id}/`);
      setFormData({
        title: res.data.title,
        description: res.data.description,
        project: res.data.project,
        assignees: res.data.assignees || [],
        status: res.data.status,
        priority: res.data.priority,
      });
    } catch {
      showToast('Failed to load issue', 'error');
    } finally {
      setLoading(false);
    }
  }, [id, isEdit, showToast]);

  useEffect(() => {
    (async () => {
      await Promise.all([fetchProjects(), fetchUsers()]);
      if (isEdit) await fetchIssue();
    })();
  }, [fetchProjects, fetchUsers, fetchIssue, isEdit]);

  // ---------------------------------------------------------------------------
  // Handle input changes
  // ---------------------------------------------------------------------------
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleMultiSelect = (e) => {
    const options = Array.from(e.target.selectedOptions, (o) => o.value);
    setFormData((prev) => ({ ...prev, assignees: options }));
  };

  // ---------------------------------------------------------------------------
  // Handle submit
  // ---------------------------------------------------------------------------
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      if (isEdit) {
        await axiosClient.put(`/issues/${id}/`, formData);
        showToast('Issue updated successfully!', 'success');
        navigate(`/issues/${id}`);
      } else {
        const res = await axiosClient.post('/issues/', formData);
        showToast('Issue created successfully!', 'success');
        navigate(`/issues/${res.data.id}`);
      }
    } catch {
      showToast(isEdit ? 'Failed to update issue' : 'Failed to create issue', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  // ---------------------------------------------------------------------------
  // Render
  // ---------------------------------------------------------------------------
  if (loading) return <LoadingSpinner />;

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>
        {isEdit ? 'Edit Issue' : 'Create New Issue'}
      </h1>

      <form onSubmit={handleSubmit} className={styles.form}>
        {/* Title */}
        <div className={styles.field}>
          <label htmlFor="title" className={styles.label}>Title</label>
          <input
            id="title"
            name="title"
            type="text"
            value={formData.title}
            onChange={handleChange}
            className={styles.input}
            required
          />
        </div>

        {/* Description */}
        <div className={styles.field}>
          <label htmlFor="description" className={styles.label}>Description</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            className={styles.textarea}
          />
        </div>

        {/* Project */}
        <div className={styles.field}>
          <label htmlFor="project" className={styles.label}>Project</label>
          <select
            id="project"
            name="project"
            value={formData.project}
            onChange={handleChange}
            className={styles.select}
            required
          >
            <option value="">-- Select Project --</option>
            {projects.map((p) => (
              <option key={p.id} value={p.id}>{p.name}</option>
            ))}
          </select>
        </div>

        {/* Assignees */}
        <div className={styles.field}>
          <label htmlFor="assignees" className={styles.label}>Assignees</label>
          <select
            id="assignees"
            name="assignees"
            multiple
            value={formData.assignees}
            onChange={handleMultiSelect}
            className={styles.multiselect}
          >
            {users.map((u) => (
              <option key={u.id} value={u.id}>{u.username}</option>
            ))}
          </select>
        </div>

        {/* Status */}
        <div className={styles.field}>
          <label htmlFor="status" className={styles.label}>Status</label>
          <select
            id="status"
            name="status"
            value={formData.status}
            onChange={handleChange}
            className={styles.select}
          >
            <option value="open">Open</option>
            <option value="in_progress">In Progress</option>
            <option value="closed">Closed</option>
          </select>
        </div>

        {/* Priority */}
        <div className={styles.field}>
          <label htmlFor="priority" className={styles.label}>Priority</label>
          <select
            id="priority"
            name="priority"
            value={formData.priority}
            onChange={handleChange}
            className={styles.select}
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>

        {/* Actions */}
        <div className={styles.actions}>
          <button type="submit" className={styles.button} disabled={submitting}>
            {submitting ? (isEdit ? 'Updating...' : 'Creating...') : (isEdit ? 'Update' : 'Create')}
          </button>
          <button
            type="button"
            className={`${styles.button} ${styles.cancelBtn}`}
            onClick={() => navigate('/issues')}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
