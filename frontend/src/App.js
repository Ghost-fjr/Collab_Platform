// src/App.js
// -----------------------------------------------------------------------------
// Root application component
// - Centralizes all routes for the Collaboration Platform
// - Wraps everything in <ToastProvider> for global notifications
// - Uses <Layout> to keep Navbar consistent across pages
// - Protects private routes with <ProtectedRoute>
// -----------------------------------------------------------------------------

import React from 'react';
import { BrowserRouter as Router, Routes, Route, Outlet } from 'react-router-dom';
import { ToastProvider } from './context/ToastContext';

// ✅ Shared UI
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';

// ✅ Pages
import Home from './pages/Home';
import Projects from './pages/Projects';
import ProjectDetail from './pages/ProjectDetail';
import Issues from './pages/Issues';
import IssueDetail from './pages/IssueDetail';
import IssueForm from './pages/IssueForm';
import Users from './pages/Users';
import UserDetail from './pages/UserDetail';
import Chats from './pages/Chats';
import Notifications from './pages/Notifications';
import Login from './pages/Login';
import Register from './pages/Register';

// ✅ Main Layout with Navbar
function MainLayout() {
  return (
    <>
      <Navbar />
      <main style={{ padding: '1rem' }}>
        <Outlet />
      </main>
    </>
  );
}

function App() {
  return (
    <ToastProvider>
      <Router>
        <Routes>
          {/* ----------------- Public Routes (Standalone) ----------------- */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* ----------------- Protected Routes (with Navbar) ----------------- */}
          <Route element={<MainLayout />}>
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <Home />
                </ProtectedRoute>
              }
            />

            {/* Projects */}
            <Route
              path="/projects"
              element={
                <ProtectedRoute>
                  <Projects />
                </ProtectedRoute>
              }
            />
            <Route
              path="/projects/:id"
              element={
                <ProtectedRoute>
                  <ProjectDetail />
                </ProtectedRoute>
              }
            />

            {/* Issues */}
            <Route
              path="/issues"
              element={
                <ProtectedRoute>
                  <Issues />
                </ProtectedRoute>
              }
            />
            <Route
              path="/issues/new"
              element={
                <ProtectedRoute>
                  <IssueForm />
                </ProtectedRoute>
              }
            />
            <Route
              path="/issues/:id"
              element={
                <ProtectedRoute>
                  <IssueDetail />
                </ProtectedRoute>
              }
            />
            <Route
              path="/issues/:id/edit"
              element={
                <ProtectedRoute>
                  <IssueForm isEdit />
                </ProtectedRoute>
              }
            />

            {/* Users */}
            <Route
              path="/users"
              element={
                <ProtectedRoute>
                  <Users />
                </ProtectedRoute>
              }
            />
            <Route
              path="/users/:id"
              element={
                <ProtectedRoute>
                  <UserDetail />
                </ProtectedRoute>
              }
            />

            {/* Other features */}
            <Route
              path="/chats"
              element={
                <ProtectedRoute>
                  <Chats />
                </ProtectedRoute>
              }
            />
            <Route
              path="/notifications"
              element={
                <ProtectedRoute>
                  <Notifications />
                </ProtectedRoute>
              }
            />
          </Route>
        </Routes>
      </Router>
    </ToastProvider>
  );
}

export default App;
