#!/bin/bash
# PM2 Startup Script for Backend

echo "🚀 Starting backend with PM2..."

# Check if PM2 is installed
if ! command -v pm2 &> /dev/null; then
    echo "❌ PM2 is not installed. Install it with: npm install -g pm2"
    exit 1
fi

# Check if dist folder exists
if [ ! -d dist ]; then
    echo "❌ dist folder not found. Run 'npm run build' first."
    exit 1
fi

# Start the application
pm2 start dist/index.js --name shoe-store-api

# Save PM2 process list
pm2 save

echo "✅ Backend started with PM2!"
echo ""
echo "Useful PM2 commands:"
echo "  pm2 logs shoe-store-api    - View logs"
echo "  pm2 monit                   - Monitor process"
echo "  pm2 restart shoe-store-api - Restart application"
echo "  pm2 stop shoe-store-api    - Stop application"
echo "  pm2 delete shoe-store-api  - Remove from PM2"



