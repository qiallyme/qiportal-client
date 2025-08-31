#!/usr/bin/env python3
import sqlite3
import os

def create_database():
    db_path = "qiportal_local.db"
    
    # Remove existing database
    if os.path.exists(db_path):
        os.remove(db_path)
        print(f"Removed existing database: {db_path}")
    
    # Create new database
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()
    
    print("Creating database tables...")
    
    # Enable foreign keys
    cursor.execute("PRAGMA foreign_keys = ON")
    
    # Create profiles table
    cursor.execute("""
        CREATE TABLE profiles (
            id TEXT PRIMARY KEY,
            email TEXT UNIQUE NOT NULL,
            full_name TEXT,
            client_slug TEXT,
            role TEXT DEFAULT 'client_user',
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    """)
    print("✓ Created profiles table")
    
    # Create clients table
    cursor.execute("""
        CREATE TABLE clients (
            id TEXT PRIMARY KEY,
            slug TEXT UNIQUE NOT NULL,
            name TEXT NOT NULL,
            description TEXT,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    """)
    print("✓ Created clients table")
    
    # Create client_memberships table
    cursor.execute("""
        CREATE TABLE client_memberships (
            id TEXT PRIMARY KEY,
            user_id TEXT,
            client_id TEXT,
            role TEXT DEFAULT 'member',
            joined_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES profiles(id) ON DELETE CASCADE,
            FOREIGN KEY (client_id) REFERENCES clients(id) ON DELETE CASCADE,
            UNIQUE(user_id, client_id)
        )
    """)
    print("✓ Created client_memberships table")
    
    # Create conversations table
    cursor.execute("""
        CREATE TABLE conversations (
            id TEXT PRIMARY KEY,
            title TEXT NOT NULL,
            created_by TEXT,
            client_id TEXT,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (created_by) REFERENCES profiles(id) ON DELETE CASCADE,
            FOREIGN KEY (client_id) REFERENCES clients(id) ON DELETE CASCADE
        )
    """)
    print("✓ Created conversations table")
    
    # Create conversation_participants table
    cursor.execute("""
        CREATE TABLE conversation_participants (
            id TEXT PRIMARY KEY,
            conversation_id TEXT,
            user_id TEXT,
            joined_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            last_read_at DATETIME,
            FOREIGN KEY (conversation_id) REFERENCES conversations(id) ON DELETE CASCADE,
            FOREIGN KEY (user_id) REFERENCES profiles(id) ON DELETE CASCADE,
            UNIQUE(conversation_id, user_id)
        )
    """)
    print("✓ Created conversation_participants table")
    
    # Create messages table
    cursor.execute("""
        CREATE TABLE messages (
            id TEXT PRIMARY KEY,
            conversation_id TEXT,
            sender_id TEXT,
            content TEXT NOT NULL,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (conversation_id) REFERENCES conversations(id) ON DELETE CASCADE,
            FOREIGN KEY (sender_id) REFERENCES profiles(id) ON DELETE CASCADE
        )
    """)
    print("✓ Created messages table")
    
    # Create kb_files table
    cursor.execute("""
        CREATE TABLE kb_files (
            id TEXT PRIMARY KEY,
            client_slug TEXT NOT NULL,
            path TEXT NOT NULL,
            title TEXT NOT NULL,
            tags TEXT,
            visibility TEXT DEFAULT 'client',
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            UNIQUE(client_slug, path)
        )
    """)
    print("✓ Created kb_files table")
    
    # Insert sample data
    print("Inserting sample data...")
    
    # Insert clients
    cursor.execute("""
        INSERT INTO clients (id, slug, name, description) VALUES
        ('550e8400-e29b-41d4-a716-446655440100', 'zy', 'ZetaYpsilon Corp', 'Process optimization and consulting services'),
        ('550e8400-e29b-41d4-a716-446655440101', 'admin', 'System Administration', 'Internal system administration')
    """)
    print("✓ Inserted clients")
    
    # Insert profiles
    cursor.execute("""
        INSERT INTO profiles (id, email, full_name, client_slug, role) VALUES
        ('550e8400-e29b-41d4-a716-446655440001', 'admin@qially.me', 'Admin User', 'admin', 'admin'),
        ('550e8400-e29b-41d4-a716-446655440002', 'info@qially.me', 'Team Member', 'zy', 'team_member'),
        ('550e8400-e29b-41d4-a716-446655440003', 'client1@email.com', 'Client User', 'zy', 'client_user')
    """)
    print("✓ Inserted profiles")
    
    # Insert client memberships
    cursor.execute("""
        INSERT INTO client_memberships (id, user_id, client_id, role) VALUES
        ('550e8400-e29b-41d4-a716-446655440200', '550e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440101', 'owner'),
        ('550e8400-e29b-41d4-a716-446655440201', '550e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440100', 'admin'),
        ('550e8400-e29b-41d4-a716-446655440202', '550e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440100', 'member')
    """)
    print("✓ Inserted client memberships")
    
    # Insert conversations
    cursor.execute("""
        INSERT INTO conversations (id, title, created_by, client_id) VALUES
        ('550e8400-e29b-41d4-a716-446655440010', 'Process Optimization Updates', '550e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440100'),
        ('550e8400-e29b-41d4-a716-446655440011', 'General Discussion', '550e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440100')
    """)
    print("✓ Inserted conversations")
    
    # Insert conversation participants
    cursor.execute("""
        INSERT INTO conversation_participants (id, conversation_id, user_id) VALUES
        ('550e8400-e29b-41d4-a716-446655440020', '550e8400-e29b-41d4-a716-446655440010', '550e8400-e29b-41d4-a716-446655440001'),
        ('550e8400-e29b-41d4-a716-446655440021', '550e8400-e29b-41d4-a716-446655440010', '550e8400-e29b-41d4-a716-446655440002'),
        ('550e8400-e29b-41d4-a716-446655440022', '550e8400-e29b-41d4-a716-446655440011', '550e8400-e29b-41d4-a716-446655440002'),
        ('550e8400-e29b-41d4-a716-446655440023', '550e8400-e29b-41d4-a716-446655440011', '550e8400-e29b-41d4-a716-446655440003')
    """)
    print("✓ Inserted conversation participants")
    
    # Insert messages
    cursor.execute("""
        INSERT INTO messages (id, conversation_id, sender_id, content) VALUES
        ('550e8400-e29b-41d4-a716-446655440030', '550e8400-e29b-41d4-a716-446655440010', '550e8400-e29b-41d4-a716-446655440001', 'Hi! I wanted to update you on the process optimization project.'),
        ('550e8400-e29b-41d4-a716-446655440031', '550e8400-e29b-41d4-a716-446655440010', '550e8400-e29b-41d4-a716-446655440002', 'Great! What are the latest developments?'),
        ('550e8400-e29b-41d4-a716-446655440032', '550e8400-e29b-41d4-a716-446655440011', '550e8400-e29b-41d4-a716-446655440002', 'Welcome to the general discussion!'),
        ('550e8400-e29b-41d4-a716-446655440033', '550e8400-e29b-41d4-a716-446655440011', '550e8400-e29b-41d4-a716-446655440003', 'Thank you! Happy to be here.')
    """)
    print("✓ Inserted messages")
    
    # Insert KB files
    cursor.execute("""
        INSERT INTO kb_files (id, client_slug, path, title, tags, visibility) VALUES
        ('550e8400-e29b-41d4-a716-446655440040', 'zy', 'clients/zy/docs/getting-started.md', 'Getting Started', '["guide", "onboarding"]', 'client'),
        ('550e8400-e29b-41d4-a716-446655440041', 'zy', 'clients/zy/docs/process-optimization.md', 'Process Optimization Guide', '["process", "optimization"]', 'client'),
        ('550e8400-e29b-41d4-a716-446655440042', 'zy', 'clients/zy/docs/faq.md', 'Frequently Asked Questions', '["faq", "help"]', 'client')
    """)
    print("✓ Inserted KB files")
    
    # Commit and close
    conn.commit()
    conn.close()
    
    print(f"\n✅ Database created successfully: {db_path}")
    print(f"Database file size: {os.path.getsize(db_path)} bytes")

if __name__ == "__main__":
    create_database()
