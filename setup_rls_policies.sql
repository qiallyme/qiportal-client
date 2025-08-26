-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE client_memberships ENABLE ROW LEVEL SECURITY;

-- Drop any existing policies to avoid conflicts
DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON profiles;
DROP POLICY IF EXISTS "Authenticated users can view clients" ON clients;
DROP POLICY IF EXISTS "Users can view own memberships" ON client_memberships;

-- Profiles table policies
CREATE POLICY "Users can view own profile" ON profiles
FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON profiles
FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON profiles
FOR INSERT WITH CHECK (auth.uid() = id);

-- Allow users to update specific fields in their profile
CREATE POLICY "Users can update profile fields" ON profiles
FOR UPDATE USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

-- Clients table policies (allow authenticated users to view)
CREATE POLICY "Authenticated users can view clients" ON clients
FOR SELECT USING (auth.role() = 'authenticated');

-- Client memberships policies
CREATE POLICY "Users can view own memberships" ON client_memberships
FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own memberships" ON client_memberships
FOR INSERT WITH CHECK (auth.uid() = user_id);
