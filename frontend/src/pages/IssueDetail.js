// -----------------------------------------------------------------------------
// IssueDetail.js
// -----------------------------------------------------------------------------
// Shows details of a single issue (title, description, status, priority).
// - Fetches issue by ID (with comments included).
// - Displays metadata (reporter, project).
// - Provides edit and delete actions.
// - Allows adding new comments inline.
// - Styled with IssueDetail.module.css
// -----------------------------------------------------------------------------

import React, { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axiosClient from '../api/axiosClient';
import LoadingSpinner from '../components/LoadingSpinner';
import { useToast } from '../context/ToastContext';
import styles from './IssueDetail.module.css';

export default function IssueDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [issue, setIssue] = useState(null);
  const [loading, setLoading] = useState(true);
  const [newComment, setNewComment] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // ---------------------------------------------------------------------------
  // Fetch issue (with nested comments)
  // ---------------------------------------------------------------------------
  const fetchIssue = useCallback(async () => {
    try {
      const res = await axiosClient.get(`/issues/${id}/`);
      setIssue(res.data);
    } catch {
      showToast('Failed to load issue', 'error');
    } finally {
      setLoading(false);
    }
  }, [id, showToast]);

  useEffect(() => {
    fetchIssue();
  }, [fetchIssue]);

  // ---------------------------------------------------------------------------
  // Delete issue
  // ---------------------------------------------------------------------------
  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this issue?')) return;

    try {
      await axiosClient.delete(`/issues/${id}/`);
      showToast('Issue deleted', 'success');
      navigate('/issues');
    } catch {
      showToast('Failed to delete issue', 'error');
    }
  };

  // ---------------------------------------------------------------------------
  // Add comment
  // ---------------------------------------------------------------------------
  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    try {
      setSubmitting(true);
      await axiosClient.post('/comments/', {
        issue: id,
        content: newComment,
      });
      setNewComment('');
      showToast('Comment added!', 'success');
      fetchIssue(); // refresh comments
    } catch {
      showToast('Failed to add comment', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  // ---------------------------------------------------------------------------
  // Render states
  // ---------------------------------------------------------------------------
  if (loading) return <LoadingSpinner />;
  if (!issue) return <p>Issue not found.</p>;

  // ---------------------------------------------------------------------------
  // Main render
  // ---------------------------------------------------------------------------
  return (
    <div className={styles.container}>
      {/* ===== Issue Header ===== */}
      <div className={styles.header}>
        <h1 className={styles.title}>{issue.title}</h1>
        <p className={styles.description}>{issue.description}</p>

        <div className={styles.meta}>
          <p>Status: <strong>{issue.status}</strong></p>
          <p>Priority: <strong>{issue.priority}</strong></p>
          <p>Reporter: {issue.reporter ? issue.reporter.username : '—'}</p>
        </div>

        {/* Actions */}
        <div className={styles.actions}>
          <Link to={`/issues/${id}/edit`} className={styles.editBtn}>
            Edit
          </Link>
          <button
            onClick={handleDelete}
            className={styles.deleteBtn}
            disabled={submitting}
          >
            Delete
          </button>
        </div>
      </div>

      {/* ===== Comments Section ===== */}
      <div className={styles.comments}>
        <h2>Comments</h2>

        {issue.comments && issue.comments.length > 0 ? (
          <ul className={styles.commentList}>
            {issue.comments.map((c) => (
              <li key={c.id} className={styles.commentItem}>
                <p className={styles.commentContent}>{c.content}</p>
                <small className={styles.commentMeta}>
                  by {c.author ? c.author.username : '—'} on{' '}
                  {new Date(c.created_at).toLocaleString()}
                </small>
              </li>
            ))}
          </ul>
        ) : (
          <p className={styles.noComments}>No comments yet.</p>
        )}

        {/* ===== Add Comment Form ===== */}
        <form onSubmit={handleCommentSubmit} className={styles.commentForm}>
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Write a comment..."
            rows="3"
            className={styles.textarea}
          />
          <button
            type="submit"
            disabled={submitting}
            className={styles.submitBtn}
          >
            {submitting ? 'Posting...' : 'Post Comment'}
          </button>
        </form>
      </div>
    </div>
  );
}
