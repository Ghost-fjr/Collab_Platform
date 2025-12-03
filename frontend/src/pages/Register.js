// src/pages/Register.js
// -----------------------------------------------------------------------------
// User Registration Page
// - Allows new users to create an account
// - Integrates with backend /api/auth/register/ endpoint
// - Uses AuthContext and ToastContext
// - Styled with modern design system
// -----------------------------------------------------------------------------
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import styles from './Register.module.css';

export default function Register() {
    const navigate = useNavigate();
    const { login } = useAuth();
    const { showToast } = useToast();

    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        password2: '',
        first_name: '',
        last_name: '',
    });
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);

    // ---------------------------------------------------------------------------
    // Handle input changes
    // ---------------------------------------------------------------------------
    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
        // Clear error for this field
        if (errors[e.target.name]) {
            setErrors({ ...errors, [e.target.name]: null });
        }
    };

    // ---------------------------------------------------------------------------
    // Validate form
    // ---------------------------------------------------------------------------
    const validate = () => {
        const newErrors = {};

        if (!formData.username) newErrors.username = 'Username is required';
        if (!formData.email) newErrors.email = 'Email is required';
        if (!formData.password) newErrors.password = 'Password is required';
        if (formData.password.length < 8) {
            newErrors.password = 'Password must be at least 8 characters';
        }
        if (formData.password !== formData.password2) {
            newErrors.password2 = 'Passwords do not match';
        }

        return newErrors;
    };

    // ---------------------------------------------------------------------------
    // Handle form submission
    // ---------------------------------------------------------------------------
    const handleSubmit = async (e) => {
        e.preventDefault();

        const validationErrors = validate();
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        setLoading(true);
        setErrors({});

        try {
            // Register user
            await axios.post(`${process.env.REACT_APP_API_URL}/auth/register/`, {
                username: formData.username,
                email: formData.email,
                password: formData.password,
                first_name: formData.first_name,
                last_name: formData.last_name,
            });

            // Auto-login after registration
            const loginRes = await axios.post(`${process.env.REACT_APP_API_URL}/auth/token/`, {
                username: formData.username,
                password: formData.password,
            });

            login(loginRes.data.access, loginRes.data.refresh);
            showToast('✅ Account created successfully!', 'success');
            navigate('/');
        } catch (err) {
            console.error(err);
            if (err.response?.data) {
                setErrors(err.response.data);
            } else {
                setErrors({ general: 'Registration failed. Please try again.' });
            }
            showToast('❌ Registration failed', 'error');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.card}>
                <h1 className={styles.title}>Create Account</h1>
                <p className={styles.subtitle}>Join the collaboration platform</p>

                {errors.general && <p className={styles.error}>{errors.general}</p>}

                <form onSubmit={handleSubmit} className={styles.form}>
                    {/* Username */}
                    <div className={styles.field}>
                        <label htmlFor="username" className={styles.label}>
                            Username *
                        </label>
                        <input
                            id="username"
                            name="username"
                            type="text"
                            value={formData.username}
                            onChange={handleChange}
                            className={styles.input}
                            autoComplete="username"
                        />
                        {errors.username && <span className={styles.fieldError}>{errors.username}</span>}
                    </div>

                    {/* Email */}
                    <div className={styles.field}>
                        <label htmlFor="email" className={styles.label}>
                            Email *
                        </label>
                        <input
                            id="email"
                            name="email"
                            type="email"
                            value={formData.email}
                            onChange={handleChange}
                            className={styles.input}
                            autoComplete="email"
                        />
                        {errors.email && <span className={styles.fieldError}>{errors.email}</span>}
                    </div>

                    {/* First Name */}
                    <div className={styles.field}>
                        <label htmlFor="first_name" className={styles.label}>
                            First Name
                        </label>
                        <input
                            id="first_name"
                            name="first_name"
                            type="text"
                            value={formData.first_name}
                            onChange={handleChange}
                            className={styles.input}
                            autoComplete="given-name"
                        />
                    </div>

                    {/* Last Name */}
                    <div className={styles.field}>
                        <label htmlFor="last_name" className={styles.label}>
                            Last Name
                        </label>
                        <input
                            id="last_name"
                            name="last_name"
                            type="text"
                            value={formData.last_name}
                            onChange={handleChange}
                            className={styles.input}
                            autoComplete="family-name"
                        />
                    </div>

                    {/* Password */}
                    <div className={styles.field}>
                        <label htmlFor="password" className={styles.label}>
                            Password *
                        </label>
                        <input
                            id="password"
                            name="password"
                            type="password"
                            value={formData.password}
                            onChange={handleChange}
                            className={styles.input}
                            autoComplete="new-password"
                        />
                        {errors.password && <span className={styles.fieldError}>{errors.password}</span>}
                    </div>

                    {/* Confirm Password */}
                    <div className={styles.field}>
                        <label htmlFor="password2" className={styles.label}>
                            Confirm Password *
                        </label>
                        <input
                            id="password2"
                            name="password2"
                            type="password"
                            value={formData.password2}
                            onChange={handleChange}
                            className={styles.input}
                            autoComplete="new-password"
                        />
                        {errors.password2 && <span className={styles.fieldError}>{errors.password2}</span>}
                    </div>

                    {/* Submit Button */}
                    <button type="submit" disabled={loading} className={styles.button}>
                        {loading ? (
                            <>
                                <span className="spinner" />
                                Creating account…
                            </>
                        ) : (
                            'Create Account'
                        )}
                    </button>
                </form>

                <p className={styles.footer}>
                    Already have an account?{' '}
                    <Link to="/login" className={styles.link}>
                        Log in
                    </Link>
                </p>
            </div>
        </div>
    );
}
