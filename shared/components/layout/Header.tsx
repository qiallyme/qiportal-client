import React from 'react';
import { Link, useNavigate } from "react-router-dom";
import { useUser } from '../../auth/context/UserContext';

/**
 * Header component with navigation and user authentication status
 * @returns {JSX.Element} Header component with navigation links and user info
 */
export default function Header() {
  const { user, logout } = useUser();
  const navigate = useNavigate();

  const handleLogout = async () => {
    console.log('Logout button clicked');
    try {
      await logout();
      console.log('Logout completed, navigating to home');
      navigate('/');
    } catch (error) {
      console.error('Logout error:', error);
      // Force navigation even if there's an error
      navigate('/');
    }
  };

  return (
    <header className="glass-nav w-full">
      <div className="mx-auto max-w-6xl px-4 h-16 flex items-center justify-between">
        {/* Brand */}
        <Link to="/" className="flex items-center gap-2 group">
          <div className="relative">
            <img src="https://vwqkhjnkummwtvfxgqml.supabase.co/storage/v1/object/public/site_assets/logo/qially/qcircleiconsquare.png" alt="QiAlly" className="h-8 w-8 transition-transform duration-300 group-hover:scale-110" />
            <div className="absolute inset-0 bg-blue-400/20 rounded-full blur-lg group-hover:bg-blue-400/30 transition-all duration-300"></div>
          </div>
          <span className="font-bold text-white text-xl tracking-wide">QiAlly</span>
        </Link>

        {/* Nav */}
        <nav className="flex items-center gap-6 text-sm">
          <Link to="/" className="glass-nav-link">
            Home
          </Link>
          {user ? (
            <>
              <Link to="/client" className="glass-nav-link">
                Dashboard
              </Link>
              <Link to="/projects" className="glass-nav-link">
                Projects
              </Link>
              <Link to="/messages" className="glass-nav-link">
                Messages
              </Link>
              <Link to="/kb" className="glass-nav-link">
                Knowledge Base
              </Link>
              <Link to="/calls" className="glass-nav-link">
                Calls
              </Link>
              <Link to="/billing" className="glass-nav-link">
                Billing
              </Link>
              <Link to="/support" className="glass-nav-link">
                Support
              </Link>
              <Link to="/settings" className="glass-nav-link">
                Settings
              </Link>
              {user.role === "admin" && (
                <Link to="/admin" className="glass-nav-link">
                  Admin
                </Link>
              )}
            </>
          ) : (
            <>
              <a href="#what-we-offer" className="glass-nav-link">Services</a>
              <a href="#outcomes" className="glass-nav-link">Outcomes</a>
              <a href="#contact" className="glass-nav-link">Contact</a>
            </>
          )}
        </nav>

        {/* User */}
        <div className="flex items-center gap-3">
          {user ? (
            <>
              <div className="flex items-center gap-3 glass-card px-4 py-2">
                <div className="relative">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 grid place-items-center glow-blue">
                    <svg className="w-4 h-4 text-white" viewBox="0 0 20 20" fill="currentColor">
                      <path
                        fillRule="evenodd"
                        d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                </div>
                <div className="text-xs">
                  <p className="font-medium leading-tight text-white">{user.email}</p>
                  <p className="text-white/70 capitalize leading-tight">{user.role}</p>
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="glass-button-primary glow-red"
                type="button"
              >
                Logout
              </button>
            </>
          ) : (
            <Link
              to="/login"
              className="glass-button-primary glow-blue"
            >
              Sign In
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
