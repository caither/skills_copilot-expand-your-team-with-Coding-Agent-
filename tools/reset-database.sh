#!/bin/bash
# Reset database script - Clears all data from MongoDB collections
# This allows init_database() to repopulate the database with initial data

echo "=========================================="
echo "Resetting Mergington High School Database"
echo "=========================================="
echo ""

# Check if MongoDB is running
if ! pgrep -x mongod > /dev/null; then
    echo "⚠️  Warning: MongoDB doesn't appear to be running."
    echo "   Please start MongoDB first with: .devcontainer/startMongoDB.sh"
    exit 1
fi

echo "📋 Dropping collections from 'mergington_high' database..."
echo ""

# Use Python to interact with MongoDB (using pymongo like the application does)
python3 << 'EOF'
from pymongo import MongoClient
import sys

try:
    # Connect to MongoDB
    client = MongoClient('mongodb://localhost:27017/')
    db = client['mergington_high']
    
    # Get counts before dropping
    activities_count = db.activities.count_documents({})
    teachers_count = db.teachers.count_documents({})
    
    print(f"🗑️  Dropping 'activities' collection... (had {activities_count} documents)")
    db.activities.drop()
    
    print(f"🗑️  Dropping 'teachers' collection... (had {teachers_count} documents)")
    db.teachers.drop()
    
    print("")
    print("✅ Database has been reset successfully!")
    print("")
    print("📊 Current database status:")
    print(f"   Activities count: {db.activities.count_documents({})}")
    print(f"   Teachers count: {db.teachers.count_documents({})}")
    
except Exception as e:
    print(f"❌ Error: {e}")
    sys.exit(1)
EOF

echo ""
echo "💡 Next step: Restart the application to trigger init_database()"
echo "   The database will be repopulated with initial data automatically."
