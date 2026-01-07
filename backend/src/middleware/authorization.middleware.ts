import { Request, Response, NextFunction } from 'express';
import { ApplicationError } from './errorHandler.middleware';

/**
 * Middleware to check if user has admin role
 * Must be used after authenticate middleware
 */
export function requireAdmin(req: Request, res: Response, next: NextFunction) {
  if (!req.user) {
    throw new ApplicationError('Authentication required', 401);
  }

  if (req.user.role !== 'admin') {
    throw new ApplicationError('Admin access required', 403);
  }

  next();
}

/**
 * Middleware to check if user has specific role
 * Must be used after authenticate middleware
 */
export function requireRole(...roles: ('admin' | 'user')[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      throw new ApplicationError('Authentication required', 401);
    }

    if (!roles.includes(req.user.role)) {
      throw new ApplicationError('Insufficient permissions', 403);
    }

    next();
  };
}

/**
 * Middleware to check if user is accessing their own resource or is admin
 * Must be used after authenticate middleware
 */
export function requireOwnerOrAdmin(userIdParam: string = 'id') {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      throw new ApplicationError('Authentication required', 401);
    }

    const resourceUserId = req.params[userIdParam];
    const isOwner = req.user.userId === resourceUserId;
    const isAdmin = req.user.role === 'admin';

    if (!isOwner && !isAdmin) {
      throw new ApplicationError('Access denied', 403);
    }

    next();
  };
}







