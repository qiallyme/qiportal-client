-- Knowledge Base Database Setup
-- Run this in your Supabase SQL Editor

-- 1. Create KB files table
CREATE TABLE IF NOT EXISTS kb_files (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  client_slug TEXT NOT NULL,
  path TEXT NOT NULL,
  title TEXT NOT NULL,
  tags TEXT[] DEFAULT '{}',
  visibility TEXT DEFAULT 'client',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(client_slug, path)
);

-- 2. Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_kb_files_client_slug ON kb_files(client_slug);
CREATE INDEX IF NOT EXISTS idx_kb_files_tags ON kb_files USING GIN(tags);

-- 3. Enable Row Level Security
ALTER TABLE kb_files ENABLE ROW LEVEL SECURITY;

-- 4. Create RLS policies
-- Users can view KB files for their client
CREATE POLICY "Users can view their client KB files" ON kb_files
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

-- Admins can manage all KB files
CREATE POLICY "Admins can manage all KB files" ON kb_files
  FOR ALL USING (
    'admin' IN (
      SELECT role FROM profiles 
      WHERE email = auth.jwt() ->> 'email'
    )
  );

-- 5. Update profiles table to include client_slug
-- Add client_slug column if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_name = 'profiles' AND column_name = 'client_slug') THEN
    ALTER TABLE profiles ADD COLUMN client_slug TEXT;
  END IF;
END $$;

-- 6. Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- 7. Create trigger for updated_at
CREATE TRIGGER update_kb_files_updated_at 
    BEFORE UPDATE ON kb_files 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- 8. Insert sample data for testing
INSERT INTO kb_files (client_slug, path, title, tags, visibility) VALUES
('zy', 'clients/zy/docs/getting-started.md', 'Getting Started', ARRAY['guide', 'onboarding'], 'client'),
('zy', 'clients/zy/docs/process-optimization.md', 'Process Optimization Guide', ARRAY['process', 'optimization'], 'client'),
('zy', 'clients/zy/docs/faq.md', 'Frequently Asked Questions', ARRAY['faq', 'help'], 'client')
ON CONFLICT (client_slug, path) DO NOTHING;

-- 9. Update existing profiles with client_slug (if needed)
UPDATE profiles 
SET client_slug = 'zy' 
WHERE email IN ('info@qially.me', 'client1@email.com') 
AND client_slug IS NULL;

-- 10. Create storage bucket for KB files (if not exists)
-- Note: This needs to be done in the Supabase dashboard under Storage
-- Bucket name: 'kb'
-- Public bucket: false
-- File size limit: 50MB
-- Allowed MIME types: text/markdown, text/plain, image/*, application/pdf
