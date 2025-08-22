// src/pages/Login.jsx
import { useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../context/UserContext';

export default function Login() {
  const { email } = useContext(UserContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (!email) {
      navigate('/');
    }
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
          <div className="text-gray-600">
            <p>Loading user information...</p>
          </div>
        )}
      </div>
    </div>
  );
}
