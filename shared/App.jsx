import { Routes, Route, Navigate } from 'react-router-dom';
import Home from '../../../../src/pages/Home.jsx';
import Login from './pages/Login.jsx';
import Logout from './pages/Logout.jsx';
import NotFound from '../../../../src/pages/NotFound.jsx';
import Client from '../../../../src/pages/Client.jsx';
import Projects from '../../../../src/pages/Projects.jsx';
import Messages from '../../../../src/pages/Messages.jsx';
import Settings from '../../../Settings.jsx';
import AdminPanel from '../../../../src/pages/AdminPanel.jsx';
import KB from '../../../../src/pages/KB.jsx';
import KBAdmin from '../../../../src/components/KBAdmin.jsx';
import Calls from '../../../../src/pages/Calls.jsx';
import Billing from '../../../../src/pages/Billing.jsx';
import Support from '../../../../src/pages/Support.jsx';
import ProtectedRoute from './apps/ProtectedRoute.jsx';
import Header from '../Header.jsx';
import { useUser } from '../../../../src/context/UserContext.jsx';
import MindMap from '../../../../src/pages/MindMap.jsx';
import { forceClearAuth } from '../../../../src/utils/auth.js';

export default function App() {
  const { email, role } = useUser();

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <Header />

      {/* Routes */}
      <main className="flex-1 overflow-auto">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/logout" element={<Logout />} />
          {/* Debug route - remove in production */}
          {process.env.NODE_ENV === 'development' && (
            <Route path="/debug" element={
              <div className="min-h-screen bg-gray-900 text-white p-8">
                <h1 className="text-2xl mb-4">Auth Debug</h1>
                <div className="space-y-4">
                  <div>
                    <strong>Email:</strong> {email || 'Not logged in'}
                  </div>
                  <div>
                    <strong>Role:</strong> {role}
                  </div>
                  <div>
                    <strong>Local Storage:</strong>
                    <pre className="bg-gray-800 p-2 rounded text-xs overflow-auto">
                      {JSON.stringify(Object.keys(localStorage).filter(key => key.includes('supabase') || key.includes('auth')), null, 2)}
                    </pre>
                  </div>
                  <div>
                    <strong>Session Storage:</strong>
                    <pre className="bg-gray-800 p-2 rounded text-xs overflow-auto">
                      {JSON.stringify(Object.keys(sessionStorage).filter(key => key.includes('supabase') || key.includes('auth')), null, 2)}
                    </pre>
                  </div>
                  <button
                    onClick={() => {
                      forceClearAuth();
                      window.location.reload();
                    }}
                    className="bg-red-600 px-4 py-2 rounded"
                  >
                    Force Clear Auth & Reload
                  </button>
                </div>
              </div>
            } />
          )}
          <Route 
            path="/mindmap" 
            element={
              <ProtectedRoute>
                <MindMap />
              </ProtectedRoute>
            } 
          />
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
            path="/kb" 
            element={
              <ProtectedRoute>
                <KB />
              </ProtectedRoute>
            } 
          />

          <Route 
            path="/calls" 
            element={
              <ProtectedRoute>
                <Calls />
              </ProtectedRoute>
            } 
          />

          <Route 
            path="/billing" 
            element={
              <ProtectedRoute>
                <Billing />
              </ProtectedRoute>
            } 
          />

          <Route 
            path="/support" 
            element={
              <ProtectedRoute>
                <Support />
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

          <Route
            path="/admin/kb"
            element={
              <ProtectedRoute roleRequired="admin">
                <KBAdmin />
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
