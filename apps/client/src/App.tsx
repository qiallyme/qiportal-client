import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Login from '@shared/pages/Login';
import Logout from '@shared/pages/Logout';
import Settings from '@shared/pages/Settings';
import ProtectedRoute from '@shared/lib/ProtectedRoute';
import Header from '@shared/components/layout/Header';
import { useUser } from '@shared/auth/context/UserContext';
import Landing from '@shared/pages/landing';
import KnowledgeBase from '@shared/pages/knowledge-base';
import Messaging from '@shared/pages/messaging';
import InvoiceManagement from '@shared/pages/invoice-management';
import NotFound from '@shared/pages/not-found';
import ClientDashboard from './pages/client-dashboard';

const App: React.FC = () => {
  const { loading } = useUser();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col dark-gradient-bg">
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

          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute>
                <ClientDashboard />
              </ProtectedRoute>
            } 
          />

          {/* Fallback */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>

      <footer className="container py-10 text-white/60">
        © {new Date().getFullYear()} QiAlly. No tracking. No drama.
      </footer>
    </div>
  );
};

export default App;
