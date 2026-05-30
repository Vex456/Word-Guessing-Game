#!/bin/bash

# Word Arena Setup Script
# This script helps you set up and run the Word Arena game

echo "🎮 Word Arena - Setup Script"
echo "============================"
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js v18 or higher."
    echo "   Download from: https://nodejs.org/"
    exit 1
fi

echo "✅ Node.js version: $(node -v)"

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed."
    exit 1
fi

echo "✅ npm version: $(npm -v)"
echo ""

# Install root dependencies
echo "📦 Installing root dependencies..."
npm install --legacy-peer-deps
echo ""

# Install API dependencies
echo "📦 Installing API dependencies..."
cd apps/api
npm install --legacy-peer-deps
cd ../..
echo ""

# Install Web dependencies
echo "📦 Installing Web dependencies..."
cd apps/web
npm install --legacy-peer-deps
cd ../..
echo ""

# Create .env files if they don't exist
if [ ! -f apps/api/.env ]; then
    echo "📝 Creating API .env file..."
    cp apps/api/.env.example apps/api/.env
    echo "   ⚠️  Please update DATABASE_URL in apps/api/.env with your PostgreSQL credentials"
fi

if [ ! -f apps/web/.env ]; then
    echo "📝 Creating Web .env file..."
    cp apps/web/.env.example apps/web/.env
fi

echo ""
echo "==================================="
echo "✅ Setup Complete!"
echo "==================================="
echo ""
echo "📋 Next Steps:"
echo ""
echo "1. Update your PostgreSQL connection string in apps/api/.env:"
echo "   DATABASE_URL=\"postgresql://postgres:YOUR_PASSWORD@localhost:5432/wordarena\""
echo ""
echo "2. Create the database (if using PostgreSQL):"
echo "   createdb wordarena"
echo "   OR use pgAdmin to create a database named 'wordarena'"
echo ""
echo "3. Run Prisma migrations:"
echo "   cd apps/api"
echo "   npx prisma generate"
echo "   npx prisma migrate dev --name init"
echo ""
echo "4. Start the development servers:"
echo "   Option A - Both together:"
echo "     npm run dev"
echo ""
echo "   Option B - Separately:"
echo "     Terminal 1: cd apps/api && npm run dev"
echo "     Terminal 2: cd apps/web && npm run dev"
echo ""
echo "5. Open your browser to: http://localhost:3000"
echo ""
echo "🎮 Enjoy playing Word Arena!"
echo ""
