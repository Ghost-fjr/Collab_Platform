// src/pages/Home.js
import React, { useEffect, useState } from 'react';
import axiosClient from '../api/axiosClient';
import ProjectCard from '../components/ProjectCard';
import LoadingSpinner from '../components/LoadingSpinner';
import styles from './Home.module.css';

function Home() {
  const [projects, setProjects] = useState([]);
  const [users, setUsers] = useState([]);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [fundsAllocated, setFundsAllocated] = useState('');
  const [selectedMembers, setSelectedMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [creating, setCreating] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);

  // ✅ Load projects and users on mount
  useEffect(() => {
    fetchProjects();
    fetchUsers();
  }, []);

  // ---- Fetch all projects ----
  const fetchProjects = async () => {
    setError(null);
    setLoading(true);
    try {
      const res = await axiosClient.get('projects/');
      setProjects(res.data.results || res.data);
    } catch {
      setError('Failed to load projects');
    } finally {
      setLoading(false);
    }
  };

  // ---- Fetch all users for member selection ----
  const fetchUsers = async () => {
    try {
      const res = await axiosClient.get('users/');
      setUsers(res.data.results || res.data);
    } catch {
      console.error('Failed to load users');
    }
  };

  // ---- Create new project ----
  const handleCreate = async (e) => {
    e.preventDefault();
    if (!name.trim()) return;

    setCreating(true);
    setError(null);
    try {
      const projectData = {
        name,
        description,
        start_date: startDate || null,
        end_date: endDate || null,
        funds_allocated: fundsAllocated || null,
        members: selectedMembers
      };
      await axiosClient.post('projects/', projectData);
      // Reset form
      setName('');
      setDescription('');
      setStartDate('');
      setEndDate('');
      setFundsAllocated('');
      setSelectedMembers([]);
      fetchProjects(); // refresh list
    } catch {
      setError('Failed to create project');
    } finally {
      setCreating(false);
    }
  };

  // ---- Toggle member selection ----
  const toggleMember = (userId) => {
    setSelectedMembers(prev =>
      prev.includes(userId)
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    );
  };

  // ---- Delete project ----
  const handleDelete = async (id) => {
    if (!window.confirm('Delete this project?')) return;
    setError(null);
    try {
      await axiosClient.delete(`projects/${id}/`);
      fetchProjects();
    } catch {
      setError('Failed to delete project');
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className={styles.container}>
      {/* Hero Section */}
      <div className={styles.hero}>
        <h1 className={styles.heroTitle}>Welcome Back to PMYG!!😊</h1>
        <p className={styles.heroSubtitle}>
          Manage your projects, track issues, and collaborate with your team in one place.
        </p>
      </div>

      {error && <div className={styles.error}>{error}</div>}

      {/* Quick Create Section */}
      <div className={styles.createSection}>
        {!isFormOpen ? (
          <button
            onClick={() => setIsFormOpen(true)}
            className={styles.startProjectBtn}
          >
            + Start a New Project
          </button>
        ) : (
          <>
            <div className={styles.formHeader}>
              <h2 className={styles.formTitle}>Start a New Project</h2>
              <button
                onClick={() => setIsFormOpen(false)}
                className={styles.closeBtn}
                title="Close"
              >
                ✕
              </button>
            </div>
            <form onSubmit={handleCreate} className={styles.form}>
              <div className={styles.formGrid}>
                <div className={styles.field}>
                  <label className={styles.label}>Project Name *</label>
                  <input
                    type="text"
                    placeholder="Enter project name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className={styles.input}
                  />
                </div>
                <div className={styles.field}>
                  <label className={styles.label}>Description</label>
                  <input
                    type="text"
                    placeholder="Brief description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className={styles.input}
                  />
                </div>
              </div>

              <div className={styles.formGrid}>
                <div className={styles.field}>
                  <label className={styles.label}>Start Date</label>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className={styles.input}
                  />
                </div>
                <div className={styles.field}>
                  <label className={styles.label}>End Date</label>
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className={styles.input}
                  />
                </div>
                <div className={styles.field}>
                  <label className={styles.label}>Funds Allocated ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    value={fundsAllocated}
                    onChange={(e) => setFundsAllocated(e.target.value)}
                    className={styles.input}
                  />
                </div>
              </div>

              {users.length > 0 && (
                <div className={styles.field}>
                  <label className={styles.label}>Team Members</label>
                  <div className={styles.memberGrid}>
                    {users.map(user => (
                      <label key={user.id} className={styles.memberCheckbox}>
                        <input
                          type="checkbox"
                          checked={selectedMembers.includes(user.id)}
                          onChange={() => toggleMember(user.id)}
                        />
                        <span>{user.username}</span>
                      </label>
                    ))}
                  </div>
                </div>
              )}

              <div className={styles.formActions}>
                <button type="button" onClick={() => setIsFormOpen(false)} className={styles.cancelBtn}>
                  Cancel
                </button>
                <button type="submit" disabled={creating} className={styles.button}>
                  {creating ? 'Creating...' : 'Create Project'}
                </button>
              </div>
            </form>
          </>
        )}
      </div>

      {/* Projects List */}
      <div className={styles.sectionHeader}>
        <h2 className={styles.sectionTitle}>Your Projects</h2>
      </div>

      {projects.length === 0 ? (
        <div className={styles.empty}>
          No projects yet. Create one above to get started!
        </div>
      ) : (
        <div className={styles.grid}>
          {projects.map((p) => (
            <ProjectCard
              key={p.id}
              project={p}
              onDelete={() => handleDelete(p.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default Home;
