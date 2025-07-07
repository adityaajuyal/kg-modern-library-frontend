import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './components/auth/AuthContext';
import { ProtectedRoute } from './components/auth/ProtectedRoute';

// Public pages
import LandingPage from './pages/LandingPage';
import AdminLoginPage from './pages/auth/AdminLoginPage';

// Layouts
import UserLayout from './layouts/UserLayout';
import AdminLayout from './layouts/AdminLayout';

// User pages
import UserDashboard from './pages/user/UserDashboard';
import BooksPage from './pages/user/BooksPage';
import IssuesPage from './pages/user/IssuesPage';

// Admin pages
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminBooksPage from './pages/admin/AdminBooksPage';
import AdminIssuesPage from './pages/admin/AdminIssuesPage';
import AdminUsersPage from './pages/admin/AdminUsersPage';

// Error pages
import NotFoundPage from './pages/NotFoundPage';
import UnauthorizedPage from './pages/UnauthorizedPage';

const App: React.FC = () => {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/admin/login" element={<AdminLoginPage />} />

          {/* Public User routes - No login required */}
          <Route path="/books" element={<UserLayout />}>
            <Route index element={<BooksPage />} />
          </Route>
          
          <Route path="/issues" element={<UserLayout />}>
            <Route index element={<IssuesPage />} />
          </Route>

          <Route path="/dashboard" element={<UserLayout />}>
            <Route index element={<UserDashboard />} />
          </Route>

          {/* Admin routes - Login required */}
          <Route path="/admin/dashboard" element={
            <ProtectedRoute allowedRoles={['ADMIN']}>
              <AdminLayout />
            </ProtectedRoute>
          }>
            <Route index element={<AdminDashboard />} />
          </Route>
          
          <Route path="/admin/books" element={
            <ProtectedRoute allowedRoles={['ADMIN']}>
              <AdminLayout />
            </ProtectedRoute>
          }>
            <Route index element={<AdminBooksPage />} />
          </Route>
          
          <Route path="/admin/issues" element={
            <ProtectedRoute allowedRoles={['ADMIN']}>
              <AdminLayout />
            </ProtectedRoute>
          }>
            <Route index element={<AdminIssuesPage />} />
          </Route>
          
          <Route path="/admin/users" element={
            <ProtectedRoute allowedRoles={['ADMIN']}>
              <AdminLayout />
            </ProtectedRoute>
          }>
            <Route index element={<AdminUsersPage />} />
          </Route>

          {/* Error routes */}
          <Route path="/unauthorized" element={<UnauthorizedPage />} />
          <Route path="/404" element={<NotFoundPage />} />
          <Route path="*" element={<Navigate to="/404" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;
