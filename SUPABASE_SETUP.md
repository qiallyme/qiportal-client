# Supabase Database Setup

## User Profiles Table

Run this SQL in your Supabase SQL Editor to create the user_profiles table:

```sql
-- Create user_profiles table
CREATE TABLE IF NOT EXISTS user_profiles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  first_name TEXT,
  last_name TEXT,
  company TEXT,
  phone TEXT,
  timezone TEXT DEFAULT 'America/New_York',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security (RLS)
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- Create policy to allow users to read their own profile
CREATE POLICY "Users can view own profile" ON user_profiles
  FOR SELECT USING (auth.uid() = user_id);

-- Create policy to allow users to insert their own profile
CREATE POLICY "Users can insert own profile" ON user_profiles
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Create policy to allow users to update their own profile
CREATE POLICY "Users can update own profile" ON user_profiles
  FOR UPDATE USING (auth.uid() = user_id);

-- Create policy to allow users to delete their own profile
CREATE POLICY "Users can delete own profile" ON user_profiles
  FOR DELETE USING (auth.uid() = user_id);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_user_profiles_email ON user_profiles(email);
CREATE INDEX IF NOT EXISTS idx_user_profiles_user_id ON user_profiles(user_id);
```

## How to Run This:

1. Go to your Supabase project dashboard
2. Navigate to **SQL Editor**
3. Paste the SQL above
4. Click **Run** to execute

## What This Creates:

- **user_profiles table** with all profile fields
- **Row Level Security (RLS)** to ensure users can only access their own data
- **Policies** for SELECT, INSERT, UPDATE, DELETE operations
- **Indexes** for better query performance

## Testing:

After creating the table, you can test the profile functionality:

1. Go to Settings page in your app
2. Update profile information
3. Click "Save Changes"
4. Refresh the page - data should persist
5. Log out and log back in - data should still be there
