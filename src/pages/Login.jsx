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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-4">
      <div className="bg-white/20 backdrop-blur-lg rounded-3xl border border-white/30 shadow-2xl p-8 max-w-md w-full text-center">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Welcome</h1>
        
        {email ? (
          <div className="space-y-6">
            <div className="bg-white/10 rounded-xl p-4">
              <p className="text-sm text-gray-600 mb-2">Logged in as:</p>
              <p className="text-lg font-semibold text-gray-800">{email}</p>
            </div>
            
            <button className="w-full px-6 py-3 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-xl transition-colors duration-200">
              Log out
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="text-gray-600 mb-6">
              <p>Please sign in to access the portal</p>
            </div>
            
            <a
              href="https://portal.qially.me/cdn-cgi/access/login"
              className="inline-flex items-center justify-center w-full px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
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
          </div>
        )}
      </div>
    </div>
  );
}
