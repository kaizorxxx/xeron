import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthLayout } from '@/src/components/layout/auth-layout';
import { DashboardLayout } from '@/src/components/layout/dashboard-layout';
import { ProtectedRoute } from '@/src/components/auth/protected-route';
import Login from '@/src/pages/login';
import Register from '@/src/pages/register';
import Dashboard from '@/src/pages/dashboard';
import AdminDashboard from '@/src/pages/admin';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Route>

        {/* Protected Routes */}
        <Route element={<ProtectedRoute />}>
          <Route element={<DashboardLayout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/admin-intelligence" element={<AdminDashboard />} />
            {/* Redirect root to dashboard */}
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            {/* Fallback for other sidebar links to dashboard for now */}
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
