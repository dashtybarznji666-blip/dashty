# Script to regenerate Prisma client
# This fixes the issue where Prisma client is out of sync with the database schema

Write-Host "Regenerating Prisma Client..." -ForegroundColor Yellow
Write-Host ""

# Set the database URL
$env:DATABASE_URL = "file:./prisma/prisma/dev.db"

# Generate Prisma client
npx prisma generate

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "Prisma client regenerated successfully!" -ForegroundColor Green
    Write-Host "Please restart your backend server now." -ForegroundColor Yellow
} else {
    Write-Host ""
    Write-Host "Error: Failed to regenerate Prisma client" -ForegroundColor Red
    Write-Host "Make sure the backend server is stopped before running this script." -ForegroundColor Yellow
}

