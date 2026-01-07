---
name: Password Recovery System
overview: Implement a comprehensive password recovery system with both email-based reset (for users) and admin-assisted reset (for administrators). This includes backend email service setup, password reset token management, new API endpoints, and frontend UI components.
todos:
  - id: db-schema-reset-tokens
    content: Update User model in Prisma schema to add resetToken and resetTokenExpiry fields
    status: completed
  - id: install-nodemailer
    content: Install nodemailer and @types/nodemailer packages in backend
    status: completed
  - id: email-service
    content: Create email.service.ts with sendPasswordResetEmail method using nodemailer
    status: completed
    dependencies:
      - install-nodemailer
  - id: auth-service-reset
    content: Add requestPasswordReset, resetPassword, and adminResetPassword methods to auth.service.ts
    status: completed
    dependencies:
      - db-schema-reset-tokens
      - email-service
  - id: auth-controller-reset
    content: Add forgot-password, reset-password, and verify-reset-token endpoints to auth.controller.ts
    status: completed
    dependencies:
      - auth-service-reset
  - id: user-controller-reset
    content: Add adminResetPassword method to user.controller.ts
    status: completed
    dependencies:
      - auth-service-reset
  - id: auth-routes-reset
    content: Add forgot-password, reset-password, and verify-reset-token routes to auth.routes.ts
    status: completed
    dependencies:
      - auth-controller-reset
  - id: user-routes-reset
    content: Add POST /api/users/:id/reset-password route to user.routes.ts
    status: completed
    dependencies:
      - user-controller-reset
  - id: frontend-api-auth
    content: Add forgotPassword, resetPassword, and verifyResetToken methods to authApi in api.ts
    status: completed
  - id: frontend-api-user
    content: Add resetUserPassword method to userApi in api.ts
    status: completed
  - id: frontend-hooks-auth
    content: Add useForgotPassword, useResetPassword, and useVerifyResetToken hooks to use-auth.ts
    status: completed
    dependencies:
      - frontend-api-auth
  - id: frontend-hooks-user
    content: Add useResetUserPassword hook to use-users.ts
    status: completed
    dependencies:
      - frontend-api-user
  - id: forgot-password-page
    content: Create ForgotPassword.tsx page with email input form
    status: completed
    dependencies:
      - frontend-hooks-auth
  - id: reset-password-page
    content: Create ResetPassword.tsx page with token validation and password reset form
    status: completed
    dependencies:
      - frontend-hooks-auth
  - id: login-page-link
    content: Add 'Forgot Password?' link to Login.tsx sign-in tab
    status: completed
  - id: users-page-reset
    content: Add 'Reset Password' button to Users.tsx for each user
    status: completed
    dependencies:
      - frontend-hooks-user
  - id: reset-password-dialog
    content: Create ResetUserPasswordDialog.tsx component for admin password reset
    status: completed
    dependencies:
      - frontend-hooks-user
  - id: app-routes
    content: Add /forgot-password and /reset-password routes to App.tsx
    status: completed
    dependencies:
      - forgot-password-page
      - reset-password-page
  - id: translations
    content: Add password recovery translations to EN, AR, and KU translation files
    status: completed
  - id: db-migration
    content: Run Prisma db push to apply schema changes for reset token fields
    status: completed
    dependencies:
      - db-schema-reset-tokens
---

# Password Recovery System Implementation

## Overview

Implement password recovery functionality with two methods:

1. **Email-based reset**: Users can request a password reset link via email
2. **Admin-assisted reset**: Admins can reset user passwords from the Users page

## Backend Changes

### 1. Database Schema Updates

- **File**: `backend/prisma/schema.prisma`
- Add password reset token fields to User model:
- `resetToken String?` - Token for password reset
- `resetTokenExpiry DateTime?` - Expiration time for the token

### 2. Install Email Dependencies

- **File**: `backend/package.json`
- Add `nodemailer` and `@types/nodemailer` for email sending

### 3. Email Service

- **New File**: `backend/src/services/email.service.ts`
- Create email service using nodemailer
- Implement `sendPasswordResetEmail(email: string, resetToken: string)` method
- Use environment variables for SMTP configuration (SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS)
- Generate reset link: `${FRONTEND_URL}/reset-password?token=${resetToken}`

### 4. Auth Service Updates

- **File**: `backend/src/services/auth.service.ts`
- Add methods:
- `requestPasswordReset(email: string)`: Generate reset token, save to user, send email
- `resetPassword(token: string, newPassword: string)`: Validate token, update password
- `adminResetPassword(userId: string, newPassword: string)`: Admin-only password reset

### 5. Auth Controller Updates

- **File**: `backend/src/controllers/auth.controller.ts`
- Add endpoints:
- `POST /api/auth/forgot-password`: Request password reset
- `POST /api/auth/reset-password`: Reset password with token
- `POST /api/auth/verify-reset-token`: Verify if reset token is valid

### 6. User Controller Updates

- **File**: `backend/src/controllers/user.controller.ts`
- Add `adminResetPassword` method for admin to reset user password

### 7. User Routes Updates

- **File**: `backend/src/routes/user.routes.ts`
- Add `POST /api/users/:id/reset-password` route (admin only)

### 8. Auth Routes Updates

- **File**: `backend/src/routes/auth.routes.ts`
- Add routes for forgot-password, reset-password, and verify-reset-token

### 9. Environment Variables

- **File**: `backend/.env` (documentation)
- Document required variables:
- `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`
- `FRONTEND_URL` (for reset link generation)

## Frontend Changes

### 10. API Client Updates

- **File**: `frontend/src/lib/api.ts`
- Add to `authApi`:
- `forgotPassword(email: string)`
- `resetPassword(token: string, newPassword: string)`
- `verifyResetToken(token: string)`
- Add to `userApi`:
- `resetUserPassword(userId: string, newPassword: string)`

### 11. Auth Hooks Updates

- **File**: `frontend/src/hooks/use-auth.ts`
- Add hooks:
- `useForgotPassword()`
- `useResetPassword()`
- `useVerifyResetToken()`

### 12. User Hooks Updates

- **File**: `frontend/src/hooks/use-users.ts`
- Add `useResetUserPassword()` hook

### 13. Forgot Password Page

- **New File**: `frontend/src/pages/ForgotPassword.tsx`
- Create form to request password reset
- Input field for email
- Submit button that calls forgot password API
- Success message with instructions

### 14. Reset Password Page

- **New File**: `frontend/src/pages/ResetPassword.tsx`
- Read token from URL query parameter
- Form with new password and confirm password fields
- Validate token on mount
- Submit button to reset password
- Handle success/error states

### 15. Login Page Updates

- **File**: `frontend/src/pages/Login.tsx`
- Add "Forgot Password?" link below password field in sign-in tab
- Link navigates to `/forgot-password`

### 16. Users Page Updates

- **File**: `frontend/src/pages/Users.tsx`
- Add "Reset Password" button/action for each user
- Open dialog to set new password
- Use `useResetUserPassword` hook

### 17. Reset Password Dialog Component

- **New File**: `frontend/src/components/ResetUserPasswordDialog.tsx`
- Dialog component for admin to reset user password
- Form with new password and confirm password fields
- Validation and error handling

### 18. App Routes Updates

- **File**: `frontend/src/App.tsx`
- Add routes:
- `/forgot-password` → `ForgotPassword` component
- `/reset-password` → `ResetPassword` component

### 19. Translations

- **Files**: `frontend/src/locales/en/translation.json`, `frontend/src/locales/ar/translation.json`, `frontend/src/locales/ku/translation.json`
- Add keys for:
- `auth.forgotPassword`, `auth.forgotPasswordDescription`
- `auth.resetPassword`, `auth.resetPasswordDescription`
- `auth.resetTokenExpired`, `auth.resetTokenInvalid`
- `auth.passwordResetEmailSent`, `auth.passwordResetSuccess`
- `users.resetPassword`, `users.resetPasswordDescription`
- `users.newPassword`, `users.confirmNewPassword`
- `users.passwordResetSuccess`

## Implementation Notes

- Reset tokens should expire after 1 hour
- Tokens should be cryptographically secure (use crypto.randomBytes or uuid)
- After successful password reset, invalidate the token
- Email service should handle errors gracefully (log but don't expose SMTP details)
- Admin re