import { useUser } from '../context/UserContext'
import { Link } from 'react-router-dom'

function Home() {
  const { email, role } = useUser()

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-72 h-72 bg-purple-500/20 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob"></div>
        <div className="absolute top-40 right-20 w-72 h-72 bg-pink-500/20 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-40 w-72 h-72 bg-blue-500/20 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-4000"></div>
      </div>

      {/* Main content */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 py-12">
        {/* Hero section */}
        <div className="text-center mb-16">
          <h1 className="text-6xl font-bold gradient-text mb-6">
            Welcome to QiAlly
          </h1>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Your secure client portal with enterprise-grade authentication and modern design
          </p>
          
          {email ? (
            <div className="space-y-4">
              <div className="glass-card p-6 max-w-md mx-auto">
                <p className="text-gray-400 mb-2">Welcome back,</p>
                <p className="text-xl font-semibold text-white mb-4">{email}</p>
                <div className="flex justify-center space-x-4">
                  {role === 'admin' && (
                    <Link to="/admin" className="glass-button px-6 py-3 rounded-xl font-medium glow-hover">
                      Admin Panel
                    </Link>
                  )}
                  {role === 'client' && (
                    <Link to="/dashboard" className="glass-button px-6 py-3 rounded-xl font-medium glow-hover">
                      Dashboard
                    </Link>
                  )}
                  <Link to="/login" className="glass-button px-6 py-3 rounded-xl font-medium glow-hover">
                    Profile
                  </Link>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <Link 
                to="/login" 
                className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-2xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 glow-hover"
              >
                <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                </svg>
                Get Started
              </Link>
            </div>
          )}
        </div>

        {/* Features grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <div className="glass-card p-8 text-center group hover:transform hover:scale-105 transition-all duration-300">
            <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:glow-hover">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-white mb-4">Secure Access</h3>
            <p className="text-gray-400">Enterprise-grade authentication powered by Cloudflare Access</p>
          </div>

          <div className="glass-card p-8 text-center group hover:transform hover:scale-105 transition-all duration-300">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:glow-hover">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-white mb-4">Lightning Fast</h3>
            <p className="text-gray-400">Built with modern technologies for optimal performance</p>
          </div>

          <div className="glass-card p-8 text-center group hover:transform hover:scale-105 transition-all duration-300">
            <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:glow-hover">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-white mb-4">Trusted Platform</h3>
            <p className="text-gray-400">Reliable infrastructure backed by industry standards</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Home
  