#!/bin/bash
# Pre-Deployment Checklist

echo "🔍 Checking deployment readiness..."
echo ""

ERRORS=0

# Check backend .env
echo "Checking backend/.env..."
if [ ! -f backend/.env ]; then
    echo "  ❌ backend/.env not found"
    ERRORS=$((ERRORS + 1))
else
    echo "  ✅ backend/.env exists"
    
    # Check critical variables
    if ! grep -q "NODE_ENV=production" backend/.env; then
        echo "  ⚠️  NODE_ENV not set to 'production'"
    else
        echo "  ✅ NODE_ENV=production"
    fi
    
    if ! grep -q "DATABASE_URL=" backend/.env; then
        echo "  ❌ DATABASE_URL not set"
        ERRORS=$((ERRORS + 1))
    else
        echo "  ✅ DATABASE_URL is set"
    fi
    
    if ! grep -q "FRONTEND_URL=" backend/.env; then
        echo "  ⚠️  FRONTEND_URL not set (will use default)"
    else
        FRONTEND_URL=$(grep "FRONTEND_URL=" backend/.env | cut -d '=' -f2)
        if [[ $FRONTEND_URL == *"localhost"* ]]; then
            echo "  ⚠️  FRONTEND_URL still points to localhost"
        else
            echo "  ✅ FRONTEND_URL is set to production URL"
        fi
    fi
fi

# Check frontend .env
echo ""
echo "Checking frontend/.env..."
if [ ! -f frontend/.env ]; then
    echo "  ⚠️  frontend/.env not found (will use defaults)"
else
    echo "  ✅ frontend/.env exists"
    
    if ! grep -q "VITE_API_URL=" frontend/.env; then
        echo "  ⚠️  VITE_API_URL not set (will use default)"
    else
        API_URL=$(grep "VITE_API_URL=" frontend/.env | cut -d '=' -f2)
        if [[ $API_URL == *"localhost"* ]]; then
            echo "  ⚠️  VITE_API_URL still points to localhost"
        else
            echo "  ✅ VITE_API_URL is set to production URL"
        fi
    fi
fi

# Check builds
echo ""
echo "Checking builds..."
if [ ! -d backend/dist ]; then
    echo "  ⚠️  backend/dist not found (run: cd backend && npm run build)"
else
    echo "  ✅ backend/dist exists"
fi

if [ ! -d frontend/dist ]; then
    echo "  ⚠️  frontend/dist not found (run: cd frontend && npm run build)"
else
    echo "  ✅ frontend/dist exists"
fi

echo ""
if [ $ERRORS -eq 0 ]; then
    echo "✅ All critical checks passed!"
    echo "🚀 Ready to deploy!"
else
    echo "❌ Found $ERRORS critical error(s). Please fix before deploying."
    exit 1
fi



