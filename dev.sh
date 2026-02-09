#!/bin/bash

# Start Local Development Environment
# This script ensures PostgreSQL is running before starting the Next.js dev server

echo "🚀 Starting GameOn Co. Development Environment"
echo ""

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
  echo "❌ Docker is not running!"
  echo ""
  echo "Please start Docker Desktop and try again."
  echo ""
  exit 1
fi

echo "✅ Docker is running"
echo ""

# Check if PostgreSQL container is running
if docker ps --format '{{.Names}}' | grep -q 'gameon_postgres'; then
  echo "✅ PostgreSQL is already running"
else
  echo "🔄 Starting PostgreSQL..."
  docker-compose up -d
  
  # Wait for PostgreSQL to be ready
  echo "⏳ Waiting for PostgreSQL to be ready..."
  sleep 3
  
  # Check if it's running now
  if docker ps --format '{{.Names}}' | grep -q 'gameon_postgres'; then
    echo "✅ PostgreSQL started successfully"
  else
    echo "❌ Failed to start PostgreSQL"
    echo ""
    echo "Run manually: docker-compose up -d"
    exit 1
  fi
fi

echo ""
echo "📊 Database Status:"
docker ps --filter "name=gameon_postgres" --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"
echo ""

# Run Prisma generate to ensure client is up to date
echo "🔄 Generating Prisma Client..."
npx prisma generate > /dev/null 2>&1
echo "✅ Prisma Client ready"
echo ""

# Start the development server
echo "🚀 Starting Next.js development server..."
echo ""
npm run dev
