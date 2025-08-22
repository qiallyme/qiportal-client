// src/pages/Login.jsx
import { useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { getUserEmailFromJWT } from '../utils/auth';
import { UserContext } from '../context/UserContext';

export default function Login() {
  const { setUser } = useContext(UserContext);
  const navigate = useNavigate();

  useEffect(() => {
    const email = getUserEmailFromJWT();
    if (email) {
      setUser({ email });
      // Redirect to dashboard or home
      navigate('/');
    } else {
      // Not authenticated? Send them back to Cloudflare login
      window.location.href = 'https://portal.qially.me/cdn-cgi/access/login';
    }
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="glass-card p-8 text-center">
          {/* Logo */}
          <div className="w-16 h-16 bg-gradient-to-br from-electric-blue-500 to-plasma-purple-500 rounded-xl flex items-center justify-center mx-auto mb-4">
            <svg className="w-10 h-10 text-white" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
            </svg>
          </div>
          
          {/* Title */}
          <h1 className="text-2xl font-bold gradient-text mb-2">Welcome to QiAlly</h1>
          <p className="text-gray-400 mb-6">Sign in to access your portal</p>
          
          {/* Loading state */}
          <div className="space-y-4">
            <div className="text-gray-300 mb-4">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-electric-blue-400 mx-auto mb-2"></div>
              <p>Checking authentication...</p>
            </div>
            
            <button
              onClick={() => window.location.href = 'https://portal.qially.me/cdn-cgi/access/login'}
              className="w-full px-6 py-3 bg-gradient-to-r from-electric-blue-600 to-plasma-purple-600 text-white font-medium rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
            >
              Sign In with Cloudflare Access
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
