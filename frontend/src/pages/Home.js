// src/pages/Home.js
import React, { useEffect, useState } from 'react';
import axiosClient from '../api/axiosClient';
import StatsCard from '../components/StatsCard';
import IssueStatusChart from '../components/IssueStatusChart';
import ProjectActivityChart from '../components/ProjectActivityChart';
import ProjectCard from '../components/ProjectCard';
import LoadingSpinner from '../components/LoadingSpinner';
import styles from './Home.module.css';

function Home() {
  const [projects, setProjects] = useState([]);
  const [users, setUsers] = useState([]);
  const [stats, setStats] = useState({
    totalProjects: 0,
    activeIssues: 0,
    teamMembers: 0,
    recentActivity: 0,
  });
  const [issueStats, setIssueStats] = useState({
    open: 0,
    in_progress: 0,
    closed: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);

  // Form states
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [fundsAllocated, setFundsAllocated] = useState('');
  const [selectedMembers, setSelectedMembers] = useState([]);
  const [creating, setCreating] = useState(false);

  // ✅ Load all data on mount
  useEffect(() => {
    fetchDashboardData();
  }, []);

  // ---- Fetch all dashboard data ----
  const fetchDashboardData = async () => {
    setError(null);
    setLoading(true);
    try {
      const [projectsRes, issuesRes, usersRes, notificationsRes] = await Promise.all([
        axiosClient.get('projects/'),
        axiosClient.get('issues/'),
        axiosClient.get('users/'),
        axiosClient.get('notifications/').catch(() => ({ data: [] })),
      ]);

      const projectsData = projectsRes.data.results || projectsRes.data;
      const issuesData = issuesRes.data.results || issuesRes.data;
      const usersData = usersRes.data.results || usersRes.data;
      const notificationsData = notificationsRes.data.results || notificationsRes.data;

      setProjects(projectsData);
      setUsers(usersData);

      // Calculate stats
      const openIssues = issuesData.filter(i => i.status !== 'closed').length;
      const issuesByStatus = {
        open: issuesData.filter(i => i.status === 'open').length,
        in_progress: issuesData.filter(i => i.status === 'in_progress').length,
        closed: issuesData.filter(i => i.status === 'closed').length,
      };

      setStats({
        totalProjects: projectsData.length,
        activeIssues: openIssues,
        teamMembers: usersData.length,
        recentActivity: notificationsData.filter(n => !n.is_read).length,
      });
      setIssueStats(issuesByStatus);
    } catch (err) {
      setError('Failed to load dashboard data');
      console.error(err);
    } finally {
      setLoading(false);
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
      setIsFormOpen(false);
      fetchDashboardData(); // refresh all data
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
      fetchDashboardData();
    } catch {
      setError('Failed to delete project');
    }
  };

  // Generate weekly activity data (mock for now)
  const weeklyActivityData = [
    { name: 'Mon', issues: Math.floor(Math.random() * 10), comments: Math.floor(Math.random() * 15) },
    { name: 'Tue', issues: Math.floor(Math.random() * 10), comments: Math.floor(Math.random() * 15) },
    { name: 'Wed', issues: Math.floor(Math.random() * 10), comments: Math.floor(Math.random() * 15) },
    { name: 'Thu', issues: Math.floor(Math.random() * 10), comments: Math.floor(Math.random() * 15) },
    { name: 'Fri', issues: Math.floor(Math.random() * 10), comments: Math.floor(Math.random() * 15) },
    { name: 'Sat', issues: Math.floor(Math.random() * 5), comments: Math.floor(Math.random() * 8) },
    { name: 'Sun', issues: Math.floor(Math.random() * 5), comments: Math.floor(Math.random() * 8) },
  ];

  if (loading) return <LoadingSpinner />;

  return (
    <div className={`${styles.container} gradient-bg`}>
      {/* Hero Section */}
      <div className={styles.hero}>
        <h1 className={styles.heroTitle}>Welcome Back! 👋</h1>
        <p className={styles.heroSubtitle}>
          Track your projects, manage issues, and collaborate seamlessly
        </p>
      </div>

      {error && <div className={styles.error}>{error}</div>}

      {/* Stats Cards Grid */}
      <div className="stats-grid">
        <StatsCard
          title="Total Projects"
          value={stats.totalProjects}
          icon="📊"
          trend={12}
          color="primary"
          subtitle="Active this month"
        />
        <StatsCard
          title="Active Issues"
          value={stats.activeIssues}
          icon="🐛"
          trend={-5}
          color="warning"
          subtitle="Needs attention"
        />
        <StatsCard
          title="Team Members"
          value={stats.teamMembers}
          icon="👥"
          trend={8}
          color="success"
          subtitle="Collaborating"
        />
        <StatsCard
          title="Notifications"
          value={stats.recentActivity}
          icon="🔔"
          color="info"
          subtitle="Unread updates"
        />
      </div>

      {/* Charts Grid */}
      <div className="chart-grid" style={{ marginBottom: '2rem' }}>
        <IssueStatusChart data={issueStats} />
        <ProjectActivityChart data={weeklyActivityData} />
      </div>

      {/* Quick Create Section */}
      <div className={`${styles.createSection} glass`}>
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
        <div className={`${styles.empty} glass-light`}>
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
