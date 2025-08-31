import React, { useState, useEffect } from 'react';
import { useTenant } from '../contexts/TenantProvider';
import { supabase } from '../lib/supabase';

/**
 * Tenant Route Guard Component
 * Protects routes based on tenant access and provides tenant context
 */
export default function TenantRouteGuard({ 
  children, 
  fallback = null,
  requireAuth = true,
  allowedRoles = null,
  onAccessDenied = null 
}) {
  const tenant = useTenant();
  const [access, setAccess] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function checkAccess() {
      try {
        setLoading(true);
        setError(null);

        // If tenant is still loading, wait
        if (tenant.loading) {
          return;
        }

        // If auth is not required, allow access
        if (!requireAuth) {
          setAccess({ authorized: true, role: 'guest' });
          setLoading(false);
          return;
        }

        // Get current user
        const { data: { user }, error: authError } = await supabase.auth.getUser();
        
        if (authError || !user) {
          setError('Authentication required');
          setLoading(false);
          return;
        }

        // Get user profile to check org access
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('org_id, role')
          .eq('id', user.id)
          .single();

        if (profileError) {
          setError('Unable to verify user access');
          setLoading(false);
          return;
        }

        // Check if user's org_id matches the tenant's orgId
        if (profile.org_id !== tenant.orgId) {
          const errorMsg = `Access denied. You are not authorized to view ${tenant.title}.`;
          setError(errorMsg);
          
          if (onAccessDenied) {
            onAccessDenied({ authorized: false, role: profile.role }, tenant);
          }
          setLoading(false);
          return;
        }

        // Check role-based access if specified
        if (allowedRoles && !allowedRoles.includes(profile.role)) {
          const errorMsg = `Access denied. Required role: ${allowedRoles.join(' or ')}`;
          setError(errorMsg);
          
          if (onAccessDenied) {
            onAccessDenied({ authorized: false, role: profile.role }, tenant);
          }
          setLoading(false);
          return;
        }

        // Access granted
        setAccess({ authorized: true, role: profile.role });

      } catch (err) {
        console.error('Error checking tenant access:', err);
        setError(err.message);
        
        if (onAccessDenied) {
          onAccessDenied(null, tenant);
        }
      } finally {
        setLoading(false);
      }
    }

    checkAccess();
  }, [tenant, requireAuth, allowedRoles, onAccessDenied]);

  // Loading state
  if (loading) {
    return fallback || (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <h2 className="text-lg font-semibold text-gray-700 mb-2">Verifying Access</h2>
          <p className="text-gray-500">Checking your permissions...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return fallback || (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center max-w-md mx-auto p-6">
          <div className="text-red-600 text-4xl mb-4">⚠️</div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Access Denied</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          
          <div className="space-y-3">
            <button 
              onClick={() => window.location.href = '/'}
              className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Go Home
            </button>
            
            <button 
              onClick={() => window.location.href = '/login'}
              className="w-full bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
            >
              Sign In
            </button>
          </div>
          
          {tenant && (
            <div className="mt-4 p-3 bg-gray-100 rounded-lg">
              <p className="text-sm text-gray-600">
                <strong>Current Tenant:</strong> {tenant.slug}
              </p>
              <p className="text-sm text-gray-600">
                <strong>Organization:</strong> {tenant.title}
              </p>
              <p className="text-sm text-gray-600">
                <strong>Domain:</strong> {window.location.hostname}
              </p>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Success state - render children with tenant context
  return (
    <div className="tenant-context" data-tenant={tenant?.slug}>
      {React.cloneElement(children, { 
        tenant,
        tenantAccess: access,
        isAuthorized: access?.authorized || false,
        userRole: access?.role || null
      })}
    </div>
  );
}

/**
 * Higher-order component for protecting components with tenant access
 */
export function withTenantProtection(Component, options = {}) {
  return function ProtectedComponent(props) {
    return (
      <TenantRouteGuard {...options}>
        <Component {...props} />
      </TenantRouteGuard>
    );
  };
}

/**
 * Hook for accessing tenant context in components
 */
export function useTenantContext() {
  const [context, setContext] = useState(null);

  useEffect(() => {
    // Get tenant context from parent TenantRouteGuard
    const tenantContext = document.querySelector('.tenant-context');
    if (tenantContext) {
      const tenantSlug = tenantContext.dataset.tenant;
      setContext({ tenantSlug });
    }
  }, []);

  return context;
}

/**
 * Simple tenant access check component
 * Use this for conditional rendering based on tenant access
 */
export function TenantAccessCheck({ 
  children, 
  fallback = null,
  requireRole = null 
}) {
  const tenant = useTenant();
  const [hasAccess, setHasAccess] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function checkAccess() {
      try {
        if (tenant.loading) return;

        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          setHasAccess(false);
          setLoading(false);
          return;
        }

        const { data: profile } = await supabase
          .from('profiles')
          .select('org_id, role')
          .eq('id', user.id)
          .single();

        if (!profile || profile.org_id !== tenant.orgId) {
          setHasAccess(false);
          setLoading(false);
          return;
        }

        if (requireRole && profile.role !== requireRole) {
          setHasAccess(false);
          setLoading(false);
          return;
        }

        setHasAccess(true);
      } catch (error) {
        console.error('Error checking tenant access:', error);
        setHasAccess(false);
      } finally {
        setLoading(false);
      }
    }

    checkAccess();
  }, [tenant, requireRole]);

  if (loading) {
    return null; // Don't show anything while loading
  }

  return hasAccess ? children : fallback;
}
