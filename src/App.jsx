import { Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home.jsx';
import Login from './pages/Login.jsx';
import Logout from './pages/Logout.jsx';
import NotFound from './pages/NotFound.jsx';
import Client from './pages/Client.jsx';
import Projects from './pages/Projects.jsx';
import Messages from './pages/Messages.jsx';
import Settings from './pages/Settings.jsx';
import AdminPanel from './pages/AdminPanel.jsx';
import KB from './pages/KB.jsx';
import Calls from './pages/Calls.jsx';
import Billing from './pages/Billing.jsx';
import Support from './pages/Support.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import Header from './components/Header.jsx';
import { useUser } from './context/UserContext';
import MindMap from './pages/MindMap.jsx';

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
