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
      navigate('/'); // already signed in
    } else {
      window.location.href = 'https://qially.cloudflareaccess.com/cdn-cgi/access/login';
    }
  }, [setUser, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="glass p-8 text-center rounded-xl2">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl flex items-center justify-center mx-auto mb-4 p-2">
            <img src="/logo.svg" alt="QiAlly Logo" className="w-full h-full object-contain" />
          </div>
          <h1 className="text-2xl font-bold gradient-text mb-2">Welcome to QiAlly</h1>
          <p className="text-subtext mb-6">Sign in to access your portal</p>
          <div className="space-y-4">
            <div className="text-subtext mb-4">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
              <p>Checking authentication...</p>
            </div>
            <button
              onClick={() => (window.location.href = 'https://qially.cloudflareaccess.com/cdn-cgi/access/login')}
              className="w-full px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium rounded-xl2 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
            >
              Sign In with Cloudflare Access
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
