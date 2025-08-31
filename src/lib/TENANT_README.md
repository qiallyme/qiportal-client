# Multi-Tenant Routing System for QiPortals

This system provides secure, subdomain-based tenant isolation for your QiPortals Cloudflare Pages app. Each client gets their own subdomain (e.g., `builtbyrays.qially.com`) while sharing the same codebase and database.

## 🎯 Overview

### How It Works
- **Subdomain Detection**: Automatically extracts tenant from `window.location.hostname`
- **Access Validation**: Verifies user permissions for the current tenant
- **Data Isolation**: Filters all Supabase queries by tenant
- **Security**: Prevents cross-tenant data access

### Examples
- `builtbyrays.qially.com` → Tenant: `builtbyrays`
- `portal.qially.com` → Tenant: `qially` (default)
- `localhost:5173` → Tenant: `qially` (development)

## 🚀 Quick Start

### 1. Basic Usage in Components

```jsx
import { useTenant } from '../lib/tenant';
import { tenantKB } from '../lib/tenantApi';

function MyComponent() {
  const { tenant, access, loading, isAuthorized } = useTenant();
  
  if (loading) return <div>Loading...</div>;
  if (!isAuthorized) return <div>Access denied</div>;
  
  return (
    <div>
      <h1>Welcome to {tenant.slug}</h1>
      <p>Your role: {access.role}</p>
    </div>
  );
}
```

### 2. Protected Routes

```jsx
import TenantRouteGuard from '../components/TenantRouteGuard';

function App() {
  return (
    <Routes>
      <Route 
        path="/kb" 
        element={
          <TenantRouteGuard requireAuth={true} allowedRoles={['admin', 'client_user']}>
            <KnowledgeBase />
          </TenantRouteGuard>
        } 
      />
    </Routes>
  );
}
```

### 3. API Calls with Tenant Filtering

```jsx
import { tenantKB } from '../lib/tenantApi';

async function loadFiles() {
  try {
    // Automatically filtered by current tenant
    const files = await tenantKB.getFiles();
    console.log('Files for current tenant:', files);
  } catch (error) {
    console.error('Access denied or error:', error);
  }
}
```

## 📁 File Structure

```
src/lib/
├── tenant.js          # Core tenant utilities
├── tenantApi.js       # Tenant-aware API wrappers
└── TENANT_README.md   # This file

src/components/
├── TenantRouteGuard.jsx  # Route protection component
└── TenantKB.jsx         # Example tenant-aware component
```

## 🔧 Core Functions

### Tenant Detection

```javascript
import { getCurrentTenant, extractTenantFromHostname } from '../lib/tenant';

// Get full tenant context
const tenant = getCurrentTenant();
// Returns: { slug: 'builtbyrays', isDefault: false, hostname: 'builtbyrays.qially.com' }

// Extract just the slug
const slug = extractTenantFromHostname();
// Returns: 'builtbyrays'
```

### Access Validation

```javascript
import { validateTenantAccess } from '../lib/tenant';

const access = await validateTenantAccess('builtbyrays');
// Returns: { authorized: true, role: 'client_user', clientSlug: 'builtbyrays' }
```

### Tenant-Aware Queries

```javascript
import { getTenantQuery } from '../lib/tenant';

// Automatically filters by current tenant
const query = getTenantQuery('kb_files');
const { data } = await query.select('*');
```

## 🛡️ Security Features

### 1. Automatic Data Filtering
All API calls are automatically filtered by tenant:

```javascript
// This automatically adds WHERE client_slug = 'builtbyrays'
const files = await tenantKB.getFiles();
```

### 2. Access Validation
Every request validates user permissions:

```javascript
// Checks if user can access this tenant
const access = await validateTenantAccess(tenantSlug);
if (!access.authorized) {
  throw new Error('Access denied');
}
```

### 3. Role-Based Access
Control access by user roles:

```jsx
<TenantRouteGuard allowedRoles={['admin', 'team_member']}>
  <AdminPanel />
</TenantRouteGuard>
```

## 📊 Database Schema Requirements

Your Supabase tables need these columns for tenant isolation:

### Required Tables

```sql
-- Users table with tenant association
CREATE TABLE profiles (
  id UUID PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  client_slug TEXT NOT NULL,  -- Links user to tenant
  role TEXT DEFAULT 'client_user',
  -- ... other fields
);

-- Knowledge base files
CREATE TABLE kb_files (
  id UUID PRIMARY KEY,
  client_slug TEXT NOT NULL,  -- Tenant isolation
  path TEXT NOT NULL,
  title TEXT NOT NULL,
  -- ... other fields
);

-- Conversations
CREATE TABLE conversations (
  id UUID PRIMARY KEY,
  client_id TEXT NOT NULL,    -- Tenant isolation
  title TEXT NOT NULL,
  -- ... other fields
);

-- Client memberships (for multi-tenant users)
CREATE TABLE client_memberships (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES profiles(id),
  client_id TEXT NOT NULL,    -- Tenant association
  role TEXT DEFAULT 'member',
  -- ... other fields
);
```

### Row Level Security (RLS) Policies

```sql
-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE kb_files ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;

-- Example RLS policy for kb_files
CREATE POLICY "Users can view their tenant KB files" ON kb_files
  FOR SELECT USING (
    client_slug IN (
      SELECT client_slug FROM profiles 
      WHERE email = auth.jwt() ->> 'email'
    )
    OR 
    'admin' IN (
      SELECT role FROM profiles 
      WHERE email = auth.jwt() ->> 'email'
    )
  );
```

## 🔄 API Reference

### Core Tenant Functions

```javascript
// Extract tenant from hostname
extractTenantFromHostname() → string

// Get full tenant context
getCurrentTenant() → { slug, isDefault, hostname, url }

// Validate user access to tenant
validateTenantAccess(tenantSlug) → Promise<{ authorized, role, clientSlug }>

// Create tenant-aware Supabase client
createTenantClient(tenantSlug?) → SupabaseClient

// Redirect to tenant-specific URL
redirectToTenant(tenantSlug, path?) → void
```

### Tenant-Aware APIs

```javascript
// Knowledge Base
tenantKB.getFiles() → Promise<Array>
tenantKB.getFile(path) → Promise<Object>
tenantKB.searchFiles(query) → Promise<Array>
tenantKB.getFilesByTag(tag) → Promise<Array>

// Conversations
tenantConversations.getConversations() → Promise<Array>
tenantConversations.getConversation(id) → Promise<Object>
tenantConversations.createConversation(data) → Promise<Object>

// Messages
tenantMessages.getMessages(conversationId) → Promise<Array>
tenantMessages.sendMessage(data) → Promise<Object>

// Users
tenantUsers.getUsers() → Promise<Array>
tenantUsers.getCurrentUser() → Promise<Object>
tenantUsers.updateProfile(updates) → Promise<Object>

// Client/Organization
tenantClient.getInfo() → Promise<Object>
tenantClient.getMemberships() → Promise<Array>
```

### React Components

```jsx
// Route protection
<TenantRouteGuard requireAuth={true} allowedRoles={['admin']}>
  <Component />
</TenantRouteGuard>

// Conditional rendering
<TenantAccessCheck requireRole="admin">
  <AdminPanel />
</TenantAccessCheck>

// Hook for tenant context
const { tenant, access, loading, isAuthorized } = useTenant();
```

## 🚀 Migration Guide

### 1. Update Existing Components

**Before:**
```jsx
function KB() {
  const [files, setFiles] = useState([]);
  
  useEffect(() => {
    // Direct Supabase call - no tenant filtering
    supabase.from('kb_files').select('*').then(setFiles);
  }, []);
  
  return <div>...</div>;
}
```

**After:**
```jsx
import { tenantKB } from '../lib/tenantApi';
import TenantRouteGuard from '../components/TenantRouteGuard';

function KB() {
  const [files, setFiles] = useState([]);
  
  useEffect(() => {
    // Tenant-aware API call
    tenantKB.getFiles().then(setFiles);
  }, []);
  
  return <div>...</div>;
}

// Wrap with protection
export default function ProtectedKB() {
  return (
    <TenantRouteGuard requireAuth={true}>
      <KB />
    </TenantRouteGuard>
  );
}
```

### 2. Update API Calls

**Before:**
```javascript
const { data } = await supabase
  .from('kb_files')
  .select('*')
  .eq('client_slug', 'hardcoded-client');
```

**After:**
```javascript
const { data } = await tenantKB.getFiles();
// Automatically filtered by current tenant
```

### 3. Add Route Protection

**Before:**
```jsx
<Route path="/kb" element={<KB />} />
```

**After:**
```jsx
<Route 
  path="/kb" 
  element={
    <TenantRouteGuard requireAuth={true}>
      <KB />
    </TenantRouteGuard>
  } 
/>
```

## 🔧 Configuration

### Environment Variables

```env
# Add to your .env files
VITE_DEFAULT_TENANT=qially
VITE_ALLOWED_DOMAINS=qially.com,localhost,127.0.0.1
```

### Custom Domain Setup

1. **Cloudflare DNS**: Add CNAME records for each tenant
   ```
   builtbyrays.qially.com → your-app.pages.dev
   client2.qially.com → your-app.pages.dev
   ```

2. **Cloudflare Pages**: Configure custom domains
   - Go to Pages dashboard
   - Add custom domains for each tenant
   - Set up SSL certificates

3. **Supabase RLS**: Ensure policies are in place
   - Test with different user roles
   - Verify data isolation works

## 🧪 Testing

### Development Testing

```javascript
// Test tenant extraction
console.log(extractTenantFromHostname()); // Should return 'qially' on localhost

// Test access validation
const access = await validateTenantAccess('test-tenant');
console.log(access); // Should show access status

// Test API calls
const files = await tenantKB.getFiles();
console.log(files); // Should be filtered by tenant
```

### Production Testing

1. **Test each tenant subdomain**:
   - `builtbyrays.qially.com`
   - `client2.qially.com`
   - `portal.qially.com` (default)

2. **Test user permissions**:
   - Admin users should see all tenants
   - Client users should only see their tenant
   - Unauthorized users should be blocked

3. **Test data isolation**:
   - Verify users can't access other tenants' data
   - Check that API calls are properly filtered

## 🐛 Troubleshooting

### Common Issues

**1. "Access denied" errors**
- Check user's `client_slug` in profiles table
- Verify RLS policies are working
- Ensure user has proper role permissions

**2. Wrong tenant detected**
- Check `ALLOWED_DOMAINS` configuration
- Verify subdomain parsing logic
- Test with different hostnames

**3. API calls not filtered**
- Use `tenantKB.getFiles()` instead of direct Supabase calls
- Check that `getTenantQuery()` is being used
- Verify table has `client_slug` column

**4. Route protection not working**
- Ensure `TenantRouteGuard` wraps components
- Check `requireAuth` and `allowedRoles` props
- Verify authentication state

### Debug Mode

Enable debug logging in development:

```javascript
// Add to your component
{process.env.NODE_ENV === 'development' && (
  <div className="debug-info">
    <pre>{JSON.stringify({ tenant, access }, null, 2)}</pre>
  </div>
)}
```

## 📚 Examples

See `src/components/TenantKB.jsx` for a complete example of a tenant-aware component.

## 🔗 Related Files

- `src/lib/tenant.js` - Core tenant utilities
- `src/lib/tenantApi.js` - Tenant-aware API wrappers
- `src/components/TenantRouteGuard.jsx` - Route protection
- `src/components/TenantKB.jsx` - Example component
