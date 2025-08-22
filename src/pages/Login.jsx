// src/pages/Login.jsx
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useUser } from '../context/UserContext'

const Login = () => {
  const { role } = useUser()
  const navigate = useNavigate()

  useEffect(() => {
    if (role === 'admin') {
      navigate('/admin')
    } else if (role === 'client') {
      navigate('/dashboard')
    } else {
      // Maybe show unauthorized message or retry logic
    }
  }, [role, navigate])

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-72 h-72 bg-blue-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
        <div className="absolute top-40 right-20 w-72 h-72 bg-purple-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-40 w-72 h-72 bg-pink-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      {/* Main content */}
      <div className="relative z-10 flex items-center justify-center min-h-screen px-4">
        <div className="w-full max-w-md">
          {/* Logo placeholder */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-white/20 backdrop-blur-sm rounded-2xl border border-white/30 shadow-xl mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-xl">Q</span>
              </div>
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
              QiAlly
            </h1>
            <p className="text-gray-600 font-medium">Client Portal</p>
          </div>

          {/* Glassmorphism card */}
          <div className="bg-white/20 backdrop-blur-lg rounded-3xl border border-white/30 shadow-2xl p-8">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-800 mb-3">
                Welcome Back
              </h2>
              <p className="text-gray-600 mb-8 leading-relaxed">
                Access your secure client portal with enterprise-grade authentication powered by Cloudflare Access.
              </p>
              
              {/* Authentication button */}
              <a
                href="https://<your-team-name>.cloudflareaccess.com/cdn-cgi/access/login/portal.qially.me"
                className="inline-flex items-center justify-center w-full px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-2xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 group"
              >
                <svg 
                  className="w-5 h-5 mr-3 group-hover:rotate-12 transition-transform duration-300" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" 
                  />
                </svg>
                Sign In with Cloudflare Access
              </a>
              
              <p className="text-sm text-gray-500 mt-6">
                Secure • Fast • Reliable
              </p>
            </div>
          </div>

          {/* Footer */}
          <div className="text-center mt-8">
            <p className="text-gray-500 text-sm">
              Protected by enterprise security standards
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login
