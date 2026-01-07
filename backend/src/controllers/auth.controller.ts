import { Request, Response } from 'express';
import { AuthService } from '../services/auth.service';
import { RegisterInput, LoginInput } from '../types';
import { ApplicationError } from '../middleware/errorHandler.middleware';
import { asyncHandler } from '../middleware/errorHandler.middleware';
import { logActivity } from '../lib/activity-logger';

const authService = new AuthService();

export class AuthController {
  register = asyncHandler(async (req: Request, res: Response) => {
    const data: RegisterInput = req.body;
    try {
      const user = await authService.register(data);
      res.status(201).json(user);
    } catch (error: any) {
      if (error.message === 'Invalid registration password') {
        throw new ApplicationError(error.message, 400);
      }
      if (error.message === 'Phone number already exists') {
        throw new ApplicationError(error.message, 400);
      }
      throw error;
    }
  });

  login = asyncHandler(async (req: Request, res: Response) => {
    const data: LoginInput = req.body;
    try {
      const user = await authService.login(data);
      // Log successful login
      await logActivity(user.user.id, 'login', 'auth', {
        description: `User logged in: ${user.user.phoneNumber}`,
        req,
      });
      res.json(user);
    } catch (error: any) {
      if (error.message === 'Invalid phone number or password' || error.message === 'Account is deactivated') {
        throw new ApplicationError(error.message, 401);
      }
      throw error;
    }
  });

  async forgotPassword(req: Request, res: Response) {
    try {
      const { phoneNumber } = req.body;
      if (!phoneNumber) {
        return res.status(400).json({ error: 'Phone number is required' });
      }
      
      await authService.requestPasswordReset(phoneNumber);
      // Always return success to prevent phone number enumeration
      res.json({ message: 'If an account with that phone number exists, a password reset token has been generated. Please contact an administrator to reset your password.' });
    } catch (error: any) {
      // Still return success to prevent phone number enumeration
      res.json({ message: 'If an account with that phone number exists, a password reset token has been generated. Please contact an administrator to reset your password.' });
    }
  }

  async resetPassword(req: Request, res: Response) {
    try {
      const { token, newPassword } = req.body;
      if (!token || !newPassword) {
        return res.status(400).json({ error: 'Token and new password are required' });
      }

      await authService.resetPassword(token, newPassword);
      res.json({ message: 'Password has been reset successfully' });
    } catch (error: any) {
      if (error.message === 'Invalid or expired reset token') {
        return res.status(400).json({ error: error.message });
      }
      if (error.message === 'Password must be at least 6 characters') {
        return res.status(400).json({ error: error.message });
      }
      res.status(500).json({ error: error.message || 'Failed to reset password' });
    }
  }

  async verifyResetToken(req: Request, res: Response) {
    try {
      const { token } = req.body;
      if (!token) {
        return res.status(400).json({ error: 'Token is required' });
      }

      const isValid = await authService.verifyResetToken(token);
      res.json({ valid: isValid });
    } catch (error: any) {
      res.status(500).json({ error: error.message || 'Failed to verify token' });
    }
  }

  refreshToken = asyncHandler(async (req: Request, res: Response) => {
    const { refreshToken } = req.body;
    try {
      const tokens = await authService.refreshToken(refreshToken);
      res.json(tokens);
    } catch (error: any) {
      if (error.message === 'Invalid or expired refresh token' || 
          error.message === 'User not found' || 
          error.message === 'Account is deactivated') {
        throw new ApplicationError(error.message, 401);
      }
      throw error;
    }
  });
}

