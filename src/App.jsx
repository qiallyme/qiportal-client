import { Routes, Route, Link, Navigate } from 'react-router-dom';
import Home from './pages/Home.jsx';
import Logout from './pages/Logout.jsx';
import NotFound from './pages/NotFound.jsx';
import Dashboard from './pages/Dashboard.jsx';
import AdminPanel from './pages/AdminPanel.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';

export default function App() {
  // Host-aware behavior:
  // - On portal.qially.com the home page should just be the dashboard (/client).
  // - Anywhere else (e.g. a preview), keep Home and use an absolute link to the portal.
  const host =
    typeof window !== 'undefined' ? window.location.hostname : '';
  const isPortal =
    host === 'portal.qially.com' || host.startsWith('portal.');

  const loginHref = isPortal
    ? '/client'
    : 'https://portal.qially.com/client';

  return (
    <div className="min-h-screen flex flex-col">
      {/* Simple header */}
      <header className="container py-4 flex items-center justify-between">
        <Link to={isPortal ? '/client' : '/'} className="flex items-center gap-2 font-semibold">
          <img src="/logo.svg" alt="QiAlly Logo" className="w-8 h-8" />
          QiAlly
        </Link>
        <nav className="hidden md:flex items-center gap-6 text-sm">
          <a href="#what-we-offer">Services</a>
          <a href="#outcomes">Outcomes</a>
          <a href="#contact">Contact</a>
          <a className="btn btn-ghost" href={loginHref}>Login</a>
        </nav>
      </header>

      <main className="flex-1 overflow-auto">
        <Routes>
          {/* On the portal host, shove / to /client. Else show Home. */}
          <Route path="/" element={isPortal ? <Navigate to="/client" replace /> : <Home />} />



          <Route path="/logout" element={<Logout />} />

          <Route
            path="/client"
            element={
              <ProtectedRoute roleRequired="client">
                <Dashboard />
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

          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>

      <footer className="container py-10 text-subtext">
        © {new Date().getFullYear()} QiAlly. No tracking. No drama.
      </footer>
    </div>
  );
}
