# Troubleshooting Guide

Common issues and solutions for the Shoe Store Management System.

## Authentication Issues

### Login Fails with "Invalid user and password"

**Possible Causes:**
1. User doesn't exist in database
2. Phone number has leading/trailing spaces
3. Password hash mismatch
4. User account is inactive

**Solutions:**
1. **Check if user exists:**
   ```bash
   cd backend
   npm run check-admin
   ```

2. **Re-run seed script to create admin user:**
   ```bash
   cd backend
   npm run prisma:seed
   ```

3. **Verify phone number format:**
   - Must be exactly 11 digits starting with 0
   - Example: `07509384229` (not ` 07509384229 ` or `+9647509384229`)

4. **Check user account status:**
   - Use Prisma Studio: `npm run prisma:studio`
   - Verify `isActive` is `true`

## CORS Errors

### "CORS header 'Access-Control-Allow-Origin' missing"

**Causes:**
- Backend not running
- `FRONTEND_URL` not set correctly in backend `.env`
- Frontend URL doesn't match exactly (including protocol and trailing slashes)

**Solutions:**
1. **Verify backend is running:**
   ```bash
   curl http://localhost:3001/api/health
   ```

2. **Check `FRONTEND_URL` in backend `.env`:**
   ```env
   FRONTEND_URL=https://vitoshoes.vercel.app
   ```
   - Must match frontend URL exactly
   - No trailing slash
   - Include `https://` protocol

3. **Restart backend after changing environment variables**

## Database Issues

### "Database connection error" or "P1001"

**Causes:**
- Database file doesn't exist (SQLite)
- Database URL incorrect
- Database server not running (PostgreSQL/MySQL)
- Insufficient permissions

**Solutions:**
1. **For SQLite:**
   ```bash
   cd backend
   npm run prisma:migrate
   ```

2. **For PostgreSQL/MySQL:**
   - Verify `DATABASE_URL` format
   - Check database server is running
   - Verify user has proper permissions

3. **Test database connection:**
   ```bash
   cd backend
   npm run prisma:studio
   ```

### Migration Errors

**Solution:**
```bash
cd backend
npm run prisma:generate
npm run prisma:migrate:deploy
```

## Build Errors

### TypeScript Compilation Errors

**Solutions:**
1. **Clean and rebuild:**
   ```bash
   # Backend
   cd backend
   rm -rf dist node_modules
   npm install
   npm run build

   # Frontend
   cd frontend
   rm -rf dist node_modules
   npm install
   npm run build
   ```

2. **Check TypeScript version:**
   ```bash
   npm list typescript
   ```

### Frontend Build Fails

**Common Issues:**
- Missing environment variables
- Type errors after enabling strict mode

**Solutions:**
1. **Create `.env` file:**
   ```bash
   cd frontend
   cp .env.example .env
   # Edit .env and set VITE_API_URL
   ```

2. **Fix type errors:**
   ```bash
   npm run build
   # Fix any TypeScript errors shown
   ```

## Deployment Issues

### Railway Deployment Fails

**Solutions:**
1. **Check `railway.json` exists in backend directory**
2. **Verify environment variables are set in Railway dashboard**
3. **Check build logs in Railway dashboard**

### Vercel Deployment Issues

**Solutions:**
1. **Verify `vercel.json` exists in frontend directory**
2. **Check build command:**
   ```json
   {
     "buildCommand": "npm run build"
   }
   ```

2. **Set environment variables in Vercel dashboard:**
   - `VITE_API_URL` must be set

## API Errors

### 502 Bad Gateway

**Causes:**
- Backend server not running
- Backend crashed
- Port conflict

**Solutions:**
1. **Check backend logs:**
   ```bash
   cd backend
   # Check logs/error.log
   ```

2. **Restart backend:**
   ```bash
   cd backend
   npm start
   ```

### 401 Unauthorized

**Causes:**
- Invalid or expired JWT token
- Missing Authorization header
- Token format incorrect

**Solutions:**
1. **Log out and log in again**
2. **Check token in browser localStorage**
3. **Verify token format: `Bearer <token>`**

## Performance Issues

### Slow Database Queries

**Solutions:**
1. **Add database indexes** (if using PostgreSQL/MySQL)
2. **Check for N+1 query problems**
3. **Use Prisma query optimization**

### High Memory Usage

**Solutions:**
1. **Enable Prisma connection pooling**
2. **Review logging levels** (reduce in production)
3. **Check for memory leaks in long-running processes**

## Environment Variable Issues

### "Environment validation failed"

**Solutions:**
1. **Check `.env` file exists:**
   ```bash
   ls -la backend/.env
   ```

2. **Verify all required variables are set:**
   - `DATABASE_URL`
   - `JWT_SECRET` (min 32 chars)
   - `JWT_REFRESH_SECRET` (min 32 chars)

3. **In production, ensure `NODE_ENV=production`**

## Common Commands

### Check Admin User
```bash
cd backend
npm run check-admin
```

### List All Users
```bash
cd backend
npm run list-users
```

### Reset Database
```bash
cd backend
npm run prisma:migrate:reset
npm run prisma:seed
```

### View Logs
```bash
# Backend logs
cd backend
tail -f logs/combined.log
tail -f logs/error.log
```

### Test API Health
```bash
curl http://localhost:3001/api/health
```

## Getting Help

1. Check error logs in `backend/logs/`
2. Review browser console for frontend errors
3. Check network tab for API request/response details
4. Verify environment variables are set correctly
5. Ensure all dependencies are installed

## Production Checklist

Before deploying to production:

- [ ] All environment variables set correctly
- [ ] `NODE_ENV=production` in backend
- [ ] `FRONTEND_URL` matches production frontend URL exactly
- [ ] `VITE_API_URL` points to production backend
- [ ] Database migrations run successfully
- [ ] JWT secrets are strong (32+ characters)
- [ ] CORS configured for production domain
- [ ] Rate limiting enabled
- [ ] Security headers configured (helmet.js)
- [ ] Logging configured properly
- [ ] Error handling tested
- [ ] Health check endpoint working
