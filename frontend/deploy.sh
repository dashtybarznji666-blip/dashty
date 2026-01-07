#!/bin/bash
# Frontend Deployment Script

echo "🚀 Starting frontend deployment..."

# Check if .env exists
if [ ! -f .env ]; then
    echo "⚠️  Warning: .env file not found. Using defaults."
fi

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Build for production
echo "🔨 Building for production..."
npm run build

echo "✅ Frontend deployment complete!"
echo "📁 Build output: frontend/dist/"
echo "📝 Next: Serve the dist/ folder with your web server"



