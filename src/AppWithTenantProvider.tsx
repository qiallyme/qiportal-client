// src/App.tsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { UserProvider } from './context/UserContext';
import { TenantProvider } from './contexts/TenantProvider';

// Import your existing components
import Header from './components/Header';
import Home from './pages/Home';
import Login from './pages/Login';
import Logout from './pages/Logout';
import Client from './pages/Client';
import Projects from './pages/Projects';
import Messages from './pages/Messages';
import Settings from './pages/Settings';
import KB from './pages/KB';
import Calls from './pages/Calls';
import Billing from './pages/Billing';
import Support from './pages/Support';
import Admin from './pages/Admin';
import MindMap from './pages/MindMap';

// Import the new tenant-aware KB component
import KbHome from './pages/KbHome';

export default function AppRoot() {
  return (
    <UserProvider>
      <TenantProvider>
        <Router>
          <div className="min-h-screen flex flex-col">
            {/* Header */}
            <Header />

            {/* Routes */}
            <main className="flex-1 overflow-auto">
              <Routes>
                {/* Public routes */}
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/logout" element={<Logout />} />

                {/* Protected routes */}
                <Route path="/client" element={<Client />} />
                <Route path="/projects" element={<Projects />} />
                <Route path="/messages" element={<Messages />} />
                <Route path="/settings" element={<Settings />} />
                <Route path="/calls" element={<Calls />} />
                <Route path="/billing" element={<Billing />} />
                <Route path="/support" element={<Support />} />
                <Route path="/admin" element={<Admin />} />
                <Route path="/mindmap" element={<MindMap />} />

                {/* Knowledge Base - now tenant-aware */}
                <Route path="/kb" element={<KbHome />} />

                {/* Debug route - only in development */}
                {process.env.NODE_ENV === 'development' && (
                  <Route path="/debug" element={
                    <div className="min-h-screen bg-gray-900 text-white p-8">
                      <h1 className="text-2xl mb-4">Tenant Debug</h1>
                      <div className="space-y-4">
                        <div>
                          <strong>Hostname:</strong> {window.location.hostname}
                        </div>
                        <div>
                          <strong>Raw Slug:</strong> {window.location.hostname.split('.')[0]}
                        </div>
                        <div>
                          <strong>Local Storage:</strong>
                          <pre className="bg-gray-800 p-2 rounded text-xs overflow-auto">
                            {JSON.stringify(Object.keys(localStorage).filter(key => key.includes('supabase') || key.includes('auth')), null, 2)}
                          </pre>
                        </div>
                      </div>
                    </div>
                  } />
                )}
              </Routes>
            </main>
          </div>
        </Router>
      </TenantProvider>
    </UserProvider>
  );
}
