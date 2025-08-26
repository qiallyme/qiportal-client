import { Routes, Route, Link, Navigate } from 'react-router-dom';
import Home from './pages/Home.jsx';
import Login from './pages/Login.jsx';
import Logout from './pages/Logout.jsx';
import NotFound from './pages/NotFound.jsx';
import Client from './pages/Client.jsx';
import AdminPanel from './pages/AdminPanel.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';

export default function App() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
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

      {/* Routes */}
      <main className="flex-1 overflow-auto">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/logout" element={<Logout />} />

          {/* Protected routes */}
          <Route 
            path="/client" 
            element={
              <ProtectedRoute>
                <Client />
              </ProtectedRoute>
            } 
          />

          <Route
            path="/admin"
            element={
              <ProtectedRoute roleRequired="admin">
                <AdminPanel />
              </ProtectedRoute>
            }
          />

          {/* Fallback */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>

      <footer className="container py-10 text-subtext">
        © {new Date().getFullYear()} QiAlly. No tracking. No drama.
      </footer>
    </div>
  );
}
