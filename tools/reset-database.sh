#!/bin/bash
set -e  # Exit immediately if any command fails

# Reset database script - Clears all data from MongoDB collections
# This allows init_database() to repopulate the database with initial data

# Configuration
MONGODB_HOST="mongodb://localhost:27017/"
DATABASE_NAME="mergington_high"
CONNECTION_TIMEOUT=5000  # milliseconds

echo "=========================================="
echo "Resetting Mergington High School Database"
echo "=========================================="
echo ""

# Check if MongoDB is running
if ! pgrep -x mongod > /dev/null; then
    echo "⚠️  Warning: MongoDB process not found."
    echo "   Checking if MongoDB is accessible on port 27017..."
    
    # Try to connect to verify MongoDB is accessible
    if ! timeout 5 python3 -c "from pymongo import MongoClient; MongoClient('${MONGODB_HOST}', serverSelectionTimeoutMS=${CONNECTION_TIMEOUT}).server_info()" 2>/dev/null; then
        echo "❌ Error: Cannot connect to MongoDB on localhost:27017"
        echo "   Please start MongoDB first with: .devcontainer/startMongoDB.sh"
        exit 1
    fi
    echo "✅ MongoDB is accessible on port 27017"
fi

echo "📋 Dropping collections from '${DATABASE_NAME}' database..."
echo ""

# Use Python to interact with MongoDB (using pymongo like the application does)
python3 << EOF
from pymongo import MongoClient
from pymongo.errors import ServerSelectionTimeoutError, ConnectionFailure
import sys

try:
    # Connect to MongoDB with timeout
    client = MongoClient('${MONGODB_HOST}', serverSelectionTimeoutMS=${CONNECTION_TIMEOUT})
    
    # Test the connection
    client.server_info()
    
    db = client['${DATABASE_NAME}']
    
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
    
except (ServerSelectionTimeoutError, ConnectionFailure) as e:
    print(f"❌ Error: Cannot connect to MongoDB - {e}")
    print("   Please ensure MongoDB is running.")
    sys.exit(1)
except Exception as e:
    print(f"❌ Error: {e}")
    sys.exit(1)
EOF

echo ""
echo "💡 Next step: Restart the application to trigger init_database()"
echo "   The database will be repopulated with initial data automatically."
