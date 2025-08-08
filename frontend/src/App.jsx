import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Toaster } from 'react-hot-toast'
import { useAuth } from './context/AuthContext'
import { useTheme } from './context/ThemeContext'

// Layout Components
import Layout from './components/layout/Layout'
import LoadingSpinner from './components/common/LoadingSpinner'

// Auth Pages
import Login from './pages/auth/Login'
import Register from './pages/auth/Register'

// Dashboard Pages
import Dashboard from './pages/dashboard/Dashboard'

// Complaint Pages
import ComplaintsList from './pages/complaints/ComplaintsList'
import ComplaintDetail from './pages/complaints/ComplaintDetail'
import CreateComplaint from './pages/complaints/CreateComplaint'

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard'
import UserManagement from './pages/admin/UserManagement'
import TeamManagement from './pages/admin/TeamManagement'
import SLAManagement from './pages/admin/SLAManagement'

// Protected Route Component
const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const { user, isLoading } = useAuth()
  
  if (isLoading) {
    return <LoadingSpinner />
  }
  
  if (!user) {
    return <Navigate to="/login" replace />
  }
  
  if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    return <Navigate to="/dashboard" replace />
  }
  
  return children
}

// Public Route Component (redirect to dashboard if logged in)
const PublicRoute = ({ children }) => {
  const { user, isLoading } = useAuth()
  
  if (isLoading) {
    return <LoadingSpinner />
  }
  
  if (user) {
    return <Navigate to="/dashboard" replace />
  }
  
  return children
}

function App() {
  const { isDark } = useTheme()
  
  return (
    <div className={isDark ? 'dark' : ''}>
      <Router>
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
          <AnimatePresence mode="wait">
            <Routes>
              {/* Public Routes */}
              <Route path="/login" element={
                <PublicRoute>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Login />
                  </motion.div>
                </PublicRoute>
              } />
              <Route path="/register" element={
                <PublicRoute>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Register />
                  </motion.div>
                </PublicRoute>
              } />
              
              {/* Protected Routes */}
              <Route path="/" element={
                <ProtectedRoute>
                  <Layout />
                </ProtectedRoute>
              }>
                {/* Dashboard */}
                <Route index element={<Navigate to="/dashboard" replace />} />
                <Route path="dashboard" element={<Dashboard />} />
                
                {/* Complaints */}
                <Route path="complaints" element={<ComplaintsList />} />
                <Route path="complaints/:id" element={<ComplaintDetail />} />
                <Route path="complaints/create" element={<CreateComplaint />} />
                
                {/* Admin Routes */}
                <Route path="admin" element={
                  <ProtectedRoute allowedRoles={['admin']}>
                    <AdminDashboard />
                  </ProtectedRoute>
                } />
                <Route path="admin/users" element={
                  <ProtectedRoute allowedRoles={['admin']}>
                    <UserManagement />
                  </ProtectedRoute>
                } />
                <Route path="admin/teams" element={
                  <ProtectedRoute allowedRoles={['admin']}>
                    <TeamManagement />
                  </ProtectedRoute>
                } />
                <Route path="admin/sla" element={
                  <ProtectedRoute allowedRoles={['admin']}>
                    <SLAManagement />
                  </ProtectedRoute>
                } />
              </Route>
              
              {/* Catch all route */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </AnimatePresence>
          
          {/* Toast notifications */}
          <Toaster
            position="top-right"
            toastOptions={{
              className: 'glass-card',
              duration: 4000,
              style: {
                background: isDark ? 'rgba(31, 41, 55, 0.9)' : 'rgba(255, 255, 255, 0.9)',
                color: isDark ? '#F9FAFB' : '#111827',
                border: `1px solid ${isDark ? 'rgba(75, 85, 99, 0.5)' : 'rgba(229, 231, 235, 0.5)'}`,
              },
            }}
          />
        </div>
      </Router>
    </div>
  )
}

export default App