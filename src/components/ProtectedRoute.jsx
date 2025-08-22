import { Navigate } from 'react-router-dom'
import { useUser } from '../context/UserContext'
import { getUserEmailFromJWT } from '../utils/auth'

export const ProtectedRoute = ({ roleRequired, children }) => {
  const { email, role } = useUser()
  
  // Check if CF_Authorization cookie exists
  const hasAuthCookie = getUserEmailFromJWT() !== null

  // If no auth cookie, redirect to Cloudflare login
  if (!hasAuthCookie) {
    window.location.href = 'https://portal.qially.me/cdn-cgi/access/login'
    return null
  }

  // If user is not loaded yet, show loading
  if (!email) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="glass-card p-8 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500 mx-auto mb-4"></div>
          <p className="text-gray-400">Loading...</p>
        </div>
      </div>
    )
  }

  // If role doesn't match, redirect to home
  if (roleRequired && role !== roleRequired) {
    return <Navigate to="/" replace />
  }

  return children
}

export default ProtectedRoute
