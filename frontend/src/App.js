import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';

// Pages
import Home from './pages/Home';
import About from './pages/About';
import Contact from './pages/Contact';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import UploadResume from './pages/UploadResume';
import ATSResult from './pages/ATSResult';
import JobMatch from './pages/JobMatch';
import History from './pages/History';
import Profile from './pages/Profile';
import AdminDashboard from './pages/AdminDashboard';
import NotFound from './pages/NotFound';

// Components
import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer';
import LoadingSpinner from './components/common/LoadingSpinner';

const ProtectedRoute = ({ children, adminOnly = false }) => {
  const { user, loading } = useAuth();

  if (loading) return <LoadingSpinner fullScreen />;
  if (!user) return <Navigate to="/login" replace />;
  if (adminOnly && user.role !== 'admin') return <Navigate to="/dashboard" replace />;

  return children;
};

const PublicRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) return <LoadingSpinner fullScreen />;
  if (user) return <Navigate to="/dashboard" replace />;

  return children;
};

const AppLayout = ({ children, hideFooter = false }) => (
  <div className="min-h-screen flex flex-col">
    <Navbar />
    <main className="flex-1">{children}</main>
    {!hideFooter && <Footer />}
  </div>
);

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<AppLayout><Home /></AppLayout>} />
      <Route path="/about" element={<AppLayout><About /></AppLayout>} />
      <Route path="/contact" element={<AppLayout><Contact /></AppLayout>} />
      <Route
        path="/login"
        element={
          <PublicRoute>
            <AppLayout hideFooter>
              <Login />
            </AppLayout>
          </PublicRoute>
        }
      />
      <Route
        path="/register"
        element={
          <PublicRoute>
            <AppLayout hideFooter>
              <Register />
            </AppLayout>
          </PublicRoute>
        }
      />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <AppLayout hideFooter>
              <Dashboard />
            </AppLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/upload"
        element={
          <ProtectedRoute>
            <AppLayout hideFooter>
              <UploadResume />
            </AppLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/results/:id"
        element={
          <ProtectedRoute>
            <AppLayout hideFooter>
              <ATSResult />
            </AppLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/job-match/:id"
        element={
          <ProtectedRoute>
            <AppLayout hideFooter>
              <JobMatch />
            </AppLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/history"
        element={
          <ProtectedRoute>
            <AppLayout hideFooter>
              <History />
            </AppLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <AppLayout hideFooter>
              <Profile />
            </AppLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin"
        element={
          <ProtectedRoute adminOnly>
            <AppLayout hideFooter>
              <AdminDashboard />
            </AppLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="*"
        element={
          <AppLayout>
            <NotFound />
          </AppLayout>
        }
      />
    </Routes>
  );
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppRoutes />
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              borderRadius: '12px',
              fontFamily: 'Inter, sans-serif',
              fontSize: '14px',
            },
            success: {
              iconTheme: {
                primary: '#2563eb',
                secondary: '#ffffff',
              },
            },
          }}
        />
      </Router>
    </AuthProvider>
  );
}

export default App;
