import { Link } from "react-router-dom";
import { useUser } from "../context/UserContext";

/**
 * Header component with navigation and user authentication status
 * @returns {JSX.Element} Header component with navigation links and user info
 */
export default function Header() {
  const { email, role } = useUser();

  return (
    <header className="w-full border-b border-gray-200 bg-white/80 backdrop-blur">
      <div className="mx-auto max-w-6xl px-4 h-16 flex items-center justify-between">
        {/* Brand */}
        <Link to="/" className="flex items-center gap-2">
          <img src="/logo.svg" alt="QiAlly" className="h-7 w-7" />
          <span className="font-semibold">QiAlly</span>
        </Link>

        {/* Nav */}
        <nav className="flex items-center gap-6 text-sm">
          <Link to="/" className="text-gray-600 hover:text-gray-900 transition-colors">
            Home
          </Link>
          {email && (
            <>
              <Link to="/client" className="text-gray-600 hover:text-gray-900 transition-colors">
                Dashboard
              </Link>
              {role === "admin" && (
                <Link to="/admin" className="text-gray-600 hover:text-gray-900 transition-colors">
                  Admin
                </Link>
              )}
            </>
          )}
        </nav>

        {/* User */}
        <div className="flex items-center gap-3">
          {email ? (
            <>
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
              <Link
                to="/logout"
                className="inline-flex items-center rounded-lg px-3 py-2 text-sm bg-gray-900 text-white hover:opacity-90"
              >
                Logout
              </Link>
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
