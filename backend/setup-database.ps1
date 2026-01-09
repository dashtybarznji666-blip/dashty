# Database Setup Script
# This script will create the database and seed it with initial data

Write-Host "🗄️  Setting up database..." -ForegroundColor Cyan
Write-Host ""

# Check if .env exists
if (-not (Test-Path .env)) {
    Write-Host "❌ Error: .env file not found!" -ForegroundColor Red
    Write-Host "Please create a .env file first." -ForegroundColor Yellow
    exit 1
}

Write-Host "✓ .env file found" -ForegroundColor Green

# Step 1: Generate Prisma Client
Write-Host ""
Write-Host "Step 1: Generating Prisma Client..." -ForegroundColor Yellow
npm run prisma:generate
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Failed to generate Prisma Client" -ForegroundColor Red
    exit 1
}
Write-Host "✓ Prisma Client generated" -ForegroundColor Green

# Step 2: Run migrations
Write-Host ""
Write-Host "Step 2: Running database migrations..." -ForegroundColor Yellow
npm run prisma:migrate
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Failed to run migrations" -ForegroundColor Red
    exit 1
}
Write-Host "✓ Migrations completed" -ForegroundColor Green

# Step 3: Seed the database
Write-Host ""
Write-Host "Step 3: Seeding database with initial data..." -ForegroundColor Yellow
npm run prisma:seed
if ($LASTEXITCODE -ne 0) {
    Write-Host "⚠️  Warning: Seeding failed, but database is created" -ForegroundColor Yellow
} else {
    Write-Host "✓ Database seeded successfully" -ForegroundColor Green
}

Write-Host ""
Write-Host "✅ Database setup complete!" -ForegroundColor Green
Write-Host ""
Write-Host "You can now start the backend server with: npm run dev" -ForegroundColor Cyan
Write-Host ""
Write-Host "Default admin credentials:" -ForegroundColor Yellow
Write-Host "  Phone: 07509384229" -ForegroundColor White
Write-Host "  Password: DASHTYfalak2025@" -ForegroundColor White
Write-Host ""
