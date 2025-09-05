// src/contexts/TenantProvider.tsx
import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { supabase } from "../../lib/supabase";
import { useUser } from "./UserContext";
import { useTenant } from "./TenantProvider";

// Load clients configuration
import clients from "@shared/exporter/quartz-config/clients/clients.json" assert { type: "json" };

type TenantState = {
  loading: boolean;
  slug?: string;
  orgId?: string;
  title?: string;
  error?: string;
};

const TenantCtx = createContext<TenantState>({ loading: true });
export const useTenant = () => useContext(TenantCtx);

// Extract subdomain from hostname
function getSubdomainFromHostname() {
  const hostname = window.location.hostname;
  
  // Handle localhost/development
  if (hostname === 'localhost' || hostname === '127.0.0.1') {
    return 'qially'; // fallback for development
  }
  
  // Extract subdomain
  const parts = hostname.split('.');
  if (parts.length < 3) return 'qially'; // fallback for root domain
  
  const subdomain = parts[0].toLowerCase();
  
  // Skip common subdomains that shouldn't be treated as tenants
  const skipSubdomains = ['www', 'portal', 'app', 'api', 'cdn'];
  if (skipSubdomains.includes(subdomain)) {
    return 'qially';
  }
  
  return subdomain;
}

export function TenantProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<TenantState>({ loading: true });

  useEffect(() => {
    (async () => {
      try {
        const subdomain = getSubdomainFromHostname();
        const tenant = clients[subdomain];
        
        if (!tenant) {
          // Fallback to qially if subdomain not found
          const fallbackTenant = clients['qially'];
          setState({ 
            loading: false, 
            slug: 'qially', 
            orgId: fallbackTenant.orgId, 
            title: fallbackTenant.title 
          });
          return;
        }
        
        setState({ 
          loading: false, 
          slug: subdomain, 
          orgId: tenant.orgId, 
          title: tenant.title 
        });
        
      } catch (e: any) {
        setState({ loading: false, error: e?.message ?? "Tenant load failed" });
      }
    })();
  }, []);

  if (state.loading) return <div className="p-8 text-sm opacity-70">Loading tenant…</div>;
  if (state.error) return <div className="p-8 text-red-500">Oops: {state.error}</div>;
  return <TenantCtx.Provider value={state}>{children}</TenantCtx.Provider>;
}
