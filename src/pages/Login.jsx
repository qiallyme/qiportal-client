// src/pages/Login.jsx
import { useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../context/UserContext';

export default function Login() {
  const { email } = useContext(UserContext);
  const navigate = useNavigate();

  useEffect(() => {
    // Only redirect if we're sure there's no user (after a brief delay to allow context to load)
    const timer = setTimeout(() => {
      if (!email) {
        navigate('/');
      }
    }, 1000);

    return () => clearTimeout(timer);
  }, [email, navigate]);

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-72 h-72 bg-purple-500/20 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob"></div>
        <div className="absolute top-40 right-20 w-72 h-72 bg-pink-500/20 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-40 w-72 h-72 bg-blue-500/20 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-4000"></div>
      </div>

      {/* Main content */}
      <div className="relative z-10 flex items-center justify-center min-h-screen p-4">
        <div className="glass-card p-8 max-w-md w-full text-center">
          {/* Logo */}
          <div className="mb-8">
            <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-4 glow">
              <span className="text-white font-bold text-2xl">Q</span>
            </div>
            <h1 className="text-3xl font-bold gradient-text mb-2">Welcome</h1>
            <p className="text-gray-400">QiAlly Client Portal</p>
          </div>
          
          {email ? (
            <div className="space-y-6">
              <div className="glass p-6 rounded-xl">
                <p className="text-sm text-gray-400 mb-2">Logged in as:</p>
                <p className="text-lg font-semibold text-white mb-4">{email}</p>
                <div className="w-full h-2 bg-gray-700 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full animate-pulse"></div>
                </div>
              </div>
              
              <button className="w-full px-6 py-3 bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white font-semibold rounded-xl transition-all duration-300 transform hover:scale-105 glow-hover">
                <svg className="w-5 h-5 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                Log out
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="text-gray-400 mb-6">
                <p className="text-lg mb-2">Please sign in to access the portal</p>
                <p className="text-sm">Secure authentication powered by Cloudflare Access</p>
              </div>
              
              <a
                href="https://portal.qially.me/cdn-cgi/access/login"
                className="inline-flex items-center justify-center w-full px-6 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 glow-hover"
              >
                <svg 
                  className="w-5 h-5 mr-3" 
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

              <div className="flex items-center justify-center space-x-4 text-sm text-gray-500">
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
          )}
        </div>
      </div>
    </div>
  );
}
