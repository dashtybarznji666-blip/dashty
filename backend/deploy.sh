#!/bin/bash
# Backend Deployment Script

echo "🚀 Starting backend deployment..."

# Check if .env exists
if [ ! -f .env ]; then
    echo "❌ Error: .env file not found!"
    exit 1
fi

# Install production dependencies
echo "📦 Installing production dependencies..."
npm install --production

# Build TypeScript
echo "🔨 Building TypeScript..."
npm run build

# Run database migrations
echo "🗄️  Running database migrations..."
npm run prisma:migrate:deploy

# Generate Prisma Client
echo "🔧 Generating Prisma Client..."
npm run prisma:generate

echo "✅ Backend deployment complete!"
echo "📝 Next: Start the server with 'npm start' or use PM2"



