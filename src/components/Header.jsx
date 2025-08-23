import { Link } from 'react-router-dom'
import { useUser } from '../context/UserContext'

function Header() {
  const { email, role } = useUser()

  return (
    <header className="sticky top-0 z-50 py-4 px-6 md:px-12 backdrop-filter backdrop-blur-md glass shadow-lg rounded-b-xl transition-all duration-300">
      <div className="container mx-auto flex justify-between items-center">
        {/* Logo */}
        <Link to="/" className="flex items-center space-x-3 group">
          <div className="w-8 h-8 bg-gradient-to-br from-electric-blue-500 to-plasma-purple-500 rounded-lg flex items-center justify-center p-1">
            <img 
              src="/logo.svg" 
              alt="QiAlly Logo" 
              className="w-full h-full object-contain"
            />
          </div>
          <span className="text-xl font-bold gradient-text group-hover:scale-105 transition-transform duration-200">
            QiAlly
          </span>
        </Link>

        {/* Navigation */}
        <nav className="hidden md:flex items-center space-x-8">
          <Link to="/" className="text-gray-300 hover:text-white transition-colors duration-200">
            Home
          </Link>
          {email && (
            <>
              <Link to="/dashboard" className="text-gray-300 hover:text-white transition-colors duration-200">
                Dashboard
              </Link>
              {role === 'admin' && (
                <Link to="/admin" className="text-gray-300 hover:text-white transition-colors duration-200">
                  Admin
                </Link>
              )}
            </>
          )}
        </nav>

        {/* User Info */}
        <div className="flex items-center space-x-4">
          {email ? (
            <div className="flex items-center space-x-3">
              <div className="w-6 h-6 bg-gradient-to-br from-electric-blue-500 to-plasma-purple-500 rounded-full flex items-center justify-center">
                <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="text-sm">
                <p className="text-white font-medium">{email}</p>
                <p className="text-gray-400 text-xs capitalize">{role}</p>
              </div>
            </div>
          ) : (
            <Link 
              to="/login" 
              className="px-4 py-2 bg-gradient-to-r from-electric-blue-600 to-plasma-purple-600 text-white font-medium rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
            >
              Sign In
            </Link>
          )}
        </div>
      </div>
    </header>
  )
}

export default Header
