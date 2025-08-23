import { Routes, Route, Link, Navigate } from 'react-router-dom';
import Home from './pages/Home.jsx';
import Logout from './pages/Logout.jsx';
import NotFound from './pages/NotFound.jsx';
import Client from './pages/Client.jsx';
import AdminPanel from './pages/AdminPanel.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';

export default function App() {
  // Host-aware:
  // - On portal.qially.com, "/" should resolve to the client dashboard (/client).
  // - On any other host (preview/dev/public), show Home and use an absolute link for Login.
  const host = typeof window !== 'undefined' ? window.location.hostname : '';
  const isPortal = host === 'portal.qially.com' || host.startsWith('portal.');

  // Header "Login" button target
  const loginHref = isPortal ? '/client' : 'https://portal.qially.com/client';

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="container py-4 flex items-center justify-between">
        <Link to={isPortal ? '/client' : '/'} className="flex items-center gap-2 font-semibold">
          <img src="/logo.svg" alt="QiAlly Logo" className="w-8 h-8" />
          QiAlly
        </Link>

        <nav className="hidden md:flex items-center gap-6 text-sm">
          {/* These anchors are just placeholders on the portal host */}
          <a href="#what-we-offer">Services</a>
          <a href="#outcomes">Outcomes</a>
          <a href="#contact">Contact</a>
          <a className="btn btn-ghost" href={loginHref}>Login</a>
        </nav>
      </header>

      {/* Routes */}
      <main className="flex-1 overflow-auto">
        <Routes>
          {/* On the portal host, "/" → "/client"; elsewhere "/" → <Home /> */}
          <Route path="/" element={isPortal ? <Navigate to="/client" replace /> : <Home />} />

          {/* Logout page can live on either host */}
          <Route path="/logout" element={<Logout />} />

          {/* Client dashboard (protected). The ProtectedRoute you have already handles roleRequired */}
          <Route path="/client" element={<Client />} />

          {/* Admin (protected) */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute roleRequired="admin">
                <AdminPanel />
              </ProtectedRoute>
            }
          />

          {/* Fallback: on portal, send unknown paths to /client; otherwise show NotFound */}
          <Route path="*" element={isPortal ? <Navigate to="/client" replace /> : <NotFound />} />
        </Routes>
      </main>

      <footer className="container py-10 text-subtext">
        © {new Date().getFullYear()} QiAlly. No tracking. No drama.
      </footer>
    </div>
  );
}
