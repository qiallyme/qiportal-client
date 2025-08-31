import React, { useState, useEffect } from 'react';
import { tenantKB } from '../lib/tenantApi';
import { getCurrentTenant } from '../lib/tenant';
import TenantRouteGuard from './TenantRouteGuard';

/**
 * Tenant-Aware Knowledge Base Component
 * Example of how to use the tenant system in your components
 */
function TenantKB({ tenant, tenantAccess, userRole }) {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    loadFiles();
  }, []);

  async function loadFiles() {
    try {
      setLoading(true);
      const data = await tenantKB.getFiles();
      setFiles(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleSearch() {
    if (!searchQuery.trim()) {
      await loadFiles();
      return;
    }

    try {
      setLoading(true);
      const data = await tenantKB.searchFiles(searchQuery);
      setFiles(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-2">Loading knowledge base...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 text-center">
        <div className="text-red-600 text-xl mb-4">⚠️</div>
        <h2 className="text-xl font-semibold mb-2">Error Loading Knowledge Base</h2>
        <p className="text-gray-600 mb-4">{error}</p>
        <button 
          onClick={loadFiles}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Tenant Header */}
      <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Knowledge Base - {tenant.slug}
        </h1>
        <p className="text-gray-600">
          Welcome to the knowledge base for {tenant.slug}. 
          You are accessing this as a {userRole}.
        </p>
        {tenant.isDefault && (
          <p className="text-sm text-blue-600 mt-2">
            📍 You're viewing the default tenant (qially)
          </p>
        )}
      </div>

      {/* Search Bar */}
      <div className="mb-6">
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Search knowledge base..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <button
            onClick={handleSearch}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Search
          </button>
          {searchQuery && (
            <button
              onClick={() => {
                setSearchQuery('');
                loadFiles();
              }}
              className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {/* Files List */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {files.map((file) => (
          <div key={file.id} className="bg-white p-4 rounded-lg border border-gray-200 hover:shadow-md transition-shadow">
            <h3 className="font-semibold text-gray-900 mb-2">{file.title}</h3>
            <p className="text-sm text-gray-600 mb-3">{file.path}</p>
            
            {file.tags && file.tags.length > 0 && (
              <div className="flex flex-wrap gap-1 mb-3">
                {file.tags.map((tag, index) => (
                  <span 
                    key={index}
                    className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
            
            <div className="flex justify-between items-center text-sm text-gray-500">
              <span>Visibility: {file.visibility}</span>
              <span>{new Date(file.created_at).toLocaleDateString()}</span>
            </div>
          </div>
        ))}
      </div>

      {files.length === 0 && (
        <div className="text-center py-8">
          <div className="text-gray-400 text-4xl mb-4">📚</div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No files found</h3>
          <p className="text-gray-600">
            {searchQuery ? 'No files match your search criteria.' : 'No knowledge base files available for this tenant.'}
          </p>
        </div>
      )}

      {/* Debug Info (only in development) */}
      {process.env.NODE_ENV === 'development' && (
        <div className="mt-8 p-4 bg-gray-100 rounded-lg">
          <h4 className="font-semibold mb-2">Debug Info:</h4>
          <pre className="text-xs text-gray-600 overflow-auto">
            {JSON.stringify({ tenant, tenantAccess, userRole, fileCount: files.length }, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}

/**
 * Export the component wrapped with tenant protection
 */
export default function ProtectedTenantKB() {
  return (
    <TenantRouteGuard 
      requireAuth={true}
      allowedRoles={['admin', 'team_member', 'client_user']}
      onAccessDenied={(access, tenant) => {
        console.log('Access denied:', { access, tenant });
      }}
    >
      <TenantKB />
    </TenantRouteGuard>
  );
}

/**
 * Alternative: Export without protection for use in already protected routes
 */
export { TenantKB };
