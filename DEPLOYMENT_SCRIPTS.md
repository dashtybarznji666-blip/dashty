# Deployment Scripts Guide

This guide explains how to use the automated deployment scripts for the Shoe Store Management System.

## 📋 Available Scripts

### 1. Pre-Deployment Checklist
**Purpose:** Verify that your project is ready for deployment before running the deployment scripts.

**Linux/Mac:**
```bash
./check-deployment-ready.sh
```

**Windows:**
```powershell
.\check-deployment-ready.ps1
```

**What it checks:**
- ✅ Backend `.env` file exists
- ✅ `NODE_ENV=production` is set
- ✅ `DATABASE_URL` is configured
- ✅ `FRONTEND_URL` points to production (not localhost)
- ✅ Frontend `.env` file exists (optional)
- ✅ `VITE_API_URL` points to production (not localhost)
- ✅ Build folders exist

---

### 2. Full Deployment Script
**Purpose:** Deploy both backend and frontend in one command.

**Linux/Mac:**
```bash
./deploy.sh
```

**Windows:**
```powershell
.\deploy.ps1
```

**What it does:**
1. Backend:
   - Installs production dependencies
   - Builds TypeScript code
   - Runs database migrations
   - Generates Prisma Client

2. Frontend:
   - Installs dependencies
   - Builds production bundle

---

### 3. Individual Deployment Scripts

#### Backend Only
```bash
cd backend
bash deploy.sh
```

#### Frontend Only
```bash
cd frontend
bash deploy.sh
```

---

### 4. PM2 Process Manager

#### Quick Start
```bash
cd backend
bash pm2-start.sh
```

#### Using Ecosystem Config
```bash
cd backend
pm2 start ecosystem.config.js
```

#### Useful PM2 Commands
```bash
pm2 logs shoe-store-api      # View logs
pm2 monit                    # Monitor process
pm2 restart shoe-store-api   # Restart application
pm2 stop shoe-store-api      # Stop application
pm2 delete shoe-store-api    # Remove from PM2
pm2 save                     # Save current process list
pm2 startup                  # Configure PM2 to start on boot
```

---

## 🚀 Deployment Workflow

### Step 1: Pre-Deployment Check
```bash
./check-deployment-ready.sh
```

Fix any issues reported before proceeding.

### Step 2: Update Environment Variables

**Backend (`backend/.env`):**
```env
NODE_ENV=production
DATABASE_URL=postgresql://user:password@host:5432/database
FRONTEND_URL=https://yourdomain.com
JWT_SECRET=your-64-char-secret
JWT_REFRESH_SECRET=your-64-char-secret
```

**Frontend (`frontend/.env`):**
```env
VITE_API_URL=https://api.yourdomain.com/api
```

### Step 3: Run Deployment
```bash
./deploy.sh
```

### Step 4: Start Backend
```bash
# Option 1: Direct start
cd backend && npm start

# Option 2: PM2 (recommended for production)
cd backend && bash pm2-start.sh
```

### Step 5: Serve Frontend
Serve the `frontend/dist/` folder using:
- Nginx
- Apache
- Any static file server
- Or your hosting provider's static hosting

---

## 📝 Script Details

### `check-deployment-ready.sh` / `check-deployment-ready.ps1`
- Validates environment configuration
- Checks for required files
- Verifies production URLs
- Reports warnings and errors

### `deploy.sh` / `deploy.ps1`
- Orchestrates full deployment
- Runs backend and frontend deployments sequentially
- Stops on first error
- Provides clear status messages

### `backend/deploy.sh`
- Installs production dependencies only
- Compiles TypeScript to JavaScript
- Applies database migrations
- Generates Prisma Client

### `frontend/deploy.sh`
- Installs all dependencies
- Builds optimized production bundle
- Outputs to `frontend/dist/`

### `backend/pm2-start.sh`
- Starts backend with PM2
- Saves PM2 process list
- Provides helpful PM2 commands

### `backend/pm2-ecosystem.config.js`
- PM2 configuration file
- Defines process settings
- Configures logging
- Sets memory limits

---

## ⚠️ Important Notes

1. **Environment Variables:** Always update `.env` files before deployment
2. **Database Migrations:** `prisma:migrate:deploy` is used (not `migrate dev`)
3. **Production Builds:** Frontend must be rebuilt after changing `VITE_API_URL`
4. **PM2:** Install globally with `npm install -g pm2` before using PM2 scripts
5. **Permissions:** On Linux/Mac, scripts are executable. On Windows, use PowerShell scripts.

---

## 🔧 Troubleshooting

### Script fails with "command not found"
- Ensure you're in the correct directory
- Check that scripts have execute permissions (Linux/Mac): `chmod +x script.sh`

### PM2 not found
- Install PM2: `npm install -g pm2`
- Verify installation: `pm2 --version`

### Build errors
- Check Node.js version (requires 18+)
- Clear `node_modules` and reinstall: `rm -rf node_modules && npm install`
- Check TypeScript errors: `cd backend && npm run build`

### Database migration errors
- Verify `DATABASE_URL` is correct
- Ensure database is accessible
- Check database user permissions

---

## 📚 Next Steps

After successful deployment:
1. Test health endpoint: `curl http://localhost:5000/api/health`
2. Test frontend: Open in browser
3. Monitor logs: `pm2 logs shoe-store-api` or check `backend/logs/`
4. Set up reverse proxy (nginx) for production
5. Configure SSL/TLS certificates
6. Set up automated backups

---

**Happy Deploying! 🚀**



