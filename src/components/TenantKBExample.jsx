import React, { useState, useEffect } from 'react';
import { useTenant } from '../contexts/TenantProvider';
import { supabase } from '../lib/supabase';

/**
 * Example component showing how to use tenant context with Supabase queries
 * This demonstrates org-level data isolation
 */
export default function TenantKBExample() {
  const tenant = useTenant();
  const [spaces, setSpaces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadSpaces() {
      if (tenant.loading || !tenant.orgId) return;

      try {
        setLoading(true);
        
        // Example Supabase query using tenant orgId for data isolation
        const { data, error } = await supabase
          .from('kb_spaces')
          .select('id, name, slug, description')
          .eq('org_id', tenant.orgId) // This ensures only spaces from this org are loaded
          .order('name');

        if (error) throw error;
        setSpaces(data || []);
        
      } catch (err) {
        console.error('Error loading spaces:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    loadSpaces();
  }, [tenant.orgId, tenant.loading]);

  if (tenant.loading) {
    return <div className="p-4">Loading tenant...</div>;
  }

  if (tenant.error) {
    return <div className="p-4 text-red-500">Tenant error: {tenant.error}</div>;
  }

  return (
    <div className="p-6">
      <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          {tenant.title} — Knowledge Base
        </h1>
        <p className="text-gray-600">
          Current tenant: <strong>{tenant.slug}</strong> (Org ID: {tenant.orgId})
        </p>
        <p className="text-sm text-blue-600 mt-2">
          📍 Domain: {window.location.hostname}
        </p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center p-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-2">Loading spaces...</span>
        </div>
      ) : error ? (
        <div className="p-4 text-red-500">Error: {error}</div>
      ) : (
        <div>
          <h2 className="text-xl font-semibold mb-4">Knowledge Base Spaces</h2>
          {spaces.length === 0 ? (
            <div className="text-center py-8">
              <div className="text-gray-400 text-4xl mb-4">📚</div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No spaces found</h3>
              <p className="text-gray-600">
                No knowledge base spaces available for {tenant.title}.
              </p>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {spaces.map((space) => (
                <div key={space.id} className="bg-white p-4 rounded-lg border border-gray-200 hover:shadow-md transition-shadow">
                  <h3 className="font-semibold text-gray-900 mb-2">{space.name}</h3>
                  <p className="text-sm text-gray-600 mb-3">{space.slug}</p>
                  {space.description && (
                    <p className="text-sm text-gray-500">{space.description}</p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Debug info in development */}
      {process.env.NODE_ENV === 'development' && (
        <div className="mt-8 p-4 bg-gray-100 rounded-lg">
          <h4 className="font-semibold mb-2">Debug Info:</h4>
          <pre className="text-xs text-gray-600 overflow-auto">
            {JSON.stringify({ tenant, spacesCount: spaces.length }, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}

/**
 * Example of how to create a tenant-aware Supabase query function
 */
export function createTenantQuery(tableName, tenant) {
  if (!tenant.orgId) {
    throw new Error('Tenant orgId is required');
  }
  
  return supabase
    .from(tableName)
    .eq('org_id', tenant.orgId); // Automatically filter by org
}

/**
 * Example usage of tenant-aware query
 */
export async function getTenantArticles(tenant, spaceId = null) {
  if (!tenant.orgId) {
    throw new Error('Tenant orgId is required');
  }

  let query = supabase
    .from('kb_articles')
    .select('*')
    .eq('org_id', tenant.orgId); // Base filter by org

  if (spaceId) {
    query = query.eq('space_id', spaceId); // Additional filter by space
  }

  const { data, error } = await query;
  if (error) throw error;
  return data;
}
