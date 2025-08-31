-- Local SQLite Database Setup for QiAlly Portal
-- This file creates a local SQLite database that mirrors the Supabase PostgreSQL structure
-- Use this for local data review, testing, and development

-- Enable foreign keys
PRAGMA foreign_keys = ON;

-- 1. Create profiles table (mirrors Supabase auth.users + profiles)
CREATE TABLE IF NOT EXISTS profiles (
    id TEXT PRIMARY KEY, -- UUID as TEXT for SQLite compatibility
    email TEXT UNIQUE NOT NULL,
    full_name TEXT,
    client_slug TEXT,
    role TEXT DEFAULT 'client_user' CHECK (role IN ('admin', 'team_member', 'client_user')),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 2. Create clients table (from Supabase setup)
CREATE TABLE IF NOT EXISTS clients (
    id TEXT PRIMARY KEY, -- UUID as TEXT
    slug TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    description TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 3. Create client_memberships table (from Supabase setup)
CREATE TABLE IF NOT EXISTS client_memberships (
    id TEXT PRIMARY KEY, -- UUID as TEXT
    user_id TEXT REFERENCES profiles(id) ON DELETE CASCADE,
    client_id TEXT REFERENCES clients(id) ON DELETE CASCADE,
    role TEXT DEFAULT 'member' CHECK (role IN ('owner', 'admin', 'member')),
    joined_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, client_id)
);

-- 4. Create conversations table
CREATE TABLE IF NOT EXISTS conversations (
    id TEXT PRIMARY KEY, -- UUID as TEXT
    title TEXT NOT NULL,
    created_by TEXT REFERENCES profiles(id) ON DELETE CASCADE,
    client_id TEXT REFERENCES clients(id) ON DELETE CASCADE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 5. Create conversation participants table
CREATE TABLE IF NOT EXISTS conversation_participants (
    id TEXT PRIMARY KEY, -- UUID as TEXT
    conversation_id TEXT REFERENCES conversations(id) ON DELETE CASCADE,
    user_id TEXT REFERENCES profiles(id) ON DELETE CASCADE,
    joined_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    last_read_at DATETIME,
    UNIQUE(conversation_id, user_id)
);

-- 6. Create messages table
CREATE TABLE IF NOT EXISTS messages (
    id TEXT PRIMARY KEY, -- UUID as TEXT
    conversation_id TEXT REFERENCES conversations(id) ON DELETE CASCADE,
    sender_id TEXT REFERENCES profiles(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 7. Create KB files table
CREATE TABLE IF NOT EXISTS kb_files (
    id TEXT PRIMARY KEY, -- UUID as TEXT
    client_slug TEXT NOT NULL,
    path TEXT NOT NULL,
    title TEXT NOT NULL,
    tags TEXT, -- JSON array as TEXT for SQLite
    visibility TEXT DEFAULT 'client',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(client_slug, path)
);

-- 8. Create indexes for better performance (after all tables are created)
-- Profiles indexes
CREATE INDEX IF NOT EXISTS idx_profiles_email ON profiles(email);
CREATE INDEX IF NOT EXISTS idx_profiles_client_slug ON profiles(client_slug);
CREATE INDEX IF NOT EXISTS idx_profiles_role ON profiles(role);

-- Clients indexes
CREATE INDEX IF NOT EXISTS idx_clients_slug ON clients(slug);
CREATE INDEX IF NOT EXISTS idx_clients_name ON clients(name);

-- Client memberships indexes
CREATE INDEX IF NOT EXISTS idx_client_memberships_user_id ON client_memberships(user_id);
CREATE INDEX IF NOT EXISTS idx_client_memberships_client_id ON client_memberships(client_id);
CREATE INDEX IF NOT EXISTS idx_client_memberships_role ON client_memberships(role);

-- Conversations indexes
CREATE INDEX IF NOT EXISTS idx_conversations_created_by ON conversations(created_by);
CREATE INDEX IF NOT EXISTS idx_conversations_client_id ON conversations(client_id);
CREATE INDEX IF NOT EXISTS idx_conversations_created_at ON conversations(created_at);

-- Conversation participants indexes
CREATE INDEX IF NOT EXISTS idx_conversation_participants_conversation_id ON conversation_participants(conversation_id);
CREATE INDEX IF NOT EXISTS idx_conversation_participants_user_id ON conversation_participants(user_id);

-- Messages indexes
CREATE INDEX IF NOT EXISTS idx_messages_conversation_id ON messages(conversation_id);
CREATE INDEX IF NOT EXISTS idx_messages_sender_id ON messages(sender_id);
CREATE INDEX IF NOT EXISTS idx_messages_created_at ON messages(created_at);

-- KB files indexes
CREATE INDEX IF NOT EXISTS idx_kb_files_client_slug ON kb_files(client_slug);
CREATE INDEX IF NOT EXISTS idx_kb_files_path ON kb_files(path);

-- 9. Create triggers for updated_at timestamps (after all tables are created)
-- Profiles trigger
CREATE TRIGGER IF NOT EXISTS update_profiles_updated_at 
    AFTER UPDATE ON profiles 
    FOR EACH ROW 
    BEGIN
        UPDATE profiles SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id;
    END;

-- Clients trigger
CREATE TRIGGER IF NOT EXISTS update_clients_updated_at 
    AFTER UPDATE ON clients 
    FOR EACH ROW 
    BEGIN
        UPDATE clients SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id;
    END;

-- Conversations trigger
CREATE TRIGGER IF NOT EXISTS update_conversations_updated_at 
    AFTER UPDATE ON conversations 
    FOR EACH ROW 
    BEGIN
        UPDATE conversations SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id;
    END;

-- Messages trigger
CREATE TRIGGER IF NOT EXISTS update_messages_updated_at 
    AFTER UPDATE ON messages 
    FOR EACH ROW 
    BEGIN
        UPDATE messages SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id;
    END;

-- KB files trigger
CREATE TRIGGER IF NOT EXISTS update_kb_files_updated_at 
    AFTER UPDATE ON kb_files 
    FOR EACH ROW 
    BEGIN
        UPDATE kb_files SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id;
    END;

-- 10. Insert sample data for testing
-- Sample clients
INSERT OR IGNORE INTO clients (id, slug, name, description) VALUES
('550e8400-e29b-41d4-a716-446655440100', 'zy', 'ZetaYpsilon Corp', 'Process optimization and consulting services'),
('550e8400-e29b-41d4-a716-446655440101', 'admin', 'System Administration', 'Internal system administration');

-- Sample profiles
INSERT OR IGNORE INTO profiles (id, email, full_name, client_slug, role) VALUES
('550e8400-e29b-41d4-a716-446655440001', 'admin@qially.me', 'Admin User', 'admin', 'admin'),
('550e8400-e29b-41d4-a716-446655440002', 'info@qially.me', 'Team Member', 'zy', 'team_member'),
('550e8400-e29b-41d4-a716-446655440003', 'client1@email.com', 'Client User', 'zy', 'client_user'),
('550e8400-e29b-41d4-a716-446655440004', 'john@zycorp.com', 'John Smith', 'zy', 'client_user'),
('550e8400-e29b-41d4-a716-446655440005', 'jane@zycorp.com', 'Jane Doe', 'zy', 'client_user');

-- Sample client memberships
INSERT OR IGNORE INTO client_memberships (id, user_id, client_id, role) VALUES
('550e8400-e29b-41d4-a716-446655440200', '550e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440101', 'owner'),
('550e8400-e29b-41d4-a716-446655440201', '550e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440100', 'admin'),
('550e8400-e29b-41d4-a716-446655440202', '550e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440100', 'member'),
('550e8400-e29b-41d4-a716-446655440203', '550e8400-e29b-41d4-a716-446655440004', '550e8400-e29b-41d4-a716-446655440100', 'member'),
('550e8400-e29b-41d4-a716-446655440204', '550e8400-e29b-41d4-a716-446655440005', '550e8400-e29b-41d4-a716-446655440100', 'member');

-- Sample conversations
INSERT OR IGNORE INTO conversations (id, title, created_by, client_id) VALUES
('550e8400-e29b-41d4-a716-446655440010', 'Process Optimization Updates', '550e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440100'),
('550e8400-e29b-41d4-a716-446655440011', 'General Discussion', '550e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440100'),
('550e8400-e29b-41d4-a716-446655440012', 'Project Alpha Status', '550e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440100');

-- Sample conversation participants
INSERT OR IGNORE INTO conversation_participants (id, conversation_id, user_id) VALUES
('550e8400-e29b-41d4-a716-446655440020', '550e8400-e29b-41d4-a716-446655440010', '550e8400-e29b-41d4-a716-446655440001'),
('550e8400-e29b-41d4-a716-446655440021', '550e8400-e29b-41d4-a716-446655440010', '550e8400-e29b-41d4-a716-446655440002'),
('550e8400-e29b-41d4-a716-446655440022', '550e8400-e29b-41d4-a716-446655440011', '550e8400-e29b-41d4-a716-446655440002'),
('550e8400-e29b-41d4-a716-446655440023', '550e8400-e29b-41d4-a716-446655440011', '550e8400-e29b-41d4-a716-446655440003'),
('550e8400-e29b-41d4-a716-446655440024', '550e8400-e29b-41d4-a716-446655440012', '550e8400-e29b-41d4-a716-446655440002'),
('550e8400-e29b-41d4-a716-446655440025', '550e8400-e29b-41d4-a716-446655440012', '550e8400-e29b-41d4-a716-446655440004');

-- Sample messages
INSERT OR IGNORE INTO messages (id, conversation_id, sender_id, content) VALUES
('550e8400-e29b-41d4-a716-446655440030', '550e8400-e29b-41d4-a716-446655440010', '550e8400-e29b-41d4-a716-446655440001', 'Hi! I wanted to update you on the process optimization project.'),
('550e8400-e29b-41d4-a716-446655440031', '550e8400-e29b-41d4-a716-446655440010', '550e8400-e29b-41d4-a716-446655440002', 'Great! What are the latest developments?'),
('550e8400-e29b-41d4-a716-446655440032', '550e8400-e29b-41d4-a716-446655440011', '550e8400-e29b-41d4-a716-446655440002', 'Welcome to the general discussion!'),
('550e8400-e29b-41d4-a716-446655440033', '550e8400-e29b-41d4-a716-446655440011', '550e8400-e29b-41d4-a716-446655440003', 'Thank you! Happy to be here.'),
('550e8400-e29b-41d4-a716-446655440034', '550e8400-e29b-41d4-a716-446655440012', '550e8400-e29b-41d4-a716-446655440002', 'Project Alpha is progressing well. We should have the first phase completed by next week.'),
('550e8400-e29b-41d4-a716-446655440035', '550e8400-e29b-41d4-a716-446655440012', '550e8400-e29b-41d4-a716-446655440004', 'Excellent! Looking forward to seeing the results.');

-- Sample KB files
INSERT OR IGNORE INTO kb_files (id, client_slug, path, title, tags, visibility) VALUES
('550e8400-e29b-41d4-a716-446655440040', 'zy', 'clients/zy/docs/getting-started.md', 'Getting Started', '["guide", "onboarding"]', 'client'),
('550e8400-e29b-41d4-a716-446655440041', 'zy', 'clients/zy/docs/process-optimization.md', 'Process Optimization Guide', '["process", "optimization"]', 'client'),
('550e8400-e29b-41d4-a716-446655440042', 'zy', 'clients/zy/docs/faq.md', 'Frequently Asked Questions', '["faq", "help"]', 'client'),
('550e8400-e29b-41d4-a716-446655440043', 'zy', 'clients/zy/docs/project-alpha.md', 'Project Alpha Documentation', '["project", "alpha"]', 'client'),
('550e8400-e29b-41d4-a716-446655440044', 'admin', 'admin/system-setup.md', 'System Setup Guide', '["admin", "setup"]', 'admin');

-- 11. Create views for easier querying
CREATE VIEW IF NOT EXISTS conversation_summary AS
SELECT 
    c.id,
    c.title,
    c.created_at,
    c.updated_at,
    cl.name as client_name,
    cl.slug as client_slug,
    COUNT(DISTINCT cp.user_id) as participant_count,
    COUNT(m.id) as message_count,
    MAX(m.created_at) as last_message_at
FROM conversations c
LEFT JOIN clients cl ON c.client_id = cl.id
LEFT JOIN conversation_participants cp ON c.id = cp.conversation_id
LEFT JOIN messages m ON c.id = m.conversation_id
GROUP BY c.id, c.title, c.created_at, c.updated_at, cl.name, cl.slug;

CREATE VIEW IF NOT EXISTS user_conversations AS
SELECT 
    p.id as user_id,
    p.email,
    p.full_name,
    c.id as conversation_id,
    c.title as conversation_title,
    cl.name as client_name,
    cp.joined_at,
    cp.last_read_at
FROM profiles p
JOIN conversation_participants cp ON p.id = cp.user_id
JOIN conversations c ON cp.conversation_id = c.id
LEFT JOIN clients cl ON c.client_id = cl.id;

CREATE VIEW IF NOT EXISTS user_client_access AS
SELECT 
    p.id as user_id,
    p.email,
    p.full_name,
    p.role as user_role,
    cl.id as client_id,
    cl.name as client_name,
    cl.slug as client_slug,
    cm.role as membership_role,
    cm.joined_at
FROM profiles p
JOIN client_memberships cm ON p.id = cm.user_id
JOIN clients cl ON cm.client_id = cl.id;

CREATE VIEW IF NOT EXISTS kb_files_with_tags AS
SELECT 
    id,
    client_slug,
    path,
    title,
    tags,
    visibility,
    created_at,
    updated_at,
    CASE 
        WHEN tags LIKE '%guide%' THEN 1 
        ELSE 0 
    END as is_guide,
    CASE 
        WHEN tags LIKE '%faq%' THEN 1 
        ELSE 0 
    END as is_faq,
    CASE 
        WHEN tags LIKE '%project%' THEN 1 
        ELSE 0 
    END as is_project
FROM kb_files;

-- 12. Create additional useful views
CREATE VIEW IF NOT EXISTS client_summary AS
SELECT 
    cl.id,
    cl.name,
    cl.slug,
    cl.description,
    COUNT(DISTINCT cm.user_id) as member_count,
    COUNT(DISTINCT c.id) as conversation_count,
    COUNT(DISTINCT kf.id) as kb_file_count,
    cl.created_at,
    cl.updated_at
FROM clients cl
LEFT JOIN client_memberships cm ON cl.id = cm.client_id
LEFT JOIN conversations c ON cl.id = c.client_id
LEFT JOIN kb_files kf ON cl.slug = kf.client_slug
GROUP BY cl.id, cl.name, cl.slug, cl.description, cl.created_at, cl.updated_at;

CREATE VIEW IF NOT EXISTS user_activity_summary AS
SELECT 
    p.id,
    p.email,
    p.full_name,
    p.role,
    COUNT(DISTINCT m.id) as message_count,
    COUNT(DISTINCT c.id) as conversation_count,
    COUNT(DISTINCT cm.client_id) as client_count,
    MAX(m.created_at) as last_activity
FROM profiles p
LEFT JOIN messages m ON p.id = m.sender_id
LEFT JOIN conversations c ON p.id = c.created_by
LEFT JOIN client_memberships cm ON p.id = cm.user_id
GROUP BY p.id, p.email, p.full_name, p.role;

-- Print success message
SELECT 'Local SQLite database setup completed successfully!' as status;
