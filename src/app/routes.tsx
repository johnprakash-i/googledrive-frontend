import { lazy } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'

// Lazy load pages
const Login = lazy(() => import('@/features/auth/pages/Login'))
const Register = lazy(() => import('@/features/auth/pages/Register'))
const ForgotPassword = lazy(() => import('@/features/auth/pages/ForgotPassword'))
const ResetPassword = lazy(() => import('@/features/auth/pages/ResetPassword'))
const ActivateAccount = lazy(() => import('@/features/auth/pages/ActivateAccount'))
const Dashboard = lazy(() => import('@/features/drive/pages/Dashboard'))
const Recent = lazy(() => import('@/features/drive/pages/Recent'))
const Starred = lazy(() => import('@/features/drive/pages/Starred'))
const Shared = lazy(() => import('@/features/drive/pages/Shared'))
const Trash = lazy(() => import('@/features/drive/pages/Trash'))


// Protected Route Wrapper
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth()

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  return <>{children}</>
}

function AppRoutes() {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password/:token" element={<ResetPassword />} />
      <Route path="/activate/:token" element={<ActivateAccount />} />
      
      {/* Protected routes */}
      <Route path="/" element={
        <ProtectedRoute>
          <Dashboard />
        </ProtectedRoute>
      } />
      
      <Route path="/recent" element={
        <ProtectedRoute>
          <Recent />
        </ProtectedRoute>
      } />
      
      <Route path="/starred" element={
        <ProtectedRoute>
          <Starred />
        </ProtectedRoute>
      } />
      
      <Route path="/shared" element={
        <ProtectedRoute>
          <Shared />
        </ProtectedRoute>
      } />
      
      <Route path="/trash" element={
        <ProtectedRoute>
          <Trash />
        </ProtectedRoute>
      } />
      

      
      {/* Catch all */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default AppRoutes