#!/usr/bin/env python3
import sqlite3
import os

def test_database():
    db_path = "qiportal_local.db"
    
    if not os.path.exists(db_path):
        print(f"Database file {db_path} does not exist!")
        return
    
    print(f"Database file size: {os.path.getsize(db_path)} bytes")
    
    try:
        conn = sqlite3.connect(db_path)
        cursor = conn.cursor()
        
        # List tables
        cursor.execute("SELECT name FROM sqlite_master WHERE type='table'")
        tables = cursor.fetchall()
        
        print(f"Tables found: {len(tables)}")
        for table in tables:
            print(f"  - {table[0]}")
        
        # Test each table
        for table in tables:
            table_name = table[0]
            try:
                cursor.execute(f"SELECT COUNT(*) FROM {table_name}")
                count = cursor.fetchone()[0]
                print(f"  {table_name}: {count} rows")
            except Exception as e:
                print(f"  {table_name}: Error - {e}")
        
        conn.close()
        
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    test_database()
