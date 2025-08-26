import { Routes, Route, Link, Navigate } from 'react-router-dom';
import Home from './pages/Home.jsx';
import Login from './pages/Login.jsx';
import Logout from './pages/Logout.jsx';
import NotFound from './pages/NotFound.jsx';
import Client from './pages/Client.jsx';
import Projects from './pages/Projects.jsx';
import Messages from './pages/Messages.jsx';
import Settings from './pages/Settings.jsx';
import AdminPanel from './pages/AdminPanel.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import { useUser } from './context/UserContext';

export default function App() {
  const { email, role } = useUser();

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="container py-4 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 font-semibold">
          <img src="/logo.svg" alt="QiAlly Logo" className="w-8 h-8" />
          QiAlly
        </Link>

        <nav className="hidden md:flex items-center gap-6 text-sm">
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
          {email ? (
            <Link to="/logout" className="btn btn-ghost">
              Logout
            </Link>
          ) : (
            <Link className="btn btn-ghost" to="/login">Login</Link>
          )}
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
            path="/projects" 
            element={
              <ProtectedRoute>
                <Projects />
              </ProtectedRoute>
            } 
          />

          <Route 
            path="/messages" 
            element={
              <ProtectedRoute>
                <Messages />
              </ProtectedRoute>
            } 
          />

          <Route 
            path="/settings" 
            element={
              <ProtectedRoute>
                <Settings />
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
