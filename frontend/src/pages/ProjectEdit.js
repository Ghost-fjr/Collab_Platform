// src/pages/ProjectEdit.js
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axiosClient from '../api/axiosClient';

function ProjectEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState(null);

  useEffect(() => {
    axiosClient
      .get(`projects/${id}/`)
      .then((res) => {
        setName(res.data.name);
        setDescription(res.data.description);
      })
      .catch(() => setError('Failed to load project'));
  }, [id]);

  const handleUpdate = (e) => {
    e.preventDefault();
    axiosClient
      .put(`projects/${id}/`, { name, description })
      .then(() => navigate('/'))
      .catch(() => setError('Failed to update project'));
  };

  if (error) return <p style={{ color: 'red' }}>{error}</p>;

  return (
    <div>
      <h1>Edit Project</h1>
      <form onSubmit={handleUpdate}>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />
        <button type="submit">Save</button>
      </form>
    </div>
  );
}

export default ProjectEdit;
