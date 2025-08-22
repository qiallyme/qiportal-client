import { Link } from 'react-router-dom'
import { useUser } from '../context/UserContext'

function Header() {
  const { email, role } = useUser()

  return (
    <header className="glass sticky top-0 z-50 px-6 py-4">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        {/* Logo */}
        <Link to="/" className="flex items-center space-x-3 group">
          <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center glow group-hover:glow-hover transition-all duration-300">
            <span className="text-white font-bold text-xl">Q</span>
          </div>
          <div>
            <h1 className="text-xl font-bold gradient-text">QiAlly</h1>
            <p className="text-xs text-gray-400">Client Portal</p>
          </div>
        </Link>

        {/* Navigation */}
        <nav className="flex items-center space-x-6">
          <Link to="/" className="glass-button px-4 py-2 rounded-xl text-sm font-medium">
            Home
          </Link>
          <Link to="/login" className="glass-button px-4 py-2 rounded-xl text-sm font-medium">
            Login
          </Link>
          
          {/* User info */}
          {email && (
            <div className="flex items-center space-x-3">
              <div className="glass-card px-3 py-1 rounded-lg">
                <span className="text-xs text-gray-400">Role:</span>
                <span className="ml-1 text-xs font-medium gradient-text-blue capitalize">{role}</span>
              </div>
              <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-bold">
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
