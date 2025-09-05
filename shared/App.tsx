import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Logout from './pages/Logout';
import Settings from './pages/Settings';
import ProtectedRoute from './lib/ProtectedRoute';
import Header from './components/layout/Header';
import { useUser } from './auth/context/UserContext';
import Landing from './pages/landing';
import KnowledgeBase from './pages/knowledge-base';
import Messaging from './pages/messaging';
import InvoiceManagement from './pages/invoice-management';
import NotFound from './pages/not-found';

const App: React.FC = () => {
  const { user, loading } = useUser();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <Header />

      {/* Routes */}
      <main className="flex-1 overflow-auto">
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/logout" element={<Logout />} />
          
          {/* Protected routes */}
          <Route 
            path="/knowledge-base" 
            element={
              <ProtectedRoute>
                <KnowledgeBase />
              </ProtectedRoute>
            } 
          />

          <Route 
            path="/messaging" 
            element={
              <ProtectedRoute>
                <Messaging />
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
            path="/invoices" 
            element={
              <ProtectedRoute>
                <InvoiceManagement />
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
};

export default App;
