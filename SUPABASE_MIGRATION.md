# Supabase Migration Guide

This document outlines the migration from Cloudflare Access to Supabase authentication for the QiAlly Portal.

## Changes Made

### 1. Dependencies Updated
- **Added**: `@supabase/supabase-js` - Supabase JavaScript client
- **Removed**: 
  - `@cloudflare/pages-plugin-cloudflare-access`
  - `jose` (JWT library)
  - `@cloudflare/workers-types`

### 2. New Files Created
- `src/lib/supabase.js` - Supabase client configuration
- `src/pages/Login.jsx` - New login page with email/password authentication

### 3. Files Updated

#### Authentication & Context
- `src/context/UserContext.jsx` - Updated to use Supabase auth with session management
- `src/components/ProtectedRoute.jsx` - Updated to work with Supabase authentication
- `src/pages/Logout.jsx` - Updated to use Supabase signOut
- `src/utils/auth.js` - Updated utility functions for Supabase

#### Components & Pages
- `src/components/Header.jsx` - Updated to use Supabase auth and remove hardcoded portal links
- `src/pages/Client.jsx` - Updated to use Supabase user context
- `src/pages/ClientDash.jsx` - Updated to use Supabase user context
- `src/pages/Home.jsx` - Updated to use React Router links instead of hardcoded portal URLs
- `src/components/SiteHeader.jsx` - Updated to use React Router links

#### API & Utilities
- `src/lib/api.js` - Updated to work with Supabase and added helper functions
- `src/App.jsx` - Simplified routing, added Login route, removed host-aware logic

#### Configuration
- `package.json` - Updated dependencies
- `README.md` - Updated documentation to reflect Supabase usage

### 4. Files Removed
- `functions/api/me.js` - Cloudflare Function for user identity
- `functions/_middleware.js` - Cloudflare middleware
- `functions/[[path]].ts` - Cloudflare SPA routing

## Setup Instructions

### 1. Create Supabase Project
1. Go to [supabase.com](https://supabase.com) and create a new project
2. Note your project URL and anon key from the project settings

### 2. Environment Variables
Create a `.env` file in the project root:
```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 3. User Management
The role system is currently hardcoded in `src/context/UserContext.jsx`:
```javascript
const applyRole = (userEmail) => {
  const admins = ["admin@qially.me", "crice4485@gmail.com"];
  const clients = ["info@qially.me", "client1@email.com"];
  if (admins.includes(userEmail)) return "admin";
  if (clients.includes(userEmail)) return "client";
  return "guest";
};
```

### 4. Authentication Features
- **Email/Password Login**: Users can sign in with email and password
- **User Registration**: New users can create accounts
- **Password Reset**: Users can reset their passwords via email
- **Session Management**: Automatic session persistence and refresh
- **Role-Based Access**: Admin and client roles with different permissions

### 5. Deployment
The application is still optimized for Cloudflare Pages deployment:
1. Connect your GitHub repository to Cloudflare Pages
2. Set build command: `npm run build`
3. Set output directory: `dist`
4. Add environment variables in Cloudflare Pages settings

## Migration Benefits

### Advantages of Supabase
- **Simplified Setup**: No complex Cloudflare Access configuration required
- **Built-in Features**: Email/password auth, user management, password reset
- **Database Integration**: Easy to add database features in the future
- **Better Developer Experience**: More intuitive API and documentation
- **Cost Effective**: Free tier available for small projects

### Features Maintained
- Role-based access control
- Protected routes
- Session management
- User context throughout the application
- Responsive design and UI components

## Next Steps

1. **Set up Supabase project** and configure environment variables
2. **Test authentication flow** locally
3. **Deploy to Cloudflare Pages** with environment variables
4. **Consider adding database features** using Supabase's database capabilities
5. **Implement user management** in Supabase dashboard for easier role management

## Troubleshooting

### Common Issues
1. **Environment variables not loaded**: Ensure `.env` file is in project root
2. **Authentication not working**: Check Supabase project URL and anon key
3. **Build errors**: Run `npm install` to ensure all dependencies are installed
4. **CORS issues**: Configure Supabase project settings for your domain

### Support
- [Supabase Documentation](https://supabase.com/docs)
- [Supabase Auth Guide](https://supabase.com/docs/guides/auth)
- [React Integration](https://supabase.com/docs/guides/auth/auth-helpers/react)
