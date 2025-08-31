# Multi-Tenant Routing Setup Guide

This guide implements host-based multi-tenant routing for your QiPortals app using subdomains.

## 🎯 What Was Delivered

### 1. **Core Files Created**

- **`src/lib/tenant.ts`** - Hostname parsing and slug normalization
- **`src/lib/bootstrapOrg.ts`** - Organization and spaces loading
- **`src/contexts/TenantProvider.tsx`** - React context for tenant state
- **`src/pages/KbHome.tsx`** - Example tenant-aware KB page
- **`src/AppWithTenantProvider.tsx`** - App wrapped with tenant provider
- **`sql/add_org_slug_migration.sql`** - Database migration for org slugs

### 2. **Key Functions**

```typescript
// Extract tenant from hostname
getClientSlugFromHost() // builtbyrays.qially.com → "builtbyrays"

// Normalize aliases
normalizeSlug("zjk") // → "zaitullahk"

// Bootstrap tenant data
bootstrapOrg() // → { slug, org, spaces }

// React hook
useTenant() // → { loading, slug, org, spaces, error }
```

## 🚀 Setup Instructions

### Step 1: Run Database Migration

1. Go to your Supabase SQL Editor
2. Run the migration script: `sql/add_org_slug_migration.sql`
3. Verify orgs have slug values:
   ```sql
   SELECT id, name, slug FROM orgs ORDER BY name;
   ```

### Step 2: Update Your App Entry Point

Replace your current `src/main.tsx` or `src/App.tsx` with:

```tsx
import AppRoot from './AppWithTenantProvider';

// Use AppRoot instead of your current App component
```

### Step 3: Configure DNS (Production)

Add CNAME records in Cloudflare:
```
builtbyrays.qially.com → your-app.pages.dev
zjk.qially.com → your-app.pages.dev
rosalucas.qially.com → your-app.pages.dev
innovahire.qially.com → your-app.pages.dev
```

## 🧪 Test Plan

### Development Testing

1. **Test hostname parsing:**
   ```javascript
   // In browser console
   import { getClientSlugFromHost } from './src/lib/tenant';
   console.log(getClientSlugFromHost()); // Should return 'qially' on localhost
   ```

2. **Test alias resolution:**
   ```javascript
   import { normalizeSlug } from './src/lib/tenant';
   console.log(normalizeSlug('zjk')); // Should return 'zaitullahk'
   ```

3. **Test tenant loading:**
   - Visit `localhost:5173/kb`
   - Should show "qially — Knowledge Base" with spaces

### Production Testing

1. **Test each subdomain:**
   - `builtbyrays.qially.com/kb` → Shows BuiltByRays spaces
   - `zjk.qially.com/kb` → Shows ZaitullahK spaces (alias resolution)
   - `qially.com/kb` → Shows QiAlly spaces (fallback)

2. **Test security:**
   - Try accessing `hacker.qially.com` → Should show "Org not found" error
   - RLS ensures no cross-org data leakage

3. **Test error handling:**
   - Invalid subdomain → Shows error message
   - Network issues → Shows loading state

## 🔧 Configuration Options

### Alias Configuration

Add more aliases in `src/lib/tenant.ts`:

```typescript
const ALIASES: Record<string, string> = {
  zjk: "zaitullahk",
  innova: "innovahire",
  rays: "builtbyrays",
  // add more as needed
};
```

### Fallback Configuration

Change default org in `src/lib/tenant.ts`:

```typescript
if (parts.length < 3) return "qially"; // Change this to your default
```

## 🛡️ Security Features

### 1. **RLS Protection**
- All queries go through Supabase RLS policies
- Users can only see orgs they belong to
- No cross-tenant data access possible

### 2. **Hostname Validation**
- Only processes valid subdomains
- Falls back to default org for invalid hosts
- Case-insensitive slug matching

### 3. **Error Handling**
- Graceful fallbacks for missing orgs
- Clear error messages for debugging
- Loading states for better UX

## 📊 Database Schema

### Required Tables

```sql
-- Organizations
CREATE TABLE orgs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL, -- Added by migration
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Knowledge Base Spaces
CREATE TABLE kb_spaces (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id UUID REFERENCES orgs(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  slug TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### RLS Policies

```sql
-- Users can only see orgs they belong to
CREATE POLICY "Users can view their orgs" ON orgs
  FOR SELECT USING (
    id IN (
      SELECT org_id FROM org_memberships 
      WHERE user_id = auth.uid()
    )
  );

-- Users can only see spaces in their orgs
CREATE POLICY "Users can view their org spaces" ON kb_spaces
  FOR SELECT USING (
    org_id IN (
      SELECT org_id FROM org_memberships 
      WHERE user_id = auth.uid()
    )
  );
```

## 🔄 Migration from Previous System

If you were using the previous tenant system:

1. **Remove old files:**
   - `src/lib/tenant.js` (old version)
   - `src/lib/tenantApi.js`
   - `src/components/TenantRouteGuard.jsx`
   - `src/components/TenantKB.jsx`

2. **Update imports:**
   - Replace `useTenant()` from old system with new one
   - Update API calls to use direct Supabase queries with RLS

3. **Test thoroughly:**
   - Verify all routes work with new system
   - Check that data isolation still works
   - Test error scenarios

## 🐛 Troubleshooting

### Common Issues

1. **"Org not found" error:**
   - Check that orgs table has slug column
   - Verify slug values match subdomain names
   - Run the migration script again

2. **RLS blocking access:**
   - Check user has membership in the org
   - Verify RLS policies are enabled
   - Test with admin user first

3. **Alias not working:**
   - Check ALIASES object in tenant.ts
   - Verify alias mapping is correct
   - Test normalizeSlug function directly

### Debug Commands

```javascript
// Test hostname parsing
console.log(window.location.hostname);
console.log(getClientSlugFromHost());

// Test tenant loading
const { org, spaces } = useTenant();
console.log({ org, spaces });

// Test Supabase query
const { data, error } = await supabase
  .from('orgs')
  .select('*')
  .eq('slug', 'builtbyrays');
console.log({ data, error });
```

## 📈 Next Steps

1. **Add more aliases** as needed
2. **Implement space-specific KB pages**
3. **Add tenant switching for admins**
4. **Set up monitoring for tenant access**
5. **Add analytics per tenant**

## 🔗 Related Files

- `src/lib/tenant.ts` - Core tenant utilities
- `src/lib/bootstrapOrg.ts` - Organization loading
- `src/contexts/TenantProvider.tsx` - React context
- `src/pages/KbHome.tsx` - Example usage
- `sql/add_org_slug_migration.sql` - Database migration
