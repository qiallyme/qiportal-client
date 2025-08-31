-- Messages/Chat System Database Setup
-- Run this in your Supabase SQL Editor

-- 1. Create conversations table
CREATE TABLE IF NOT EXISTS conversations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  created_by UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Create conversation participants table
CREATE TABLE IF NOT EXISTS conversation_participants (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  conversation_id UUID REFERENCES conversations(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_read_at TIMESTAMP WITH TIME ZONE,
  UNIQUE(conversation_id, user_id)
);

-- 3. Create messages table
CREATE TABLE IF NOT EXISTS messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  conversation_id UUID REFERENCES conversations(id) ON DELETE CASCADE,
  sender_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_conversation_participants_conversation_id ON conversation_participants(conversation_id);
CREATE INDEX IF NOT EXISTS idx_conversation_participants_user_id ON conversation_participants(user_id);
CREATE INDEX IF NOT EXISTS idx_messages_conversation_id ON messages(conversation_id);
CREATE INDEX IF NOT EXISTS idx_messages_sender_id ON messages(sender_id);
CREATE INDEX IF NOT EXISTS idx_messages_created_at ON messages(created_at);

-- 5. Enable Row Level Security
ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversation_participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- 6. Create RLS policies for conversations
-- Users can view conversations they participate in
CREATE POLICY "Users can view their conversations" ON conversations
  FOR SELECT USING (
    id IN (
      SELECT conversation_id FROM conversation_participants 
      WHERE user_id = auth.uid()
    )
  );

-- Users can create conversations
CREATE POLICY "Users can create conversations" ON conversations
  FOR INSERT WITH CHECK (auth.uid() = created_by);

-- Users can update conversations they created
CREATE POLICY "Users can update their conversations" ON conversations
  FOR UPDATE USING (auth.uid() = created_by);

-- 7. Create RLS policies for conversation_participants
-- Users can view participants of conversations they're in
CREATE POLICY "Users can view conversation participants" ON conversation_participants
  FOR SELECT USING (
    conversation_id IN (
      SELECT conversation_id FROM conversation_participants 
      WHERE user_id = auth.uid()
    )
  );

-- Users can join conversations (with some restrictions)
CREATE POLICY "Users can join conversations" ON conversation_participants
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Users can update their own participation
CREATE POLICY "Users can update their participation" ON conversation_participants
  FOR UPDATE USING (auth.uid() = user_id);

-- 8. Create RLS policies for messages
-- Users can view messages in conversations they participate in
CREATE POLICY "Users can view messages" ON messages
  FOR SELECT USING (
    conversation_id IN (
      SELECT conversation_id FROM conversation_participants 
      WHERE user_id = auth.uid()
    )
  );

-- Users can send messages to conversations they participate in
CREATE POLICY "Users can send messages" ON messages
  FOR INSERT WITH CHECK (
    auth.uid() = sender_id AND
    conversation_id IN (
      SELECT conversation_id FROM conversation_participants 
      WHERE user_id = auth.uid()
    )
  );

-- Users can update their own messages
CREATE POLICY "Users can update their messages" ON messages
  FOR UPDATE USING (auth.uid() = sender_id);

-- 9. Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- 10. Create triggers for updated_at
CREATE TRIGGER update_conversations_updated_at 
    BEFORE UPDATE ON conversations 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_messages_updated_at 
    BEFORE UPDATE ON messages 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- 11. Insert sample data for testing
-- Create a sample conversation
INSERT INTO conversations (title, created_by) VALUES
('Process Optimization Updates', (SELECT id FROM auth.users WHERE email = 'admin@qially.me' LIMIT 1))
ON CONFLICT DO NOTHING;

-- Add participants to the conversation
INSERT INTO conversation_participants (conversation_id, user_id)
SELECT 
  c.id,
  u.id
FROM conversations c
CROSS JOIN auth.users u
WHERE c.title = 'Process Optimization Updates'
  AND u.email IN ('admin@qially.me', 'info@qially.me')
ON CONFLICT DO NOTHING;

-- Add sample messages
INSERT INTO messages (conversation_id, sender_id, content)
SELECT 
  c.id,
  u.id,
  'Hi! I wanted to update you on the process optimization project.'
FROM conversations c
JOIN auth.users u ON u.email = 'admin@qially.me'
WHERE c.title = 'Process Optimization Updates'
ON CONFLICT DO NOTHING;

-- 12. Create view for easier querying
CREATE OR REPLACE VIEW conversation_summary AS
SELECT 
  c.id,
  c.title,
  c.created_at,
  c.updated_at,
  COUNT(DISTINCT cp.user_id) as participant_count,
  COUNT(m.id) as message_count,
  MAX(m.created_at) as last_message_at
FROM conversations c
LEFT JOIN conversation_participants cp ON c.id = cp.conversation_id
LEFT JOIN messages m ON c.id = m.conversation_id
GROUP BY c.id, c.title, c.created_at, c.updated_at;
