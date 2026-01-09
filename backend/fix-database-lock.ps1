# Script to fix database lock issues and run migrations

Write-Host "🔧 Fixing database lock and running migrations..." -ForegroundColor Cyan
Write-Host ""

# Step 1: Stop any Node.js processes that might be locking the database
Write-Host "Step 1: Stopping Node.js processes..." -ForegroundColor Yellow
$nodeProcesses = Get-Process node -ErrorAction SilentlyContinue | Where-Object { $_.Path -like "*nodejs*" }
if ($nodeProcesses) {
    Write-Host "Found $($nodeProcesses.Count) Node.js process(es). Stopping..." -ForegroundColor Yellow
    $nodeProcesses | Stop-Process -Force
    Start-Sleep -Seconds 2
    Write-Host "✓ Node.js processes stopped" -ForegroundColor Green
} else {
    Write-Host "✓ No Node.js processes found" -ForegroundColor Green
}

# Step 2: Remove any SQLite lock files (WAL and SHM files)
Write-Host ""
Write-Host "Step 2: Cleaning up SQLite lock files..." -ForegroundColor Yellow
$lockFiles = @(
    "prisma\dev.db-wal",
    "prisma\dev.db-shm"
)

$removed = 0
foreach ($file in $lockFiles) {
    if (Test-Path $file) {
        Remove-Item $file -Force
        Write-Host "  Removed: $file" -ForegroundColor Gray
        $removed++
    }
}

if ($removed -gt 0) {
    Write-Host "✓ Removed $removed lock file(s)" -ForegroundColor Green
} else {
    Write-Host "✓ No lock files found" -ForegroundColor Green
}

# Step 3: Wait a moment for everything to settle
Write-Host ""
Write-Host "Step 3: Waiting for processes to fully close..." -ForegroundColor Yellow
Start-Sleep -Seconds 2
Write-Host "✓ Ready to run migrations" -ForegroundColor Green

# Step 4: Run migrations
Write-Host ""
Write-Host "Step 4: Running Prisma migrations..." -ForegroundColor Yellow
Write-Host ""
npm run prisma:migrate

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "✅ Migrations completed successfully!" -ForegroundColor Green
    Write-Host ""
    Write-Host "Next steps:" -ForegroundColor Cyan
    Write-Host "  1. Run: npm run prisma:seed (to seed initial data)" -ForegroundColor White
    Write-Host "  2. Start backend: npm run dev" -ForegroundColor White
} else {
    Write-Host ""
    Write-Host "❌ Migration failed. Please check the error above." -ForegroundColor Red
    Write-Host ""
    Write-Host "If the database is still locked, try:" -ForegroundColor Yellow
    Write-Host "  1. Close all terminals running the backend" -ForegroundColor White
    Write-Host "  2. Close any database tools (like DB Browser for SQLite)" -ForegroundColor White
    Write-Host "  3. Run this script again" -ForegroundColor White
}
