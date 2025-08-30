import React, { useState, useEffect } from 'react';
import { useUser } from '../context/UserContext';
import { getUserClients, isStaticKBAvailable } from '../lib/staticKbApi';

export default function KBAdmin() {
  const { role } = useUser();
  const [userClients, setUserClients] = useState([]);
  const [staticKBAvailable, setStaticKBAvailable] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const [clients, kbAvailable] = await Promise.all([
          getUserClients(),
          isStaticKBAvailable()
        ]);
        setUserClients(clients);
        setStaticKBAvailable(kbAvailable);
      } catch (error) {
        console.error('Error loading KB admin data:', error);
      } finally {
        setLoading(false);
      }
    }
    
    loadData();
  }, []);

  if (role !== 'admin') {
    return (
      <div className="flex min-h-[calc(100vh-80px)] items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Access Denied</h3>
          <p className="text-gray-600">Admin access required to view this page.</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex min-h-[calc(100vh-80px)] items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading knowledge base admin...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-80px)] p-6">
      <div className="max-w-6xl mx-auto">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Knowledge Base Administration</h1>
          <p className="text-gray-300">Manage knowledge base access and configuration</p>
        </header>

        {/* System Status */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-8">
          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white">System Status</h3>
              <div className={`w-3 h-3 rounded-full ${staticKBAvailable ? 'bg-green-500' : 'bg-red-500'}`}></div>
            </div>
            <p className="text-gray-300 text-sm mb-2">
              Static Knowledge Base: {staticKBAvailable ? 'Available' : 'Unavailable'}
            </p>
            <p className="text-gray-400 text-xs">
              {staticKBAvailable 
                ? 'Static files are generated and accessible'
                : 'Static files need to be built'
              }
            </p>
          </div>

          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
            <h3 className="text-lg font-semibold text-white mb-4">Client Organizations</h3>
            <p className="text-3xl font-bold text-blue-400 mb-2">{userClients.length}</p>
            <p className="text-gray-400 text-sm">Total accessible clients</p>
          </div>

          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
            <h3 className="text-lg font-semibold text-white mb-4">Admin Access</h3>
            <p className="text-gray-300 text-sm mb-2">You have admin privileges</p>
            <p className="text-gray-400 text-xs">Can access all knowledge bases</p>
          </div>
        </div>

        {/* Client List */}
        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
          <h2 className="text-xl font-semibold text-white mb-6">Client Organizations</h2>
          
          {userClients.length === 0 ? (
            <p className="text-gray-400">No client organizations found.</p>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {userClients.map(client => (
                <div key={client.slug} className="bg-gray-700 rounded-lg p-4 border border-gray-600">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-lg font-medium text-white">{client.name}</h3>
                    <span className="text-xs bg-blue-600 text-white px-2 py-1 rounded">
                      {client.slug}
                    </span>
                  </div>
                  
                  {client.description && (
                    <p className="text-gray-300 text-sm mb-3">{client.description}</p>
                  )}
                  
                  <div className="flex gap-2">
                    <button
                      onClick={() => window.open(`/kb/${client.slug}/index.html`, '_blank')}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm transition-colors"
                    >
                      View KB
                    </button>
                    <button
                      onClick={() => window.open(`/kb/${client.slug}/search-index.json`, '_blank')}
                      className="bg-gray-600 hover:bg-gray-700 text-white px-3 py-1 rounded text-sm transition-colors"
                    >
                      View Index
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Management Actions */}
        <div className="mt-8 bg-gray-800 rounded-lg p-6 border border-gray-700">
          <h2 className="text-xl font-semibold text-white mb-6">Management Actions</h2>
          
          <div className="grid gap-4 md:grid-cols-2">
            <div className="bg-gray-700 rounded-lg p-4">
              <h3 className="text-lg font-medium text-white mb-3">Configuration</h3>
              <p className="text-gray-300 text-sm mb-4">
                Manage client access and knowledge base configuration through the kb-config.json file.
              </p>
              <button
                onClick={() => window.open('/kb-config.json', '_blank')}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded transition-colors"
              >
                View Config
              </button>
            </div>

            <div className="bg-gray-700 rounded-lg p-4">
              <h3 className="text-lg font-medium text-white mb-3">Content Management</h3>
              <p className="text-gray-300 text-sm mb-4">
                Add or modify knowledge base content in the kb-content directory.
              </p>
              <button
                onClick={() => window.open('/kb-content', '_blank')}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded transition-colors"
              >
                View Content
              </button>
            </div>

            <div className="bg-gray-700 rounded-lg p-4">
              <h3 className="text-lg font-medium text-white mb-3">Build System</h3>
              <p className="text-gray-300 text-sm mb-4">
                Rebuild the static knowledge base after making changes to content or configuration.
              </p>
              <button
                onClick={() => {
                  if (confirm('This will rebuild the knowledge base. Continue?')) {
                    // In a real implementation, this would trigger a build process
                    alert('Build process would be triggered here. Run "npm run build:kb" manually.');
                  }
                }}
                className="bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-2 rounded transition-colors"
              >
                Rebuild KB
              </button>
            </div>

            <div className="bg-gray-700 rounded-lg p-4">
              <h3 className="text-lg font-medium text-white mb-3">Access Control</h3>
              <p className="text-gray-300 text-sm mb-4">
                View and manage access control configuration for all clients.
              </p>
              <button
                onClick={() => window.open('/kb/access-control.json', '_blank')}
                className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded transition-colors"
              >
                View Access Control
              </button>
            </div>
          </div>
        </div>

        {/* Information */}
        <div className="mt-8 p-4 bg-blue-900/20 border border-blue-500/30 rounded-lg">
          <div className="flex items-start">
            <svg className="w-5 h-5 text-blue-400 mt-0.5 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div>
              <h4 className="text-blue-400 font-medium mb-1">Knowledge Base Management</h4>
              <p className="text-blue-300 text-sm">
                The knowledge base system uses static file generation for performance and security. 
                Changes to content or configuration require rebuilding the static files using the build script.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

