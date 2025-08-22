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
    <div className="flex justify-center items-center h-screen">
      <p>Signing you in…</p>
    </div>
  );
}
