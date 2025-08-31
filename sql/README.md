# QiAlly Portal - Local Database Setup

This directory contains everything you need to set up a local SQLite database that mirrors your Supabase PostgreSQL structure for data review, testing, and development.

## 📁 Files Overview

- **`local_database_setup.sql`** - Complete SQLite database schema and sample data
- **`database_manager.py`** - Python tool for managing the local database
- **`MESSAGES_DATABASE_SETUP.sql`** - Original Supabase messages system setup
- **`KB_DATABASE_SETUP.sql`** - Original Supabase knowledge base setup
- **`README.md`** - This file with instructions

## 🚀 Quick Start

### 1. Set up the Local Database

```bash
# Navigate to the sql directory
cd sql

# Set up the database with schema and sample data
python database_manager.py setup
```

This will create a `qiportal_local.db` file with all the necessary tables and sample data.

### 2. Explore the Database

```bash
# List all tables
python database_manager.py list-tables

# Show table information
python database_manager.py table-info profiles
python database_manager.py table-info clients
python database_manager.py table-info client_memberships
python database_manager.py table-info conversations
python database_manager.py table-info messages
python database_manager.py table-info kb_files

# Run common queries
python database_manager.py common-queries
```

### 3. Execute Custom Queries

```bash
# Query user profiles
python database_manager.py query "SELECT * FROM profiles WHERE role = 'admin'"

# Query conversations with participant count
python database_manager.py query "SELECT * FROM conversation_summary"

# Query recent messages
python database_manager.py query "SELECT m.content, p.email as sender FROM messages m JOIN profiles p ON m.sender_id = p.id ORDER BY m.created_at DESC LIMIT 10"
```

## 📊 Database Schema

The local database includes the following tables:

### Core Tables
- **`profiles`** - User profiles (mirrors Supabase auth.users + profiles)
- **`clients`** - Client organizations with slug, name, and description
- **`client_memberships`** - User memberships in client organizations with roles
- **`conversations`** - Chat conversations (linked to clients)
- **`conversation_participants`** - Users participating in conversations
- **`messages`** - Individual messages in conversations
- **`kb_files`** - Knowledge base files with client-specific access

### Views
- **`conversation_summary`** - Summary of conversations with participant and message counts
- **`user_conversations`** - Users and their conversations
- **`user_client_access`** - User access to clients and their roles
- **`client_summary`** - Client overview with member counts and activity
- **`user_activity_summary`** - User activity statistics
- **`kb_files_with_tags`** - KB files with tag analysis

## 🔄 Importing Data from Supabase

### Method 1: CSV Export/Import

1. **Export from Supabase:**
   - Go to your Supabase dashboard
   - Navigate to Table Editor
   - Select the table you want to export
   - Click "Export" and choose CSV format
   - Download the CSV file

2. **Import to Local Database:**
   ```bash
   python database_manager.py import-csv supabase_profiles_export.csv profiles
python database_manager.py import-csv supabase_clients_export.csv clients
python database_manager.py import-csv supabase_client_memberships_export.csv client_memberships
python database_manager.py import-csv supabase_conversations_export.csv conversations
python database_manager.py import-csv supabase_messages_export.csv messages
python database_manager.py import-csv supabase_kb_files_export.csv kb_files
   ```

### Method 2: Direct SQL Export

1. **Export from Supabase SQL Editor:**
   ```sql
   -- Export profiles
   COPY (SELECT * FROM profiles) TO '/tmp/profiles.csv' WITH CSV HEADER;
   
   -- Export conversations
   COPY (SELECT * FROM conversations) TO '/tmp/conversations.csv' WITH CSV HEADER;
   
   -- Export messages
   COPY (SELECT * FROM messages) TO '/tmp/messages.csv' WITH CSV HEADER;
   
   -- Export kb_files
   COPY (SELECT * FROM kb_files) TO '/tmp/kb_files.csv' WITH CSV HEADER;
   ```

2. **Import to Local Database:**
   ```bash
   python database_manager.py import-csv /tmp/profiles.csv profiles
   python database_manager.py import-csv /tmp/conversations.csv conversations
   python database_manager.py import-csv /tmp/messages.csv messages
   python database_manager.py import-csv /tmp/kb_files.csv kb_files
   ```

## 📤 Exporting Data

```bash
# Export table data to CSV
python database_manager.py export-csv profiles profiles_export.csv
python database_manager.py export-csv clients clients_export.csv
python database_manager.py export-csv client_memberships client_memberships_export.csv
python database_manager.py export-csv conversations conversations_export.csv
python database_manager.py export-csv messages messages_export.csv
python database_manager.py export-csv kb_files kb_files_export.csv
```

## 🔍 Useful Queries

### User Analysis
```sql
-- All users by role
SELECT role, COUNT(*) as count FROM profiles GROUP BY role;

-- Users by client
SELECT client_slug, COUNT(*) as count FROM profiles GROUP BY client_slug;

-- Recent user activity
SELECT p.email, COUNT(m.id) as message_count 
FROM profiles p 
LEFT JOIN messages m ON p.id = m.sender_id 
GROUP BY p.id, p.email 
ORDER BY message_count DESC;

-- User client memberships
SELECT p.email, cl.name as client_name, cm.role as membership_role
FROM profiles p
JOIN client_memberships cm ON p.id = cm.user_id
JOIN clients cl ON cm.client_id = cl.id
ORDER BY p.email, cl.name;
```

### Client Analysis
```sql
-- Client overview with member counts
SELECT cl.name, cl.slug, COUNT(cm.user_id) as member_count
FROM clients cl
LEFT JOIN client_memberships cm ON cl.id = cm.client_id
GROUP BY cl.id, cl.name, cl.slug;

-- Client memberships by role
SELECT cl.name, cm.role, COUNT(*) as count
FROM clients cl
JOIN client_memberships cm ON cl.id = cm.client_id
GROUP BY cl.id, cl.name, cm.role;

-- Client activity (conversations and messages)
SELECT cl.name, 
       COUNT(DISTINCT c.id) as conversation_count,
       COUNT(m.id) as message_count
FROM clients cl
LEFT JOIN conversations c ON cl.id = c.client_id
LEFT JOIN messages m ON c.id = m.conversation_id
GROUP BY cl.id, cl.name;
```

### Conversation Analysis
```sql
-- Most active conversations
SELECT c.title, COUNT(m.id) as message_count, COUNT(DISTINCT cp.user_id) as participants
FROM conversations c
LEFT JOIN messages m ON c.id = m.conversation_id
LEFT JOIN conversation_participants cp ON c.id = cp.conversation_id
GROUP BY c.id, c.title
ORDER BY message_count DESC;

-- Conversation participants
SELECT c.title, p.email, cp.joined_at
FROM conversations c
JOIN conversation_participants cp ON c.id = cp.conversation_id
JOIN profiles p ON cp.user_id = p.id
ORDER BY c.title, cp.joined_at;
```

### Knowledge Base Analysis
```sql
-- KB files by client
SELECT client_slug, COUNT(*) as file_count 
FROM kb_files 
GROUP BY client_slug;

-- KB files by visibility
SELECT visibility, COUNT(*) as count 
FROM kb_files 
GROUP BY visibility;

-- KB files with specific tags
SELECT title, tags 
FROM kb_files 
WHERE tags LIKE '%guide%' OR tags LIKE '%faq%';
```

## 🛠️ Database Management

### Reset Database
```bash
# Delete the database file and recreate
rm qiportal_local.db
python database_manager.py setup
```

### Backup Database
```bash
# Copy the database file
cp qiportal_local.db qiportal_local_backup.db
```

### View Database File Info
```bash
# Check database file size
ls -lh qiportal_local.db

# Check database integrity (using sqlite3 command line tool)
sqlite3 qiportal_local.db "PRAGMA integrity_check;"
```

## 🔧 Advanced Usage

### Using SQLite Command Line Tool
```bash
# Open database in SQLite CLI
sqlite3 qiportal_local.db

# Some useful SQLite commands:
.tables                    -- List all tables
.schema profiles           -- Show table schema
.headers on               -- Enable column headers
.mode csv                 -- Set output mode to CSV
.output export.csv        -- Redirect output to file
SELECT * FROM profiles;   -- Query data
.quit                     -- Exit
```

### Python Scripting
```python
import sqlite3

# Connect to database
conn = sqlite3.connect('qiportal_local.db')
cursor = conn.cursor()

# Execute queries
cursor.execute("SELECT * FROM profiles WHERE role = 'admin'")
admins = cursor.fetchall()

# Close connection
conn.close()
```

## 🐛 Troubleshooting

### Common Issues

1. **Permission Error:**
   ```bash
   # Make sure you have write permissions in the directory
   chmod 755 sql/
   ```

2. **Python Not Found:**
   ```bash
   # Use python3 instead
   python3 database_manager.py setup
   ```

3. **Database Locked:**
   ```bash
   # Make sure no other process is using the database
   # Close any open database viewers or connections
   ```

4. **Import Errors:**
   - Check CSV file format (should have headers)
   - Ensure column names match table schema
   - Verify data types are compatible

### Getting Help

- Check the database file exists: `ls -la qiportal_local.db`
- Verify table structure: `python database_manager.py table-info <table_name>`
- Test a simple query: `python database_manager.py query "SELECT COUNT(*) FROM profiles"`

## 📝 Notes

- The local database uses SQLite, which is different from PostgreSQL (Supabase)
- Some PostgreSQL-specific features are not available in SQLite
- UUIDs are stored as TEXT in SQLite for compatibility
- JSON arrays are stored as TEXT and can be queried with LIKE
- Timestamps use SQLite's DATETIME format instead of PostgreSQL's TIMESTAMP WITH TIME ZONE

## 🔗 Related Files

- **`../SEED_FILE.md`** - Project overview and architecture
- **`../package.json`** - Project dependencies
- **`../src/`** - Application source code
