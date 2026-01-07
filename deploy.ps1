# Full Project Deployment Script (PowerShell)

Write-Host "🚀 Starting full deployment..." -ForegroundColor Cyan
Write-Host ""

# Backend deployment
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Yellow
Write-Host "📦 BACKEND DEPLOYMENT" -ForegroundColor Yellow
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Yellow
Set-Location backend

if (-not (Test-Path .env)) {
    Write-Host "❌ Error: .env file not found!" -ForegroundColor Red
    exit 1
}

Write-Host "📦 Installing production dependencies..." -ForegroundColor Green
npm install --production

Write-Host "🔨 Building TypeScript..." -ForegroundColor Green
npm run build

Write-Host "🗄️  Running database migrations..." -ForegroundColor Green
npm run prisma:migrate:deploy

Write-Host "🔧 Generating Prisma Client..." -ForegroundColor Green
npm run prisma:generate

Set-Location ..

Write-Host ""
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Yellow
Write-Host "📦 FRONTEND DEPLOYMENT" -ForegroundColor Yellow
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Yellow
Set-Location frontend

Write-Host "📦 Installing dependencies..." -ForegroundColor Green
npm install

Write-Host "🔨 Building for production..." -ForegroundColor Green
npm run build

Set-Location ..

Write-Host ""
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Green
Write-Host "✅ DEPLOYMENT COMPLETE!" -ForegroundColor Green
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Green
Write-Host ""
Write-Host "📋 Next steps:" -ForegroundColor Cyan
Write-Host "  1. Verify environment variables are set correctly"
Write-Host "  2. Start backend: cd backend && npm start"
Write-Host "  3. Serve frontend: Serve files from frontend/dist/"
Write-Host "  4. Test health endpoint: http://localhost:5000/api/health"



