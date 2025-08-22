// src/pages/Login.jsx
import { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../context/UserContext';

export default function Login() {
  const { email } = useContext(UserContext);
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user is already authenticated
    if (email) {
      // User is logged in, redirect to home
      navigate('/');
    } else {
      // User is not logged in, show login form
      setIsLoading(false);
    }
  }, [email, navigate]);

  const handleSignIn = () => {
    // Redirect to Cloudflare Access login
    window.location.href = 'https://portal.qially.me/cdn-cgi/access/login';
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="glass-card p-8 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500 mx-auto mb-4"></div>
          <p className="text-gray-400">Checking authentication...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="glass-card p-8 max-w-md w-full text-center">
        {/* Logo */}
        <div className="mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center mx-auto mb-4">
            <span className="text-white font-bold text-xl">Q</span>
          </div>
          <h1 className="text-2xl font-bold gradient-text mb-2">Welcome</h1>
          <p className="text-gray-400 text-sm">QiAlly Client Portal</p>
        </div>
        
        <div className="space-y-6">
          <div className="text-gray-400">
            <p className="text-lg mb-2">Please sign in to access the portal</p>
            <p className="text-sm">Secure authentication powered by Cloudflare Access</p>
          </div>
          
          <button
            onClick={handleSignIn}
            className="w-full px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-medium rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
          >
            <svg 
              className="w-4 h-4 inline mr-2" 
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
          </button>

          <div className="flex items-center justify-center space-x-4 text-xs text-gray-500">
            <div className="flex items-center">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-1"></div>
              Secure
            </div>
            <div className="flex items-center">
              <div className="w-2 h-2 bg-blue-500 rounded-full mr-1"></div>
              Fast
            </div>
            <div className="flex items-center">
              <div className="w-2 h-2 bg-purple-500 rounded-full mr-1"></div>
              Reliable
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
