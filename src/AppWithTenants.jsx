import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { UserProvider } from './context/UserContext';
import TenantRouteGuard from './components/TenantRouteGuard';
import { getCurrentTenant } from './lib/tenant';

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
import ProtectedTenantKB from './components/TenantKB';

export default function AppWithTenants() {
  const tenant = getCurrentTenant();

  return (
    <UserProvider>
      <Router>
        <div className="min-h-screen flex flex-col">
          {/* Header - shows current tenant */}
          <Header tenant={tenant} />

          {/* Routes */}
          <main className="flex-1 overflow-auto">
            <Routes>
              {/* Public routes */}
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/logout" element={<Logout />} />

              {/* Protected routes with tenant access */}
              <Route 
                path="/client" 
                element={
                  <TenantRouteGuard requireAuth={true}>
                    <Client />
                  </TenantRouteGuard>
                } 
              />

              <Route 
                path="/projects" 
                element={
                  <TenantRouteGuard requireAuth={true}>
                    <Projects />
                  </TenantRouteGuard>
                } 
              />

              <Route 
                path="/messages" 
                element={
                  <TenantRouteGuard requireAuth={true}>
                    <Messages />
                  </TenantRouteGuard>
                } 
              />

              <Route 
                path="/settings" 
                element={
                  <TenantRouteGuard requireAuth={true}>
                    <Settings />
                  </TenantRouteGuard>
                } 
              />

              {/* Knowledge Base - now tenant-aware */}
              <Route 
                path="/kb" 
                element={<ProtectedTenantKB />} 
              />

              <Route 
                path="/calls" 
                element={
                  <TenantRouteGuard requireAuth={true}>
                    <Calls />
                  </TenantRouteGuard>
                } 
              />

              <Route 
                path="/billing" 
                element={
                  <TenantRouteGuard requireAuth={true}>
                    <Billing />
                  </TenantRouteGuard>
                } 
              />

              <Route 
                path="/support" 
                element={
                  <TenantRouteGuard requireAuth={true}>
                    <Support />
                  </TenantRouteGuard>
                } 
              />

              {/* Admin routes - admin role required */}
              <Route 
                path="/admin" 
                element={
                  <TenantRouteGuard 
                    requireAuth={true} 
                    allowedRoles={['admin']}
                  >
                    <Admin />
                  </TenantRouteGuard>
                } 
              />

              <Route 
                path="/mindmap" 
                element={
                  <TenantRouteGuard requireAuth={true}>
                    <MindMap />
                  </TenantRouteGuard>
                } 
              />

              {/* Debug route - only in development */}
              {process.env.NODE_ENV === 'development' && (
                <Route path="/debug" element={
                  <div className="min-h-screen bg-gray-900 text-white p-8">
                    <h1 className="text-2xl mb-4">Auth Debug</h1>
                    <div className="space-y-4">
                      <div>
                        <strong>Current Tenant:</strong> {tenant.slug}
                      </div>
                      <div>
                        <strong>Hostname:</strong> {tenant.hostname}
                      </div>
                      <div>
                        <strong>Is Default:</strong> {tenant.isDefault ? 'Yes' : 'No'}
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
                    </div>
                  </div>
                } />
              )}
            </Routes>
          </main>
        </div>
      </Router>
    </UserProvider>
  );
}

/**
 * Example of how to update your existing Header component to show tenant info
 */
export function HeaderWithTenant({ tenant }) {
  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <h1 className="text-xl font-semibold text-gray-900">
              QiPortals
              {tenant && !tenant.isDefault && (
                <span className="ml-2 text-sm text-blue-600 bg-blue-100 px-2 py-1 rounded">
                  {tenant.slug}
                </span>
              )}
            </h1>
          </div>
          
          <div className="flex items-center space-x-4">
            {/* Your existing header content */}
            <nav className="flex space-x-4">
              <a href="/" className="text-gray-700 hover:text-gray-900">Home</a>
              <a href="/kb" className="text-gray-700 hover:text-gray-900">KB</a>
              <a href="/messages" className="text-gray-700 hover:text-gray-900">Messages</a>
            </nav>
            
            {/* Tenant switcher for admins */}
            {tenant && (
              <div className="text-sm text-gray-500">
                {tenant.isDefault ? 'Default Tenant' : `Tenant: ${tenant.slug}`}
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
