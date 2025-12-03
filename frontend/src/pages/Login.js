// src/pages/Login.js
// -----------------------------------------------------------------------------
// JWT login page
//   - Uses AuthContext to store tokens and trigger global auth state updates.
//   - Uses ToastContext to display success/error notifications.
//   - Redirects to the home page after a successful login.
//   - Styled with Login.module.css
// -----------------------------------------------------------------------------
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import styles from './Login.module.css';

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const { showToast } = useToast();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  // ---------------------------------------------------------------------------
  // Handle form submission
  // ---------------------------------------------------------------------------
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await axios.post(`${process.env.REACT_APP_API_URL}/auth/token/`, {
        username,
        password,
      });

      login(res.data.access, res.data.refresh);
      showToast('✅ Login successful!', 'success');
      navigate('/');
    } catch (err) {
      console.error(err);
      setError('Invalid username or password.');
      showToast('❌ Login failed. Check your credentials.', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Login</h1>

      {/* Inline error fallback */}
      {error && <p className={styles.error}>{error}</p>}

      <form onSubmit={handleSubmit} className={styles.form}>
        {/* Username */}
        <div className={styles.field}>
          <label htmlFor="username" className={styles.label}>
            Username
          </label>
          <input
            id="username"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            className={styles.input}
          />
        </div>

        {/* Password */}
        <div className={styles.field}>
          <label htmlFor="password" className={styles.label}>
            Password
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className={styles.input}
          />
        </div>

        {/* Submit button */}
        <button
          type="submit"
          disabled={loading}
          className={styles.button}
        >
          {loading ? (
            <span>
              <span
                style={{
                  display: 'inline-block',
                  width: '14px',
                  height: '14px',
                  border: '2px solid #fff',
                  borderTop: '2px solid transparent',
                  borderRadius: '50%',
                  marginRight: '8px',
                  verticalAlign: 'middle',
                  animation: 'spin 0.6s linear infinite',
                }}
              />
              Logging in…
            </span>
          ) : (
            'Log In'
          )}
        </button>
      </form>

      <p className={styles.footer}>
        Don't have an account?{' '}
        <Link to="/register" className={styles.link}>
          Sign up
        </Link>
      </p>
    </div>
  );
}
