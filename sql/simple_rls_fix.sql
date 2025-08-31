-- Simple fix: Temporarily disable RLS to test if that's the issue
ALTER TABLE profiles DISABLE ROW LEVEL SECURITY;
ALTER TABLE clients DISABLE ROW LEVEL SECURITY;
ALTER TABLE client_memberships DISABLE ROW LEVEL SECURITY;

-- If you want to re-enable later with simple policies:
-- ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
-- CREATE POLICY "Enable all for authenticated users" ON profiles FOR ALL USING (auth.role() = 'authenticated');
