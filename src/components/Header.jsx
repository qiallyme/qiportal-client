import { Link } from 'react-router-dom'

function Header() {
  return (
    <header className="bg-white shadow px-4 py-3 flex justify-between items-center">
      <h1 className="text-xl font-bold">QiAlly Client Portal</h1>
      <nav className="space-x-4">
        <Link to="/" className="text-blue-600 hover:underline">Home</Link>
        <Link to="/login" className="text-blue-600 hover:underline">Login</Link>
      </nav>
    </header>
  )
}

export default Header
