import { useEffect } from 'react';
import { useUser } from '../context/UserContext';
import { useNavigate } from 'react-router-dom';

export default function Logout() {
  const { signOut } = useUser();
  const navigate = useNavigate();

  useEffect(() => {
    const performLogout = async () => {
      console.log('Performing logout...');
      try {
        const result = await signOut();
        if (result.error) {
          console.error('Supabase logout error:', result.error);
        }
        console.log('Logout completed, navigating to home');
        navigate('/');
      } catch (error) {
        console.error('Logout error:', error);
        // Force navigation even if there's an error
        navigate('/');
      }
    };

    performLogout();
  }, [signOut, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-2 text-gray-600">Signing out...</p>
      </div>
    </div>
  );
}
