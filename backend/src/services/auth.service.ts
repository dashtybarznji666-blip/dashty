import { UserService } from './user.service';
import { RegisterInput, LoginInput } from '../types';
import { generateTokenPair, TokenPair } from '../lib/jwt';
import crypto from 'crypto';
import bcrypt from 'bcrypt';
import prisma from '../lib/prisma';

export class AuthService {
  private userService: UserService;

  constructor() {
    this.userService = new UserService();
  }

  async register(data: RegisterInput) {
    // Validate registration password first (before checking phone number)
    const REQUIRED_REGISTRATION_PASSWORD = 'DASHTYfalak2025@';
    if (!data.registrationPassword || data.registrationPassword !== REQUIRED_REGISTRATION_PASSWORD) {
      throw new Error('Invalid registration password');
    }

    // Check if user already exists
    const existingUser = await this.userService.findByPhoneNumber(data.phoneNumber);
    if (existingUser) {
      throw new Error('Phone number already exists');
    }

    // Create new user
    const user = await this.userService.createUser({
      name: data.name,
      phoneNumber: data.phoneNumber,
      password: data.password,
      role: 'user', // Default role
    });

    // Generate JWT tokens
    const tokens = generateTokenPair({
      userId: user.id,
      phoneNumber: user.phoneNumber,
      role: user.role as 'admin' | 'user',
    });

    // Return user without password and tokens
    const { password: _, ...userWithoutPassword } = user;
    return {
      user: userWithoutPassword,
      ...tokens,
    };
  }

  async login(data: LoginInput) {
    // Find user by phone number
    const user = await this.userService.findByPhoneNumber(data.phoneNumber);
    if (!user) {
      throw new Error('Invalid phone number or password');
    }

    // Check if user is active
    if (!user.isActive) {
      throw new Error('Account is deactivated');
    }

    // Validate password
    const isValidPassword = await this.userService.validatePassword(data.password, user.password);
    if (!isValidPassword) {
      throw new Error('Invalid phone number or password');
    }

    // Generate JWT tokens
    const tokens = generateTokenPair({
      userId: user.id,
      phoneNumber: user.phoneNumber,
      role: user.role as 'admin' | 'user',
    });

    // Return user without password and tokens
    const { password: _, ...userWithoutPassword } = user;
    return {
      user: userWithoutPassword,
      ...tokens,
    };
  }

  async validateCredentials(phoneNumber: string, password: string): Promise<boolean> {
    try {
      await this.login({ phoneNumber, password });
      return true;
    } catch {
      return false;
    }
  }

  async requestPasswordReset(phoneNumber: string): Promise<void> {
    // Find user by phone number
    const user = await this.userService.findByPhoneNumber(phoneNumber);
    
    // Don't reveal if user exists or not (security best practice)
    if (!user) {
      // Still return success to prevent phone number enumeration
      return;
    }

    // Check if user is active
    if (!user.isActive) {
      return;
    }

    // Generate secure reset token
    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetTokenExpiry = new Date();
    resetTokenExpiry.setHours(resetTokenExpiry.getHours() + 1); // Token expires in 1 hour

    // Save token to user
    await prisma.user.update({
      where: { id: user.id },
      data: {
        resetToken,
        resetTokenExpiry,
      },
    });

    // Note: Password reset via SMS would be implemented here
    // For now, admin can reset passwords directly
    console.log(`Password reset token generated for user: ${user.phoneNumber}`);
  }

  async resetPassword(token: string, newPassword: string): Promise<void> {
    // Find user by reset token
    const user = await prisma.user.findFirst({
      where: {
        resetToken: token,
        resetTokenExpiry: {
          gt: new Date(), // Token must not be expired
        },
      },
    });

    if (!user) {
      throw new Error('Invalid or expired reset token');
    }

    // Validate password length
    if (newPassword.length < 6) {
      throw new Error('Password must be at least 6 characters');
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update password and clear reset token
    await prisma.user.update({
      where: { id: user.id },
      data: {
        password: hashedPassword,
        resetToken: null,
        resetTokenExpiry: null,
      },
    });
  }

  async verifyResetToken(token: string): Promise<boolean> {
    const user = await prisma.user.findFirst({
      where: {
        resetToken: token,
        resetTokenExpiry: {
          gt: new Date(), // Token must not be expired
        },
      },
    });

    return !!user;
  }

  async adminResetPassword(userId: string, newPassword: string): Promise<void> {
    // Validate password length
    if (newPassword.length < 6) {
      throw new Error('Password must be at least 6 characters');
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update password and clear any reset tokens
    await prisma.user.update({
      where: { id: userId },
      data: {
        password: hashedPassword,
        resetToken: null,
        resetTokenExpiry: null,
      },
    });
  }

  async refreshToken(refreshToken: string) {
    const { verifyRefreshToken, generateTokenPair } = await import('../lib/jwt');
    
    try {
      // Verify refresh token
      const payload = verifyRefreshToken(refreshToken);
      
      // Find user to ensure they still exist and are active
      const user = await this.userService.findById(payload.userId);
      if (!user) {
        throw new Error('User not found');
      }
      
      if (!user.isActive) {
        throw new Error('Account is deactivated');
      }
      
      // Generate new token pair
      const tokens = generateTokenPair({
        userId: user.id,
        phoneNumber: user.phoneNumber,
        role: user.role as 'admin' | 'user',
      });
      
      // Return new tokens
      return tokens;
    } catch (error: any) {
      throw new Error('Invalid or expired refresh token');
    }
  }
}

