// src/components/CreateChatModal.js
import React, { useState, useEffect } from 'react';
import axiosClient from '../api/axiosClient';
import styles from './CreateChatModal.module.css';

export default function CreateChatModal({ onClose, onCreated }) {
    const [name, setName] = useState('');
    const [roomType, setRoomType] = useState('project'); // project, group, direct
    const [projects, setProjects] = useState([]);
    const [selectedProject, setSelectedProject] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (roomType === 'project') {
            fetchProjects();
        }
    }, [roomType]);

    const fetchProjects = async () => {
        try {
            const res = await axiosClient.get('/projects/');
            setProjects(res.data.results || res.data);
        } catch (err) {
            console.error('Failed to load projects', err);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!name.trim()) return;

        setLoading(true);
        setError(null);

        try {
            const payload = {
                name,
                room_type: roomType,
            };

            if (roomType === 'project' && selectedProject) {
                payload.project = selectedProject;
            }

            const res = await axiosClient.post('/chat-rooms/', payload);
            onCreated(res.data);
            onClose();
        } catch (err) {
            console.error(err);
            setError('Failed to create chat room');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={styles.overlay}>
            <div className={styles.modal}>
                <div className={styles.header}>
                    <h2 className={styles.title}>Start New Chat</h2>
                    <button onClick={onClose} className={styles.closeButton}>×</button>
                </div>

                {error && <div className={styles.error}>{error}</div>}

                <form onSubmit={handleSubmit} className={styles.form}>
                    <div className={styles.field}>
                        <label className={styles.label}>Chat Name</label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="e.g. Project Discussion"
                            required
                            className={styles.input}
                        />
                    </div>

                    <div className={styles.field}>
                        <label className={styles.label}>Type</label>
                        <select
                            value={roomType}
                            onChange={(e) => setRoomType(e.target.value)}
                            className={styles.select}
                        >
                            <option value="project">Project Room</option>
                            <option value="group">Group Chat</option>
                            {/* Direct messages would require user selection logic */}
                        </select>
                    </div>

                    {roomType === 'project' && (
                        <div className={styles.field}>
                            <label className={styles.label}>Link to Project (Optional)</label>
                            <select
                                value={selectedProject}
                                onChange={(e) => setSelectedProject(e.target.value)}
                                className={styles.select}
                            >
                                <option value="">Select a project...</option>
                                {projects.map((p) => (
                                    <option key={p.id} value={p.id}>
                                        {p.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                    )}

                    <div className={styles.actions}>
                        <button type="button" onClick={onClose} className={styles.cancelButton}>
                            Cancel
                        </button>
                        <button type="submit" disabled={loading} className={styles.submitButton}>
                            {loading ? 'Creating...' : 'Create Chat'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
