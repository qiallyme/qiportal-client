import { Routes, Route, Link } from 'react-router-dom'
import Home from './pages/Home.jsx'
import Login from './pages/Login.jsx'
import NotFound from './pages/NotFound.jsx'
import Dashboard from './pages/Dashboard.jsx'
import AdminPanel from './pages/AdminPanel.jsx'
import ProtectedRoute from './components/ProtectedRoute.jsx'

export default function App() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Simple business header */}
      <header className="container py-4 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 font-semibold">
          <img src="/logo.svg" alt="QiAlly Logo" className="w-8 h-8" />
          QiAlly
        </Link>
        <nav className="hidden md:flex items-center gap-6 text-sm">
          <a href="#what-we-offer">Services</a>
          <a href="#outcomes">Outcomes</a>
          <a href="#contact">Contact</a>
          <Link className="btn btn-ghost" to="/login">Login</Link>
        </nav>
      </header>

      <main className="flex-1 overflow-auto">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/client" element={
            <ProtectedRoute roleRequired="client">
              <Dashboard />
            </ProtectedRoute>
          } />
          <Route path="/admin" element={
            <ProtectedRoute roleRequired="admin">
              <AdminPanel />
            </ProtectedRoute>
          } />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>

      <footer className="container py-10 text-subtext">
        © {new Date().getFullYear()} QiAlly. No tracking. No drama.
      </footer>
    </div>
  )
}
