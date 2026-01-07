#!/bin/bash
# Full Project Deployment Script

echo "🚀 Starting full deployment..."
echo ""

# Backend deployment
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📦 BACKEND DEPLOYMENT"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
cd backend
bash deploy.sh
if [ $? -ne 0 ]; then
    echo "❌ Backend deployment failed!"
    exit 1
fi
cd ..

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📦 FRONTEND DEPLOYMENT"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
cd frontend
bash deploy.sh
if [ $? -ne 0 ]; then
    echo "❌ Frontend deployment failed!"
    exit 1
fi
cd ..

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "✅ DEPLOYMENT COMPLETE!"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "📋 Next steps:"
echo "  1. Verify environment variables are set correctly"
echo "  2. Start backend: cd backend && npm start"
echo "  3. Serve frontend: Serve files from frontend/dist/"
echo "  4. Test health endpoint: curl http://localhost:5000/api/health"



