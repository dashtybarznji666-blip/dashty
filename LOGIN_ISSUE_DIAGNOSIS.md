# Login Issue Diagnosis Report

## Problem
User cannot login with admin credentials:
- Phone Number: `07509384229`
- Password: `DASHTYfalak2025@`
- Error: "Invalid user and password"

## Authentication Flow Analysis

### 1. Frontend Login Flow
**File:** `frontend/src/pages/Login.tsx`
- User enters phone number and password
- Calls `login(signInPhoneNumber, signInPassword)` from AuthContext
- **Issue Found:** Phone number is NOT trimmed before sending to API
- This could cause issues if there are leading/trailing spaces

**File:** `frontend/src/contexts/AuthContext.tsx`
- Makes POST request to `/api/auth/login` with `{ phoneNumber, password }`
- Returns `false` if error occurs (catches all errors)

### 2. Backend Authentication Flow
**File:** `backend/src/routes/auth.routes.ts`
- Route: `POST /api/auth/login`
- Middleware: `authLimiter` (rate limiting), `validate(loginSchema)` (validation)
- Controller: `authController.login`

**File:** `backend/src/controllers/auth.controller.ts`
- Calls `authService.login(data)`
- Returns 401 if error message is "Invalid phone number or password" or "Account is deactivated"

**File:** `backend/src/services/auth.service.ts`
- Step 1: Find user by phone number using `userService.findByPhoneNumber(data.phoneNumber)`
  - If not found → throws "Invalid phone number or password"
- Step 2: Check if user is active (`user.isActive`)
  - If inactive → throws "Account is deactivated"
- Step 3: Validate password using `userService.validatePassword(data.password, user.password)`
  - Uses `bcrypt.compare()` to compare plain password with hashed password
  - If invalid → throws "Invalid phone number or password"

**File:** `backend/src/services/user.service.ts`
- `findByPhoneNumber()`: Uses Prisma `findUnique({ where: { phoneNumber } })`
- `validatePassword()`: Uses `bcrypt.compare(plainPassword, hashedPassword)`

### 3. Database Schema
**File:** `backend/prisma/schema.prisma`
- User model has:
  - `phoneNumber` (String, unique)
  - `password` (String - hashed)
  - `role` (String, default "user")
  - `isActive` (Boolean, default true)

### 4. Seed Script
**File:** `backend/prisma/seed.ts`
- Creates admin user with:
  - Phone: `07509384229`
  - Password: `DASHTYfalak2025@` (hashed with bcrypt, 10 rounds)
  - Role: `admin`
  - isActive: `true`

## Potential Issues Identified

### Issue 1: Phone Number Not Trimmed (HIGH PRIORITY)
**Location:** `frontend/src/pages/Login.tsx` line 92
```typescript
const success = await login(signInPhoneNumber, signInPassword);
```
- Phone number is sent as-is without trimming
- If user has spaces: `" 07509384229 "` vs `"07509384229"` → will not match

**Solution:** Trim phone number before sending:
```typescript
const success = await login(signInPhoneNumber.trim(), signInPassword);
```

### Issue 2: User May Not Exist in Database (HIGH PRIORITY)
- Seed script may not have been run
- Database may have been reset without re-seeding
- User may have been deleted

**Solution:** Run seed script:
```bash
cd backend
npm run prisma:seed
```

### Issue 3: User Account May Be Inactive
- If `isActive` is `false`, login will fail even with correct credentials

**Solution:** Check and activate user in database

### Issue 4: Password Hash Mismatch
- Password may have been changed manually
- Different bcrypt salt rounds used
- Database migration issues

**Solution:** Re-run seed script or reset password

### Issue 5: Phone Number Format Validation
**File:** `backend/src/validators/index.ts`
- Phone number must match: `/^0\d{9,10}$/`
- Must be 10-11 characters
- `07509384229` = 11 characters ✅ (valid)

## Diagnostic Steps

### Step 1: Check if User Exists
Run the diagnostic script:
```bash
cd backend
npm run check-admin
```

This will:
- Check if user exists in database
- Verify password hash matches
- Check if user is active
- List all users

### Step 2: Verify Database Connection
Check `.env` file has correct `DATABASE_URL`:
```env
DATABASE_URL=file:./prisma/prisma/dev.db
```

### Step 3: Check Backend Logs
When attempting login, check backend console for:
- Which step fails (user not found, password mismatch, inactive)
- Any database connection errors
- Validation errors

### Step 4: Test with Direct Database Query
Use Prisma Studio:
```bash
cd backend
npm run prisma:studio
```

Check:
- User exists with phone `07509384229`
- `isActive` is `true`
- `role` is `admin`

## Recommended Fixes

### Fix 1: Trim Phone Number in Frontend
**File:** `frontend/src/pages/Login.tsx`
```typescript
const handleSignIn = async (e: React.FormEvent) => {
  e.preventDefault();
  const trimmedPhone = signInPhoneNumber.trim();
  const trimmedPassword = signInPassword.trim();
  
  if (!trimmedPhone || !trimmedPassword) {
    // ... validation
    return;
  }

  setIsLoading(true);
  try {
    const success = await login(trimmedPhone, trimmedPassword);
    // ... rest of code
  }
}
```

### Fix 2: Add Phone Number Normalization in Backend
**File:** `backend/src/services/user.service.ts`
```typescript
async findByPhoneNumber(phoneNumber: string) {
  const normalizedPhone = phoneNumber.trim();
  return prisma.user.findUnique({
    where: { phoneNumber: normalizedPhone },
    // ... rest
  });
}
```

### Fix 3: Ensure Seed Script Runs
Add to deployment/setup documentation:
- Always run `npm run prisma:seed` after migrations
- Verify admin user exists before deployment

## Testing Checklist

- [ ] User exists in database (run `npm run check-admin`)
- [ ] Phone number has no leading/trailing spaces
- [ ] Password matches stored hash
- [ ] User account is active (`isActive: true`)
- [ ] Database connection is working
- [ ] Backend server is running
- [ ] Frontend can reach backend API
- [ ] CORS is properly configured
- [ ] No rate limiting blocking requests

## Next Steps

1. **Immediate:** Run diagnostic script to check database state
2. **Fix:** Add phone number trimming in frontend
3. **Fix:** Add phone number normalization in backend
4. **Verify:** Re-run seed script if user doesn't exist
5. **Test:** Attempt login again with trimmed phone number

## Files Modified/Created

1. ✅ Created: `backend/scripts/check-admin-user.ts` - Diagnostic script
2. ✅ Updated: `backend/package.json` - Added `check-admin` script
3. ⚠️ TODO: Fix phone number trimming in `frontend/src/pages/Login.tsx`
4. ⚠️ TODO: Add phone number normalization in `backend/src/services/user.service.ts`
