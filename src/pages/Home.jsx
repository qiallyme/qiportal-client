import { Link } from 'react-router-dom'

function Home() {
  return (
    <div className="min-h-screen relative flex items-center justify-center p-4 overflow-hidden">
      {/* Premium gradient background with bokeh effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-blue-900 to-purple-900">
        {/* Animated bokeh lighting effects */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-20 w-96 h-96 bg-turquoise-500/10 rounded-full mix-blend-multiply filter blur-3xl animate-pulse"></div>
          <div className="absolute top-40 right-20 w-96 h-96 bg-magenta-500/10 rounded-full mix-blend-multiply filter blur-3xl animate-pulse" style={{animationDelay: '2s'}}></div>
          <div className="absolute -bottom-8 left-40 w-96 h-96 bg-electric-blue-500/10 rounded-full mix-blend-multiply filter blur-3xl animate-pulse" style={{animationDelay: '4s'}}></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-r from-turquoise-500/5 to-magenta-500/5 rounded-full mix-blend-multiply filter blur-3xl animate-pulse" style={{animationDelay: '1s'}}></div>
        </div>
      </div>

      {/* Main content */}
      <div className="relative z-10 w-full max-w-4xl">
        <div className="glass-card p-12 text-center">
          {/* QiSuite Logo and Branding */}
          <div className="mb-12">
            {/* Hummingbird Logo */}
            <div className="w-32 h-32 mx-auto mb-8 relative">
              <div className="w-full h-full bg-gradient-to-br from-turquoise-400 via-magenta-400 to-electric-blue-400 rounded-3xl flex items-center justify-center shadow-2xl glow">
                <svg className="w-20 h-20 text-white" viewBox="0 0 24 24" fill="currentColor">
                  {/* Hummingbird icon */}
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                </svg>
              </div>
              {/* Glowing ring effect */}
              <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-turquoise-400/20 via-magenta-400/20 to-electric-blue-400/20 blur-xl animate-pulse"></div>
            </div>
            
            {/* Brand Title */}
            <h1 className="text-6xl font-bold gradient-text mb-4 tracking-tight">
              QiSuite™
            </h1>
            <p className="text-xl text-gray-300 font-light mb-2">Enterprise Client Portal</p>
            <p className="text-gray-400 text-lg">Secure • Fast • Reliable</p>
          </div>

          {/* Feature highlights */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <div className="glass-card p-6 border border-turquoise-500/20">
              <div className="w-12 h-12 bg-turquoise-500/20 rounded-xl flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-turquoise-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Enterprise Security</h3>
              <p className="text-gray-400 text-sm">Bank-grade encryption and secure authentication</p>
            </div>
            
            <div className="glass-card p-6 border border-magenta-500/20">
              <div className="w-12 h-12 bg-magenta-500/20 rounded-xl flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-magenta-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Lightning Fast</h3>
              <p className="text-gray-400 text-sm">Optimized performance for seamless experience</p>
            </div>
            
            <div className="glass-card p-6 border border-electric-blue-500/20">
              <div className="w-12 h-12 bg-electric-blue-500/20 rounded-xl flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-electric-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Analytics Ready</h3>
              <p className="text-gray-400 text-sm">Comprehensive insights and reporting tools</p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Link 
                to="/login" 
                className="group relative overflow-hidden glass-button px-8 py-4 rounded-2xl shadow-2xl hover:shadow-3xl transform hover:scale-105 transition-all duration-500 border border-turquoise-500/30"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-turquoise-500/10 to-magenta-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="relative flex items-center justify-center">
                  <svg className="w-6 h-6 mr-3 text-turquoise-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  <span className="text-lg font-semibold text-white">Client Access</span>
                </div>
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-turquoise-400/20 to-magenta-400/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              </Link>

              <Link 
                to="/admin" 
                className="group relative overflow-hidden glass-button px-8 py-4 rounded-2xl shadow-2xl hover:shadow-3xl transform hover:scale-105 transition-all duration-500 border border-electric-blue-500/30"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-electric-blue-500/10 to-magenta-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="relative flex items-center justify-center">
                  <svg className="w-6 h-6 mr-3 text-electric-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                  <span className="text-lg font-semibold text-white">Admin Portal</span>
                </div>
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-electric-blue-400/20 to-magenta-400/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              </Link>
            </div>
          </div>

          {/* Trust indicators */}
          <div className="mt-12 pt-8 border-t border-white/10">
            <div className="flex items-center justify-center space-x-8 text-sm text-gray-400">
              <div className="flex items-center">
                <div className="w-2 h-2 bg-turquoise-400 rounded-full mr-2 animate-pulse"></div>
                <span className="font-medium">99.9% Uptime</span>
              </div>
              <div className="flex items-center">
                <div className="w-2 h-2 bg-magenta-400 rounded-full mr-2 animate-pulse" style={{animationDelay: '1s'}}></div>
                <span className="font-medium">SOC 2 Compliant</span>
              </div>
              <div className="flex items-center">
                <div className="w-2 h-2 bg-electric-blue-400 rounded-full mr-2 animate-pulse" style={{animationDelay: '2s'}}></div>
                <span className="font-medium">24/7 Support</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Home
  