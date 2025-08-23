import { Navigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import { getUserEmailFromJWT } from '../utils/auth';

export default function ProtectedRoute({ roleRequired, children }) {
  const { role } = useUser();
  const isAuthenticated = getUserEmailFromJWT();

  if (!isAuthenticated) {
    // Redirect to Cloudflare login if not authenticated
    window.location.href = 'https://qially.cloudflareaccess.com/cdn-cgi/access/login';
    return null;
  }

  if (role !== roleRequired) {
    return <Navigate to="/" replace />;
  }

  return children;
}
