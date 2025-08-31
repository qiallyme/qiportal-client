/**
 * Multi-Tenant Routing System for QiPortals
 * Handles subdomain-based tenant isolation and security
 */

import { useState, useEffect } from 'react';
import { supabase } from './supabase';

// Default tenant configuration
const DEFAULT_TENANT = 'qially';
const ALLOWED_DOMAINS = ['qially.com', 'localhost', '127.0.0.1'];

/**
 * Extract tenant slug from hostname
 * Examples:
 * - builtbyrays.qially.com → 'builtbyrays'
 * - portal.qially.com → 'qially' (default)
 * - localhost:5173 → 'qially' (default)
 */
export function extractTenantFromHostname() {
  const hostname = window.location.hostname;
  
  // Handle localhost/development
  if (hostname === 'localhost' || hostname === '127.0.0.1') {
    return DEFAULT_TENANT;
  }
  
  // Extract subdomain
  const parts = hostname.split('.');
  
  // Check if it's a valid domain
  const domain = parts.slice(-2).join('.');
  if (!ALLOWED_DOMAINS.includes(domain)) {
    console.warn(`Invalid domain: ${hostname}`);
    return DEFAULT_TENANT;
  }
  
  // If we have more than 2 parts, the first part is the subdomain
  if (parts.length > 2) {
    const subdomain = parts[0];
    
    // Skip common subdomains that shouldn't be treated as tenants
    const skipSubdomains = ['www', 'portal', 'app', 'api', 'cdn'];
    if (skipSubdomains.includes(subdomain)) {
      return DEFAULT_TENANT;
    }
    
    return subdomain;
  }
  
  return DEFAULT_TENANT;
}

/**
 * Get current tenant context
 * Returns tenant slug and metadata
 */
export function getCurrentTenant() {
  const tenantSlug = extractTenantFromHostname();
  
  return {
    slug: tenantSlug,
    isDefault: tenantSlug === DEFAULT_TENANT,
    hostname: window.location.hostname,
    url: window.location.href
  };
}

/**
 * Validate user access to current tenant
 * Ensures users can only access data for tenants they're authorized for
 */
export async function validateTenantAccess(tenantSlug) {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error('User not authenticated');
    }
    
    // Get user profile to check tenant access
    const { data: profile, error } = await supabase
      .from('profiles')
      .select('client_slug, role')
      .eq('email', user.email)
      .single();
    
    if (error) {
      console.error('Error fetching user profile:', error);
      throw new Error('Unable to verify user access');
    }
    
    // Admins can access all tenants
    if (profile.role === 'admin') {
      return { authorized: true, role: 'admin', clientSlug: profile.client_slug };
    }
    
    // Check if user's client_slug matches the tenant
    if (profile.client_slug === tenantSlug) {
      return { authorized: true, role: profile.role, clientSlug: profile.client_slug };
    }
    
    // Check if user has membership in the tenant's organization
    const { data: membership, error: membershipError } = await supabase
      .from('client_memberships')
      .select('role')
      .eq('user_id', user.id)
      .eq('client_id', tenantSlug)
      .single();
    
    if (membershipError && membershipError.code !== 'PGRST116') {
      console.error('Error checking membership:', membershipError);
    }
    
    if (membership) {
      return { authorized: true, role: membership.role, clientSlug: tenantSlug };
    }
    
    return { authorized: false, role: null, clientSlug: null };
    
  } catch (error) {
    console.error('Error validating tenant access:', error);
    return { authorized: false, role: null, clientSlug: null, error: error.message };
  }
}

/**
 * Get tenant-specific Supabase query with RLS context
 * Automatically filters data based on current tenant
 */
export function getTenantQuery(tableName, tenantSlug = null) {
  const currentTenant = tenantSlug || getCurrentTenant().slug;
  
  let query = supabase.from(tableName);
  
  // Add tenant-specific filters based on table
  switch (tableName) {
    case 'kb_files':
      query = query.eq('client_slug', currentTenant);
      break;
    case 'conversations':
      query = query.eq('client_id', currentTenant);
      break;
    case 'profiles':
      // For profiles, we'll let RLS handle the filtering
      // but we can add additional context if needed
      break;
    default:
      // For other tables, add client_slug filter if the column exists
      // This is a fallback for tables that might have tenant isolation
      break;
  }
  
  return query;
}

/**
 * Create tenant-aware Supabase client
 * Automatically includes tenant context in requests
 */
export function createTenantClient(tenantSlug = null) {
  const currentTenant = tenantSlug || getCurrentTenant().slug;
  
  // Create a wrapper around the existing supabase client
  const tenantClient = {
    // Proxy all supabase methods
    ...supabase,
    
    // Override from() method to automatically add tenant filters
    from: (tableName) => {
      return getTenantQuery(tableName, currentTenant);
    },
    
    // Add tenant-specific methods
    tenant: {
      slug: currentTenant,
      isDefault: currentTenant === DEFAULT_TENANT
    }
  };
  
  return tenantClient;
}

/**
 * Middleware for protecting routes based on tenant access
 * Use this in your route components
 */
export function withTenantProtection(Component) {
  return function TenantProtectedComponent(props) {
    const [tenantAccess, setTenantAccess] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    
    useEffect(() => {
      async function checkAccess() {
        try {
          setLoading(true);
          const currentTenant = getCurrentTenant();
          const access = await validateTenantAccess(currentTenant.slug);
          
          if (!access.authorized) {
            setError('Access denied. You are not authorized to view this tenant.');
            return;
          }
          
          setTenantAccess(access);
        } catch (err) {
          setError(err.message);
        } finally {
          setLoading(false);
        }
      }
      
      checkAccess();
    }, []);
    
    if (loading) {
      return <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Verifying access...</p>
        </div>
      </div>;
    }
    
    if (error) {
      return <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="text-red-600 text-xl mb-4">⚠️</div>
          <h2 className="text-xl font-semibold mb-2">Access Denied</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button 
            onClick={() => window.location.href = '/'}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Go Home
          </button>
        </div>
      </div>;
    }
    
    return <Component {...props} tenantAccess={tenantAccess} />;
  };
}

/**
 * Hook for accessing tenant context in components
 */
export function useTenant() {
  const [tenant, setTenant] = useState(getCurrentTenant());
  const [access, setAccess] = useState(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    async function loadTenantData() {
      try {
        const access = await validateTenantAccess(tenant.slug);
        setAccess(access);
      } catch (error) {
        console.error('Error loading tenant data:', error);
      } finally {
        setLoading(false);
      }
    }
    
    loadTenantData();
  }, [tenant.slug]);
  
  return {
    tenant,
    access,
    loading,
    isAuthorized: access?.authorized || false,
    role: access?.role || null
  };
}

/**
 * Utility function to redirect to tenant-specific URL
 */
export function redirectToTenant(tenantSlug, path = '') {
  const currentHostname = window.location.hostname;
  const parts = currentHostname.split('.');
  
  if (parts.length > 2) {
    // We're on a subdomain, replace it
    parts[0] = tenantSlug;
  } else {
    // We're on the main domain, add subdomain
    parts.unshift(tenantSlug);
  }
  
  const newHostname = parts.join('.');
  const protocol = window.location.protocol;
  const port = window.location.port ? `:${window.location.port}` : '';
  
  const newUrl = `${protocol}//${newHostname}${port}${path}`;
  window.location.href = newUrl;
}

/**
 * Get tenant-specific API endpoints
 */
export function getTenantApiUrl(endpoint, tenantSlug = null) {
  const currentTenant = tenantSlug || getCurrentTenant().slug;
  return `/api/tenants/${currentTenant}${endpoint}`;
}

/**
 * Validate tenant slug format
 */
export function isValidTenantSlug(slug) {
  // Only allow lowercase letters, numbers, and hyphens
  const validSlugRegex = /^[a-z0-9-]+$/;
  return validSlugRegex.test(slug) && slug.length >= 2 && slug.length <= 50;
}

// Export constants for use in other modules
export const TENANT_CONSTANTS = {
  DEFAULT_TENANT,
  ALLOWED_DOMAINS,
  SKIP_SUBDOMAINS: ['www', 'portal', 'app', 'api', 'cdn']
};
