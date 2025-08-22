import { Link } from 'react-router-dom'
import { useUser } from '../context/UserContext'

function Header() {
  const { email, role } = useUser()

  return (
    <header className="glass sticky top-0 z-50 px-4 py-3">
      <div className="max-w-6xl mx-auto flex justify-between items-center">
        {/* Logo */}
        <Link to="/" className="flex items-center space-x-3 group">
          <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">Q</span>
          </div>
          <div>
            <h1 className="text-lg font-bold gradient-text">QiAlly</h1>
            <p className="text-xs text-gray-400">Client Portal</p>
          </div>
        </Link>

        {/* Navigation */}
        <nav className="flex items-center space-x-4">
          <Link to="/" className="glass-button px-3 py-2 rounded-lg text-sm font-medium">
            Home
          </Link>
          <Link to="/login" className="glass-button px-3 py-2 rounded-lg text-sm font-medium">
            Login
          </Link>
          
          {/* User info */}
          {email && (
            <div className="flex items-center space-x-3">
              <div className="glass-card px-2 py-1 rounded text-xs">
                <span className="text-gray-400">Role:</span>
                <span className="ml-1 font-medium gradient-text-blue capitalize">{role}</span>
              </div>
              <div className="w-6 h-6 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                <span className="text-white text-xs font-bold">
                  {email.charAt(0).toUpperCase()}
                </span>
              </div>
            </div>
          )}
        </nav>
      </div>
    </header>
  )
}

export default Header
