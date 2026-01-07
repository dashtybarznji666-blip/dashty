# Deployment Todo List

Complete checklist for deploying the Shoe Store Management System to production.

---

## 🔴 Critical Tasks (Must Complete Before Deployment)

### Environment Configuration

- [ ] **Set NODE_ENV to production**
  - File: `backend/.env`
  - Change: `NODE_ENV=development` → `NODE_ENV=production`
  - Note: This enables production optimizations and stricter validation

- [ ] **Verify production DATABASE_URL**
  - File: `backend/.env`
  - Current: PostgreSQL connection string configured
  - Action: Verify the connection string is correct for production database
  - Format: `postgresql://user:password@host:5432/database`
  - Note: Ensure database is accessible from production server

- [ ] **Update FRONTEND_URL to production domain**
  - File: `backend/.env`
  - Current: `FRONTEND_URL=http://localhost:5173`
  - Change to: `FRONTEND_URL=https://yourdomain.com`
  - Note: This is critical for CORS configuration

- [ ] **Update VITE_API_URL to production API URL**
  - File: `frontend/.env`
  - Current: `VITE_API_URL=http://localhost:5000/api`
  - Change to: `VITE_API_URL=https://api.yourdomain.com/api`
  - Note: Must rebuild frontend after changing this variable

### Build & Migration

- [ ] **Rebuild frontend with production API URL**
  - Command: `cd frontend && npm run build`
  - Note: Required after updating `VITE_API_URL` in `.env`
  - Output: Production build in `frontend/dist/`

- [ ] **Run production database migrations**
  - Command: `cd backend && npm run prisma:migrate:deploy`
  - Note: Use `migrate:deploy` (not `migrate dev`) for production
  - Warning: This applies all pending migrations to production database

- [ ] **Build backend for production**
  - Command: `cd backend && npm run build`
  - Output: Compiled JavaScript in `backend/dist/`
  - Note: Ensure TypeScript compiles without errors

- [ ] **Test production backend build**
  - Command: `cd backend && npm start`
  - Verify: Server starts without errors
  - Check: Health endpoint responds at `/api/health`

---

## 🟡 Important Tasks (Should Complete)

### Security Review

- [ ] **Review and adjust JWT expiration times**
  - File: `backend/.env`
  - Current defaults: `JWT_EXPIRES_IN=7d`, `JWT_REFRESH_EXPIRES_IN=30d`
  - Action: Review if these values meet your security requirements
  - Note: Shorter expiration = more secure but requires more frequent logins

- [ ] **Verify CORS configuration works with production URLs**
  - File: `backend/src/index.ts`
  - Test: Ensure frontend can make API requests from production domain
  - Note: CORS is configured to validate against `FRONTEND_URL`

### Testing

- [ ] **Test all critical user flows**
  - [ ] User registration
  - [ ] User login
  - [ ] Password reset via phone number
  - [ ] Shoe management (CRUD operations)
  - [ ] Stock management
  - [ ] Sales recording
  - [ ] Dashboard statistics

---

## 🟢 Infrastructure Tasks (Recommended)

### Process Management

- [ ] **Install PM2 process manager**
  - Command: `npm install -g pm2`
  - Note: PM2 keeps the Node.js process running and restarts on crashes

- [ ] **Start backend with PM2**
  - Command: `cd backend && pm2 start dist/index.js --name shoe-store-api`
  - Additional commands:
    - `pm2 save` - Save current process list
    - `pm2 startup` - Configure PM2 to start on system boot
    - `pm2 logs shoe-store-api` - View logs
    - `pm2 monit` - Monitor process

### Reverse Proxy & SSL

- [ ] **Set up nginx reverse proxy**
  - Purpose: SSL/TLS termination, static file serving, API proxying
  - Configuration needed:
    - Serve frontend static files from `frontend/dist/`
    - Proxy `/api/*` requests to backend server
    - Configure SSL certificates
  - Example nginx config location: `/etc/nginx/sites-available/shoe-store`

- [ ] **Set up SSL/TLS certificates**
  - Options: Let's Encrypt (free), commercial certificates
  - Tool: Certbot (for Let's Encrypt)
  - Note: HTTPS is required for production

- [ ] **Configure firewall rules**
  - Allow: Port 80 (HTTP), Port 443 (HTTPS)
  - Restrict: Backend port (5000) should only be accessible from localhost/nginx
  - Block: Direct access to database port from external IPs

### Database & Backups

- [ ] **Set up automated database backups**
  - Script available: `backend/scripts/backup.ts`
  - Command: `cd backend && npm run backup`
  - Schedule: Use cron or task scheduler for automated backups
  - Storage: Store backups in secure, off-site location

- [ ] **Test database restore procedure**
  - Script available: `backend/scripts/restore.ts`
  - Command: `cd backend && npm run restore`
  - Note: Verify you can restore from backups

### Monitoring & Logging

- [ ] **Configure monitoring and alerts**
  - Monitor: Server health, database connections, error rates, response times
  - Tools: PM2 monitoring, external services (e.g., New Relic, Datadog)
  - Alerts: Set up notifications for critical errors

- [ ] **Review log file locations**
  - Backend logs: `backend/logs/`
    - `combined.log` - All logs
    - `error.log` - Error logs only
    - `exceptions.log` - Uncaught exceptions
    - `rejections.log` - Unhandled promise rejections
  - Action: Set up log rotation to prevent disk space issues

---

## ✅ Testing & Verification

### Health Checks

- [ ] **Test health check endpoint**
  - URL: `GET https://api.yourdomain.com/api/health`
  - Expected: `{ "status": "ok", "timestamp": "..." }`
  - Note: This endpoint is public and doesn't require authentication

### Authentication Testing

- [ ] **Test authentication flows**
  - [ ] User registration endpoint
  - [ ] User login endpoint
  - [ ] Token refresh endpoint
  - [ ] Protected route access with valid token
  - [ ] Protected route rejection with invalid/expired token

### API Endpoint Testing

- [ ] **Test all API endpoints**
  - [ ] Shoes endpoints (GET, POST, PUT, DELETE)
  - [ ] Stock endpoints
  - [ ] Sales endpoints
  - [ ] Supplier endpoints
  - [ ] Purchase endpoints
  - [ ] Expense endpoints
  - [ ] User management endpoints
  - [ ] Activity log endpoints

### Security Testing

- [ ] **Verify CORS works correctly**
  - Test: Frontend can make requests from production domain
  - Test: Requests from unauthorized origins are blocked
  - Check: CORS headers are present in responses

- [ ] **Test error handling**
  - Test: Invalid input validation
  - Test: Unauthorized access attempts
  - Test: Non-existent resource requests (404)
  - Verify: Error messages don't expose sensitive information in production

- [ ] **Verify rate limiting**
  - Test: Make multiple rapid requests
  - Expected: Rate limit error after threshold
  - Note: Rate limiting is configured in `backend/src/middleware/rateLimit.middleware.ts`

### Frontend Testing

- [ ] **Test frontend production build**
  - Command: `cd frontend && npm run preview`
  - Verify: All pages load correctly
  - Check: API calls work with production API URL
  - Test: All user interactions function properly

---

## 📋 Post-Deployment Tasks

### Immediate Monitoring

- [ ] **Monitor application logs**
  - Check: `backend/logs/error.log` for errors
  - Check: `backend/logs/combined.log` for general activity
  - Monitor: PM2 logs if using PM2
  - Action: Watch for any unexpected errors or warnings

- [ ] **Test all functionality in production**
  - [ ] User can register and login
  - [ ] All CRUD operations work
  - [ ] Sales transactions complete successfully
  - [ ] Dashboard displays correct statistics
  - [ ] Image uploads work (if Cloudinary configured)

### Ongoing Maintenance

- [ ] **Set up automated backups schedule**
  - Frequency: Daily (recommended) or as per your needs
  - Method: Cron job or task scheduler
  - Retention: Keep backups for at least 30 days
  - Test: Periodically verify backups can be restored

- [ ] **Configure alerts and monitoring**
  - Set up: Error rate alerts
  - Set up: Server downtime alerts
  - Set up: Database connection failure alerts
  - Set up: Disk space warnings
  - Set up: High CPU/memory usage alerts

- [ ] **Document production environment**
  - Document: Server IPs and access methods
  - Document: Database connection details (securely)
  - Document: SSL certificate renewal dates
  - Document: Backup procedures and locations
  - Document: Rollback procedures

### Performance Optimization

- [ ] **Review and optimize database queries**
  - Check: Slow query logs
  - Add: Database indexes if needed
  - Optimize: Frequently used queries

- [ ] **Set up caching (if needed)**
  - Consider: Redis for session storage
  - Consider: CDN for static assets
  - Consider: API response caching for frequently accessed data

---

## 📝 Quick Reference Commands

### Backend Commands
```bash
# Build
cd backend && npm run build

# Start production server
cd backend && npm start

# Run migrations
cd backend && npm run prisma:migrate:deploy

# Start with PM2
cd backend && pm2 start dist/index.js --name shoe-store-api

# View PM2 logs
pm2 logs shoe-store-api

# Backup database
cd backend && npm run backup
```

### Frontend Commands
```bash
# Build for production
cd frontend && npm run build

# Preview production build
cd frontend && npm run preview
```

### Database Commands
```bash
# List users
cd backend && npm run list-users

# Backup database
cd backend && npm run backup

# Restore database
cd backend && npm run restore
```

---

## 🎯 Deployment Checklist Summary

**Before Deployment:**
- [ ] All critical environment variables configured
- [ ] Backend built and tested
- [ ] Frontend built with production API URL
- [ ] Database migrations applied
- [ ] Security measures verified

**During Deployment:**
- [ ] Backend server started
- [ ] Frontend files served
- [ ] SSL certificates configured
- [ ] Reverse proxy configured
- [ ] Health check passes

**After Deployment:**
- [ ] All functionality tested
- [ ] Monitoring configured
- [ ] Backups scheduled
- [ ] Documentation updated

---

## ⚠️ Important Notes

1. **Never commit `.env` files** - They contain sensitive information
2. **Always test in staging first** - Use a staging environment that mirrors production
3. **Have a rollback plan** - Know how to revert to previous version if needed
4. **Monitor closely after deployment** - Watch logs and metrics for first 24-48 hours
5. **Keep backups current** - Regular backups are essential for disaster recovery

---

**Last Updated:** $(Get-Date)
**Status:** Ready for deployment after completing critical tasks

---

## 🚀 Quick Deployment Scripts

Automated deployment scripts are available to simplify the deployment process:

### Pre-Deployment Check
```bash
# Linux/Mac
./check-deployment-ready.sh

# Windows
.\check-deployment-ready.ps1
```

### Full Deployment
```bash
# Linux/Mac
./deploy.sh

# Windows
.\deploy.ps1
```

### Individual Deployments
```bash
# Backend only
cd backend && bash deploy.sh

# Frontend only
cd frontend && bash deploy.sh
```

### PM2 Startup
```bash
# After deployment, start with PM2
cd backend && bash pm2-start.sh

# Or use ecosystem config
cd backend && pm2 start ecosystem.config.js
```

These scripts automate:
- ✅ Environment variable validation
- ✅ Dependency installation
- ✅ TypeScript compilation
- ✅ Database migrations
- ✅ Production builds

