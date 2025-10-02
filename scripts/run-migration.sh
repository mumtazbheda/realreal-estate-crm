#!/bin/bash
set -e

echo "🚀 Running migration: 0001_schema.sql"
echo ""

# Load env variables
if [ -f "apps/miniapp/.env.local" ]; then
  export $(cat apps/miniapp/.env.local | grep -v '^#' | xargs)
else
  echo "❌ Missing apps/miniapp/.env.local"
  exit 1
fi

# Read the SQL file
SQL_CONTENT=$(cat supabase/migrations/0001_schema.sql)

echo "📝 Executing SQL migration..."
echo ""

# Use psql-style connection if available, otherwise show manual instructions
if command -v psql &> /dev/null; then
  echo "Using psql..."
  echo "$SQL_CONTENT" | psql "$NEXT_PUBLIC_SUPABASE_URL"
else
  echo "⚠️  psql not available"
  echo ""
  echo "Please run the migration manually:"
  echo "1. Go to: https://basrflycubhhgggqvogw.supabase.co/project/basrflycubhhgggqvogw/sql/new"
  echo "2. Copy the SQL from: supabase/migrations/0001_schema.sql"
  echo "3. Paste into SQL Editor"
  echo "4. Click 'Run'"
  echo ""
  echo "Or install psql: brew install postgresql"
  exit 0
fi
