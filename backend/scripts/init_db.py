#!/usr/bin/env python3
"""Initialize database and create tables."""

import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from sqlalchemy import create_engine
from models import Base
from database import DATABASE_URL

def init_database():
    """Initialize database and create all tables."""
    print("Initializing database...")
    
    engine = create_engine(DATABASE_URL, echo=True)
    
    try:
        # Create all tables
        Base.metadata.create_all(bind=engine)
        print("✅ Database initialized successfully!")
        print("✅ All tables created!")
        
    except Exception as e:
        print(f"❌ Error initializing database: {e}")
        return False
    
    return True

if __name__ == "__main__":
    success = init_database()
    if not success:
        sys.exit(1)
    
    print("\n🚀 Database is ready!")
    print("Next step: Run 'python scripts/seed_data.py' to populate with sample data.")