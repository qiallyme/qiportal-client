import React, { useEffect } from 'react';
import { useUser } from '../auth/context/UserContext';
import { useNavigate } from 'react-router-dom';

const Logout: React.FC = () => {
  const { logout } = useUser();
  const navigate = useNavigate();

  useEffect(() => {
    const performLogout = async () => {
      try {
        await logout();
        navigate('/');
      } catch (error) {
        console.error('Logout error:', error);
        navigate('/');
      }
    };

    performLogout();
  }, [logout, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-2 text-gray-600">Logging out...</p>
      </div>
    </div>
  );
};

export default Logout;
