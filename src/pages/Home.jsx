import { useUser } from '../context/UserContext'
import { Link, Navigate } from 'react-router-dom'

function Home() {
  const { email, role } = useUser()

  // If user is authenticated, redirect to appropriate dashboard
  if (email) {
    if (role === 'admin') {
      return <Navigate to="/admin" replace />
    } else if (role === 'client') {
      return <Navigate to="/dashboard" replace />
    }
  }

  return (
    <div className="min-h-screen relative flex items-center justify-center p-4">
      {/* Subtle animated background */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-96 h-96 bg-purple-500/5 rounded-full mix-blend-multiply filter blur-3xl animate-pulse"></div>
        <div className="absolute top-40 right-20 w-96 h-96 bg-pink-500/5 rounded-full mix-blend-multiply filter blur-3xl animate-pulse" style={{animationDelay: '2s'}}></div>
        <div className="absolute -bottom-8 left-40 w-96 h-96 bg-blue-500/5 rounded-full mix-blend-multiply filter blur-3xl animate-pulse" style={{animationDelay: '4s'}}></div>
      </div>

      {/* Main centered card */}
      <div className="relative z-10 w-full max-w-md">
        <div className="glass-card p-8 text-center">
          {/* QiAlly Logo */}
          <div className="mb-8">
            <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
              <span className="text-white font-bold text-2xl">Q</span>
            </div>
            <h1 className="text-3xl font-bold gradient-text mb-2">Welcome to QiAlly</h1>
            <p className="text-gray-400 text-sm">Your secure client portal with enterprise-grade authentication</p>
          </div>

          {/* Action Buttons */}
          <div className="space-y-4">
            <Link 
              to="/login" 
              className="block w-full px-6 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 glass-button"
            >
              <div className="flex items-center justify-center">
                <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                Client Portal
              </div>
            </Link>

            <Link 
              to="/login" 
              className="block w-full px-6 py-4 bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 glass-button"
            >
              <div className="flex items-center justify-center">
                <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
                Admin Login
              </div>
            </Link>
          </div>

          {/* Security badges */}
          <div className="mt-8 pt-6 border-t border-white/10">
            <div className="flex items-center justify-center space-x-6 text-xs text-gray-500">
              <div className="flex items-center">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                Secure
              </div>
              <div className="flex items-center">
                <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
                Fast
              </div>
              <div className="flex items-center">
                <div className="w-2 h-2 bg-purple-500 rounded-full mr-2"></div>
                Reliable
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Home
  