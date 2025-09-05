import React from 'react';
import { Navigate } from 'react-router-dom';
import { useUser } from '../auth/context/UserContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  roleRequired?: string;
}

export default function ProtectedRoute({ children, roleRequired }: ProtectedRouteProps): React.ReactElement {
  const { user, loading } = useUser();

  // Show loading while checking authentication
  if (loading) {
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
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Check role requirement if specified
  if (roleRequired && user.role !== roleRequired) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}
