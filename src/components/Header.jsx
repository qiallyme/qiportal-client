import { Link, useNavigate } from "react-router-dom";
import { useUser } from "../context/UserContext";
import NotificationCenter from "./NotificationCenter";

/**
 * Header component with navigation and user authentication status
 * @returns {JSX.Element} Header component with navigation links and user info
 */
export default function Header() {
  const { email, role, signOut } = useUser();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await signOut();
      navigate('/');
    } catch (error) {
      console.error('Logout error:', error);
      navigate('/');
    }
  };

  return (
    <header className="w-full border-b border-gray-200 bg-white/80 backdrop-blur">
      <div className="mx-auto max-w-6xl px-4 h-16 flex items-center justify-between">
        {/* Brand */}
        <Link to="/" className="flex items-center gap-2">
                        <img src="https://vwqkhjnkummwtvfxgqml.supabase.co/storage/v1/object/public/site_assets/logo/qially/qcircleiconsquare.png" alt="QiAlly" className="h-7 w-7" />
          <span className="font-semibold">QiAlly</span>
        </Link>

        {/* Nav */}
        <nav className="flex items-center gap-6 text-sm">
          <Link to="/" className="text-gray-600 hover:text-gray-900 transition-colors">
            Home
          </Link>
          {email ? (
            <>
              <Link to="/client" className="text-gray-600 hover:text-gray-900 transition-colors">
                Dashboard
              </Link>
              <Link to="/projects" className="text-gray-600 hover:text-gray-900 transition-colors">
                Projects
              </Link>
              <Link to="/messages" className="text-gray-600 hover:text-gray-900 transition-colors">
                Messages
              </Link>
              <Link to="/kb" className="text-gray-600 hover:text-gray-900 transition-colors">
                Knowledge Base
              </Link>
              <Link to="/calls" className="text-gray-600 hover:text-gray-900 transition-colors">
                Calls
              </Link>
              <Link to="/billing" className="text-gray-600 hover:text-gray-900 transition-colors">
                Billing
              </Link>
              <Link to="/support" className="text-gray-600 hover:text-gray-900 transition-colors">
                Support
              </Link>
              <Link to="/settings" className="text-gray-600 hover:text-gray-900 transition-colors">
                Settings
              </Link>
              {role === "admin" && (
                <Link to="/admin" className="text-gray-600 hover:text-gray-900 transition-colors">
                  Admin
                </Link>
              )}
            </>
          ) : (
            <>
              <a href="#what-we-offer">Services</a>
              <a href="#outcomes">Outcomes</a>
              <a href="#contact">Contact</a>
            </>
          )}
        </nav>

        {/* User */}
        <div className="flex items-center gap-3">
          {email ? (
            <>
              <NotificationCenter />
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 grid place-items-center">
                  <svg className="w-3 h-3 text-white" viewBox="0 0 20 20" fill="currentColor">
                    <path
                      fillRule="evenodd"
                      d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div className="text-xs">
                  <p className="font-medium leading-tight">{email}</p>
                  <p className="text-gray-500 capitalize leading-tight">{role}</p>
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="inline-flex items-center rounded-lg px-3 py-2 text-sm bg-gray-900 text-white hover:opacity-90"
              >
                Logout
              </button>
            </>
          ) : (
            <Link
              to="/login"
              className="inline-flex items-center rounded-lg px-3 py-2 text-sm bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:opacity-90"
            >
              Sign In
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
