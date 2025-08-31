#!/usr/bin/env python3
"""
QiAlly Portal - Local Database Manager
A tool to manage the local SQLite database for data review and testing
"""

import sqlite3
import json
import os
import sys
from datetime import datetime
from typing import List, Dict, Any, Optional
import csv

class QiAllyDatabaseManager:
    def __init__(self, db_path: str = "qiportal_local.db"):
        """Initialize the database manager"""
        self.db_path = db_path
        self.conn = None
        
    def connect(self):
        """Connect to the SQLite database"""
        try:
            self.conn = sqlite3.connect(self.db_path)
            self.conn.row_factory = sqlite3.Row  # Enable dict-like access to rows
            print(f"✅ Connected to database: {self.db_path}")
            return True
        except Exception as e:
            print(f"❌ Error connecting to database: {e}")
            return False
    
    def disconnect(self):
        """Disconnect from the database"""
        if self.conn:
            self.conn.close()
            print("✅ Disconnected from database")
    
    def setup_database(self):
        """Set up the database with schema and sample data"""
        if not self.connect():
            return False
        
        try:
            # Read and execute the setup SQL
            setup_file = os.path.join(os.path.dirname(__file__), "simple_setup.sql")
            with open(setup_file, 'r') as f:
                sql_script = f.read()
            
            # Split and execute SQL statements
            statements = sql_script.split(';')
            for statement in statements:
                statement = statement.strip()
                if statement and not statement.startswith('--') and not statement.startswith('SELECT'):
                    try:
                        self.conn.execute(statement)
                        # Commit after each major section to ensure tables are created before indexes/triggers
                        if 'CREATE TABLE' in statement or 'INSERT OR IGNORE' in statement:
                            self.conn.commit()
                    except Exception as e:
                        print(f"Warning: Could not execute statement: {statement[:50]}... Error: {e}")
            
            self.conn.commit()
            print("✅ Database setup completed successfully!")
            return True
            
        except Exception as e:
            print(f"❌ Error setting up database: {e}")
            return False
        finally:
            self.disconnect()
    
    def import_from_supabase_csv(self, csv_file: str, table_name: str):
        """Import data from a CSV file exported from Supabase"""
        if not self.connect():
            return False
        
        try:
            with open(csv_file, 'r', encoding='utf-8') as f:
                reader = csv.DictReader(f)
                rows = list(reader)
            
            if not rows:
                print(f"❌ No data found in {csv_file}")
                return False
            
            # Get column names
            columns = list(rows[0].keys())
            placeholders = ', '.join(['?' for _ in columns])
            column_names = ', '.join(columns)
            
            # Insert data
            cursor = self.conn.cursor()
            for row in rows:
                values = [row[col] for col in columns]
                cursor.execute(f"INSERT OR REPLACE INTO {table_name} ({column_names}) VALUES ({placeholders})", values)
            
            self.conn.commit()
            print(f"✅ Imported {len(rows)} rows into {table_name}")
            return True
            
        except Exception as e:
            print(f"❌ Error importing data: {e}")
            return False
        finally:
            self.disconnect()
    
    def export_to_csv(self, table_name: str, output_file: str):
        """Export table data to CSV"""
        if not self.connect():
            return False
        
        try:
            cursor = self.conn.cursor()
            cursor.execute(f"SELECT * FROM {table_name}")
            rows = cursor.fetchall()
            
            if not rows:
                print(f"❌ No data found in table {table_name}")
                return False
            
            # Get column names
            columns = [description[0] for description in cursor.description]
            
            with open(output_file, 'w', newline='', encoding='utf-8') as f:
                writer = csv.writer(f)
                writer.writerow(columns)
                writer.writerows(rows)
            
            print(f"✅ Exported {len(rows)} rows from {table_name} to {output_file}")
            return True
            
        except Exception as e:
            print(f"❌ Error exporting data: {e}")
            return False
        finally:
            self.disconnect()
    
    def query_data(self, query: str) -> List[Dict[str, Any]]:
        """Execute a query and return results"""
        if not self.connect():
            return []
        
        try:
            cursor = self.conn.cursor()
            cursor.execute(query)
            rows = cursor.fetchall()
            
            # Convert to list of dictionaries
            results = []
            for row in rows:
                results.append(dict(row))
            
            return results
            
        except Exception as e:
            print(f"❌ Error executing query: {e}")
            return []
        finally:
            self.disconnect()
    
    def show_table_info(self, table_name: str):
        """Show information about a table"""
        if not self.connect():
            return
        
        try:
            cursor = self.conn.cursor()
            
            # Get table schema
            cursor.execute(f"PRAGMA table_info({table_name})")
            columns = cursor.fetchall()
            
            print(f"\n📋 Table: {table_name}")
            print("=" * 50)
            print(f"{'Column':<20} {'Type':<15} {'Nullable':<10} {'Primary Key':<12}")
            print("-" * 50)
            
            for col in columns:
                nullable = "NOT NULL" if col[3] else "NULL"
                primary = "YES" if col[5] else "NO"
                print(f"{col[1]:<20} {col[2]:<15} {nullable:<10} {primary:<12}")
            
            # Get row count
            cursor.execute(f"SELECT COUNT(*) FROM {table_name}")
            count = cursor.fetchone()[0]
            print(f"\n📊 Total rows: {count}")
            
        except Exception as e:
            print(f"❌ Error getting table info: {e}")
        finally:
            self.disconnect()
    
    def list_tables(self):
        """List all tables in the database"""
        if not self.connect():
            return
        
        try:
            cursor = self.conn.cursor()
            cursor.execute("SELECT name FROM sqlite_master WHERE type='table'")
            tables = cursor.fetchall()
            
            print("\n📋 Database Tables:")
            print("=" * 30)
            if tables:
                for table in tables:
                    print(f"• {table[0]}")
            else:
                print("No tables found")
            
        except Exception as e:
            print(f"❌ Error listing tables: {e}")
        finally:
            self.disconnect()
    
    def run_common_queries(self):
        """Run some common useful queries"""
        queries = {
            "User Profiles": "SELECT id, email, full_name, client_slug, role FROM profiles LIMIT 10",
            "Clients": "SELECT id, name, slug, description FROM clients",
            "Client Memberships": "SELECT p.email, cl.name as client_name, cm.role FROM client_memberships cm JOIN profiles p ON cm.user_id = p.id JOIN clients cl ON cm.client_id = cl.id LIMIT 10",
            "Conversation Summary": "SELECT * FROM conversation_summary LIMIT 5",
            "Recent Messages": "SELECT m.content, p.email as sender, c.title as conversation, cl.name as client FROM messages m JOIN profiles p ON m.sender_id = p.id JOIN conversations c ON m.conversation_id = c.id LEFT JOIN clients cl ON c.client_id = cl.id ORDER BY m.created_at DESC LIMIT 5",
            "KB Files by Client": "SELECT client_slug, COUNT(*) as file_count FROM kb_files GROUP BY client_slug",
            "User Conversations": "SELECT * FROM user_conversations LIMIT 5",
            "Client Summary": "SELECT * FROM client_summary",
            "User Activity": "SELECT email, full_name, role, message_count, conversation_count, client_count FROM user_activity_summary ORDER BY message_count DESC LIMIT 10"
        }
        
        for title, query in queries.items():
            print(f"\n🔍 {title}:")
            print("-" * 40)
            results = self.query_data(query)
            
            if results:
                # Print column headers
                headers = list(results[0].keys())
                header_str = " | ".join(f"{h:<20}" for h in headers)
                print(header_str)
                print("-" * len(header_str))
                
                # Print data rows
                for row in results:
                    row_str = " | ".join(f"{str(v):<20}" for v in row.values())
                    print(row_str)
            else:
                print("No data found")

def main():
    """Main function to handle command line arguments"""
    manager = QiAllyDatabaseManager()
    
    if len(sys.argv) < 2:
        print("""
🔧 QiAlly Portal - Local Database Manager

Usage:
  python database_manager.py <command> [options]

Commands:
  setup                    - Set up the database with schema and sample data
  list-tables              - List all tables in the database
  table-info <table>       - Show information about a specific table
  query <sql>              - Execute a custom SQL query
  common-queries           - Run common useful queries
  import-csv <file> <table> - Import data from CSV file to table
  export-csv <table> <file> - Export table data to CSV file

Examples:
  python database_manager.py setup
  python database_manager.py list-tables
  python database_manager.py table-info profiles
  python database_manager.py query "SELECT * FROM profiles LIMIT 5"
  python database_manager.py common-queries
  python database_manager.py import-csv supabase_export.csv profiles
  python database_manager.py export-csv profiles profiles_export.csv
        """)
        return
    
    command = sys.argv[1].lower()
    
    if command == "setup":
        manager.setup_database()
    
    elif command == "list-tables":
        manager.list_tables()
    
    elif command == "table-info" and len(sys.argv) > 2:
        manager.show_table_info(sys.argv[2])
    
    elif command == "query" and len(sys.argv) > 2:
        query = " ".join(sys.argv[2:])
        results = manager.query_data(query)
        if results:
            print(json.dumps(results, indent=2, default=str))
    
    elif command == "common-queries":
        manager.run_common_queries()
    
    elif command == "import-csv" and len(sys.argv) > 3:
        manager.import_from_supabase_csv(sys.argv[2], sys.argv[3])
    
    elif command == "export-csv" and len(sys.argv) > 3:
        manager.export_to_csv(sys.argv[2], sys.argv[3])
    
    else:
        print("❌ Invalid command or missing arguments. Use 'python database_manager.py' for help.")

if __name__ == "__main__":
    main()
