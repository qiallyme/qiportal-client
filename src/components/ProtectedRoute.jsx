// src/components/ProtectedRoute.jsx
import { useEffect, useState } from 'react';
import { useUser } from '../context/UserContext';
import { supabase } from '../lib/supabase';

export default function ProtectedRoute({ children, roleRequired }) {
  const { email, role, hydrated } = useUser();
  const [isAuthorized, setIsAuthorized] = useState(null);

  useEffect(() => {
    if (!hydrated) return;

    if (!email) {
      setIsAuthorized(false);
      return;
    }

    if (roleRequired && role !== roleRequired) {
      setIsAuthorized(false);
      return;
    }

    setIsAuthorized(true);
  }, [email, role, hydrated, roleRequired]);

  // Show loading while checking authentication
  if (!hydrated || isAuthorized === null) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!isAuthorized) {
    window.location.href = '/login';
    return null;
  }

  return children;
}
