// src/api/axiosClient.js
import axios from 'axios';

/**
 * ✅ Axios instance configured for our Django REST API
 *   - Base URL for all endpoints (no trailing slash!)
 *   - JSON headers
 *   - Automatic JWT access-token attachment
 *   - Automatic refresh when access token expires
 *
 * Note: Login endpoint uses `auth/token/` (SimpleJWT default).
 */

const axiosClient = axios.create({
  baseURL: process.env.REACT_APP_API_URL, // ⬅️ from .env file
  headers: { 'Content-Type': 'application/json' },
  withCredentials: false, // ➡️ Keep false for JWT-based auth
});

// 🔑 Request Interceptor: attach Authorization header if JWT access token exists
axiosClient.interceptors.request.use(
  (config) => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('access');
      if (token) config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// 🔁 Response Interceptor: refresh access token automatically on 401
axiosClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refresh = localStorage.getItem('refresh');
        if (!refresh) throw new Error('No refresh token found');

        // Ask backend for a new access token
        const res = await axios.post(
          `${process.env.REACT_APP_API_URL}/auth/token/refresh/`,
          { refresh }
        );

        const newAccess = res.data.access;
        localStorage.setItem('access', newAccess);

        // Update the failed request with the new token & retry it
        originalRequest.headers.Authorization = `Bearer ${newAccess}`;
        return axiosClient(originalRequest);
      } catch (refreshErr) {
        // 🔐 Refresh failed: clear tokens and redirect to login
        localStorage.removeItem('access');
        localStorage.removeItem('refresh');
        window.location.href = '/login';
      }
    }

    return Promise.reject(error);
  }
);

export default axiosClient;
