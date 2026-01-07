# Pre-Deployment Checklist (PowerShell)

Write-Host "🔍 Checking deployment readiness..." -ForegroundColor Cyan
Write-Host ""

$ERRORS = 0

# Check backend .env
Write-Host "Checking backend/.env..." -ForegroundColor Yellow
if (-not (Test-Path backend/.env)) {
    Write-Host "  ❌ backend/.env not found" -ForegroundColor Red
    $ERRORS++
} else {
    Write-Host "  ✅ backend/.env exists" -ForegroundColor Green
    
    $envContent = Get-Content backend/.env -Raw
    
    # Check critical variables
    if ($envContent -notmatch "NODE_ENV=production") {
        Write-Host "  ⚠️  NODE_ENV not set to 'production'" -ForegroundColor Yellow
    } else {
        Write-Host "  ✅ NODE_ENV=production" -ForegroundColor Green
    }
    
    if ($envContent -notmatch "DATABASE_URL=") {
        Write-Host "  ❌ DATABASE_URL not set" -ForegroundColor Red
        $ERRORS++
    } else {
        Write-Host "  ✅ DATABASE_URL is set" -ForegroundColor Green
    }
    
    if ($envContent -match "FRONTEND_URL=(.+)") {
        $frontendUrl = $matches[1].Trim()
        if ($frontendUrl -like "*localhost*") {
            Write-Host "  ⚠️  FRONTEND_URL still points to localhost" -ForegroundColor Yellow
        } else {
            Write-Host "  ✅ FRONTEND_URL is set to production URL" -ForegroundColor Green
        }
    } else {
        Write-Host "  ⚠️  FRONTEND_URL not set (will use default)" -ForegroundColor Yellow
    }
}

# Check frontend .env
Write-Host ""
Write-Host "Checking frontend/.env..." -ForegroundColor Yellow
if (-not (Test-Path frontend/.env)) {
    Write-Host "  ⚠️  frontend/.env not found (will use defaults)" -ForegroundColor Yellow
} else {
    Write-Host "  ✅ frontend/.env exists" -ForegroundColor Green
    
    $envContent = Get-Content frontend/.env -Raw
    if ($envContent -match "VITE_API_URL=(.+)") {
        $apiUrl = $matches[1].Trim()
        if ($apiUrl -like "*localhost*") {
            Write-Host "  ⚠️  VITE_API_URL still points to localhost" -ForegroundColor Yellow
        } else {
            Write-Host "  ✅ VITE_API_URL is set to production URL" -ForegroundColor Green
        }
    } else {
        Write-Host "  ⚠️  VITE_API_URL not set (will use default)" -ForegroundColor Yellow
    }
}

# Check builds
Write-Host ""
Write-Host "Checking builds..." -ForegroundColor Yellow
if (-not (Test-Path backend/dist)) {
    Write-Host "  ⚠️  backend/dist not found (run: cd backend && npm run build)" -ForegroundColor Yellow
} else {
    Write-Host "  ✅ backend/dist exists" -ForegroundColor Green
}

if (-not (Test-Path frontend/dist)) {
    Write-Host "  ⚠️  frontend/dist not found (run: cd frontend && npm run build)" -ForegroundColor Yellow
} else {
    Write-Host "  ✅ frontend/dist exists" -ForegroundColor Green
}

Write-Host ""
if ($ERRORS -eq 0) {
    Write-Host "✅ All critical checks passed!" -ForegroundColor Green
    Write-Host "🚀 Ready to deploy!" -ForegroundColor Green
} else {
    Write-Host "❌ Found $ERRORS critical error(s). Please fix before deploying." -ForegroundColor Red
    exit 1
}



