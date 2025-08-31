# Supabase Setup Guide

## 🎯 Overview

This guide covers the complete setup and configuration of Supabase for the QiAlly Portal, including database setup, authentication, storage, and real-time features.

## 🚀 Initial Setup

### 1. Create Supabase Project

1. **Sign Up/Login**: Go to [supabase.com](https://supabase.com) and create an account
2. **New Project**: Click "New Project" and fill in the details:
   - **Name**: `qiportal-dev` (or your preferred name)
   - **Database Password**: Generate a strong password
   - **Region**: Choose closest to your users
   - **Pricing Plan**: Start with Free tier

3. **Wait for Setup**: Project creation takes 2-3 minutes

### 2. Get Project Credentials

Once created, go to **Settings > API** and note:
- **Project URL**: `https://your-project-id.supabase.co`
- **Anon Key**: Public key for client-side access
- **Service Role Key**: Private key for server-side operations

### 3. Environment Variables

Create `.env.local` file:
```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here
```

## 🗄️ Database Setup

### 1. Enable Extensions

Run in SQL Editor:
```sql
-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
```

### 2. Create Tables

#### Profiles Table
```sql
-- User profiles with role-based access
CREATE TABLE profiles (
    id UUID REFERENCES auth.users(id) PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    full_name TEXT,
    client_slug TEXT,
    role TEXT DEFAULT 'client_user' CHECK (role IN ('admin', 'team_member', 'client_user')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view own profile" ON profiles
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON profiles
    FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Admins can view all profiles" ON profiles
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE id = auth.uid() AND role = 'admin'
        )
    );
```

#### Knowledge Base Files Table
```sql
-- Knowledge base files with access control
CREATE TABLE kb_files (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    client_slug TEXT NOT NULL,
    path TEXT NOT NULL,
    title TEXT NOT NULL,
    tags TEXT[],
    visibility TEXT DEFAULT 'private' CHECK (visibility IN ('public', 'private')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE kb_files ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view their client KB files" ON kb_files
    FOR SELECT USING (
        client_slug = (SELECT client_slug FROM profiles WHERE id = auth.uid())
        OR 
        (SELECT role FROM profiles WHERE id = auth.uid()) = 'admin'
    );

CREATE POLICY "Admins can manage all KB files" ON kb_files
    FOR ALL USING ((SELECT role FROM profiles WHERE id = auth.uid()) = 'admin');
```

#### Messages Table
```sql
-- Secure messaging system
CREATE TABLE messages (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    sender_id UUID REFERENCES profiles(id) NOT NULL,
    recipient_id UUID REFERENCES profiles(id) NOT NULL,
    subject TEXT,
    content TEXT NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view their messages" ON messages
    FOR SELECT USING (
        sender_id = auth.uid() OR recipient_id = auth.uid()
    );

CREATE POLICY "Users can create messages" ON messages
    FOR INSERT WITH CHECK (sender_id = auth.uid());

CREATE POLICY "Users can update their messages" ON messages
    FOR UPDATE USING (sender_id = auth.uid());
```

### 3. Create Functions

#### Profile Creation Function
```sql
-- Function to create profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, email, full_name, client_slug, role)
    VALUES (
        NEW.id,
        NEW.email,
        NEW.raw_user_meta_data->>'full_name',
        NEW.raw_user_meta_data->>'client_slug',
        COALESCE(NEW.raw_user_meta_data->>'role', 'client_user')
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to call function on user signup
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
```

## 🔐 Authentication Setup

### 1. Configure Auth Settings

Go to **Authentication > Settings**:

#### General Settings
- **Site URL**: `http://localhost:5173` (development)
- **Redirect URLs**: Add your app URLs
- **JWT Expiry**: 3600 seconds (1 hour)

#### Email Templates
- **Confirm Signup**: Customize welcome email
- **Reset Password**: Customize reset email
- **Magic Link**: Customize magic link email

### 2. Enable Providers

#### Email Provider
- **Enable Email Signup**: ✅
- **Enable Email Confirmations**: ✅
- **Enable Secure Email Change**: ✅

#### Social Providers (Optional)
- **Google**: Configure OAuth credentials
- **GitHub**: Configure OAuth credentials
- **Microsoft**: Configure OAuth credentials

### 3. Configure SMTP (Optional)

For custom email sending:
- **SMTP Host**: Your SMTP server
- **SMTP Port**: 587 (TLS) or 465 (SSL)
- **SMTP User**: Your email username
- **SMTP Pass**: Your email password

## 📁 Storage Setup

### 1. Create Storage Buckets

Go to **Storage > Buckets** and create:

#### Documents Bucket
- **Name**: `documents`
- **Public**: ❌ (Private)
- **File Size Limit**: 50MB
- **Allowed MIME Types**: 
  - `application/pdf`
  - `application/msword`
  - `application/vnd.openxmlformats-officedocument.wordprocessingml.document`
  - `application/vnd.ms-excel`
  - `application/vnd.openxmlformats-officedocument.spreadsheetml.sheet`
  - `application/vnd.ms-powerpoint`
  - `application/vnd.openxmlformats-officedocument.presentationml.presentation`
  - `image/*`

#### Avatars Bucket
- **Name**: `avatars`
- **Public**: ✅ (Public)
- **File Size Limit**: 5MB
- **Allowed MIME Types**: `image/*`

### 2. Storage Policies

#### Documents Bucket Policies
```sql
-- Users can upload documents to their client folder
CREATE POLICY "Users can upload documents" ON storage.objects
    FOR INSERT WITH CHECK (
        bucket_id = 'documents' AND
        (storage.foldername(name))[1] = (
            SELECT client_slug FROM profiles WHERE id = auth.uid()
        )
    );

-- Users can view documents from their client
CREATE POLICY "Users can view documents" ON storage.objects
    FOR SELECT USING (
        bucket_id = 'documents' AND
        (storage.foldername(name))[1] = (
            SELECT client_slug FROM profiles WHERE id = auth.uid()
        )
    );

-- Users can update their own documents
CREATE POLICY "Users can update documents" ON storage.objects
    FOR UPDATE USING (
        bucket_id = 'documents' AND
        (storage.foldername(name))[1] = (
            SELECT client_slug FROM profiles WHERE id = auth.uid()
        )
    );

-- Users can delete their own documents
CREATE POLICY "Users can delete documents" ON storage.objects
    FOR DELETE USING (
        bucket_id = 'documents' AND
        (storage.foldername(name))[1] = (
            SELECT client_slug FROM profiles WHERE id = auth.uid()
        )
    );
```

#### Avatars Bucket Policies
```sql
-- Users can upload their own avatar
CREATE POLICY "Users can upload avatars" ON storage.objects
    FOR INSERT WITH CHECK (
        bucket_id = 'avatars' AND
        name = 'avatars/' || auth.uid()::text || '/*'
    );

-- Users can view all avatars
CREATE POLICY "Users can view avatars" ON storage.objects
    FOR SELECT USING (bucket_id = 'avatars');

-- Users can update their own avatar
CREATE POLICY "Users can update avatars" ON storage.objects
    FOR UPDATE USING (
        bucket_id = 'avatars' AND
        name = 'avatars/' || auth.uid()::text || '/*'
    );

-- Users can delete their own avatar
CREATE POLICY "Users can delete avatars" ON storage.objects
    FOR DELETE USING (
        bucket_id = 'avatars' AND
        name = 'avatars/' || auth.uid()::text || '/*'
    );
```

## 🔄 Real-time Setup

### 1. Enable Real-time

Go to **Database > Replication**:

#### Enable Replication
- **Source**: `public`
- **Tables**: Select tables for real-time updates
  - `messages`
  - `profiles`
  - `kb_files`

### 2. Configure Real-time Policies

```sql
-- Enable real-time for messages
ALTER PUBLICATION supabase_realtime ADD TABLE messages;

-- Enable real-time for profiles
ALTER PUBLICATION supabase_realtime ADD TABLE profiles;

-- Enable real-time for kb_files
ALTER PUBLICATION supabase_realtime ADD TABLE kb_files;
```

## 🚀 Migration Guide

### 1. Database Migrations

#### Create Migration Files
```bash
# Create migration directory
mkdir -p supabase/migrations

# Create initial migration
touch supabase/migrations/001_initial_schema.sql
```

#### Migration File Structure
```sql
-- Migration: 001_initial_schema.sql
-- Description: Initial database schema setup

-- Enable extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Create profiles table
CREATE TABLE profiles (
    id UUID REFERENCES auth.users(id) PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    full_name TEXT,
    client_slug TEXT,
    role TEXT DEFAULT 'client_user' CHECK (role IN ('admin', 'team_member', 'client_user')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view own profile" ON profiles
    FOR SELECT USING (auth.uid() = id);

-- ... additional tables and policies
```

### 2. Run Migrations

#### Using Supabase CLI
```bash
# Install Supabase CLI
npm install -g supabase

# Login to Supabase
supabase login

# Link project
supabase link --project-ref your-project-ref

# Run migrations
supabase db push
```

#### Using SQL Editor
1. Go to **SQL Editor** in Supabase Dashboard
2. Copy migration SQL
3. Run the SQL commands
4. Verify tables and policies are created

### 3. Seed Data

#### Create Seed File
```sql
-- Seed data for development
INSERT INTO profiles (id, email, full_name, client_slug, role)
VALUES 
    ('00000000-0000-0000-0000-000000000001', 'admin@qially.me', 'Admin User', 'zy', 'admin'),
    ('00000000-0000-0000-0000-000000000002', 'client1@example.com', 'Client User', 'client-a', 'client_user'),
    ('00000000-0000-0000-0000-000000000003', 'team1@example.com', 'Team Member', 'zy', 'team_member');
```

## 🔧 Configuration

### 1. Environment Variables

#### Development (.env.local)
```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here
```

#### Production (.env.production)
```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here
```

### 2. Client Configuration

#### Supabase Client Setup
```javascript
// src/lib/supabase.js
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
})
```

## 🔒 Security Best Practices

### 1. Row Level Security (RLS)
- Enable RLS on all tables
- Create specific policies for each operation
- Test policies thoroughly
- Use `auth.uid()` for user identification

### 2. API Security
- Never expose service role key in client
- Use anon key for client operations
- Validate all inputs
- Implement rate limiting

### 3. Storage Security
- Set appropriate bucket policies
- Validate file types and sizes
- Use signed URLs for private files
- Implement virus scanning (optional)

## 📊 Monitoring

### 1. Database Monitoring
- **Logs**: Check SQL logs for errors
- **Performance**: Monitor query performance
- **Storage**: Track database size and growth

### 2. Auth Monitoring
- **Signups**: Monitor user registration
- **Logins**: Track authentication attempts
- **Errors**: Review auth error logs

### 3. Storage Monitoring
- **Usage**: Track storage usage
- **Bandwidth**: Monitor transfer limits
- **Errors**: Review upload/download errors

## 🔍 Troubleshooting

### Common Issues

#### Authentication Issues
- **Invalid JWT**: Check token expiration
- **RLS Blocked**: Verify user permissions
- **Email Not Sent**: Check SMTP configuration

#### Database Issues
- **Connection Failed**: Verify project URL
- **Permission Denied**: Check RLS policies
- **Migration Failed**: Review SQL syntax

#### Storage Issues
- **Upload Failed**: Check file size and type
- **Access Denied**: Verify bucket policies
- **URL Expired**: Regenerate signed URL

### Debug Commands
```bash
# Check Supabase status
supabase status

# View logs
supabase logs

# Reset database
supabase db reset

# Generate types
supabase gen types typescript --local > types/supabase.ts
```

---

**Last Updated**: 2024-01-XX
**Status**: Production Ready
**Next Review**: 2024-01-XX
