import { Request, Response, NextFunction } from 'express';
import { logError } from '../lib/logger';
import { env } from '../lib/env';

export interface AppError extends Error {
  statusCode?: number;
  isOperational?: boolean;
}

/**
 * Custom error class for application errors
 */
export class ApplicationError extends Error implements AppError {
  statusCode: number;
  isOperational: boolean;

  constructor(message: string, statusCode: number = 500, isOperational: boolean = true) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * Centralized error handling middleware
 */
export function errorHandler(
  err: AppError,
  req: Request,
  res: Response,
  next: NextFunction
) {
  // Log error
  logError('Request error', err, {
    method: req.method,
    url: req.url,
    ip: req.ip,
    userAgent: req.get('user-agent'),
    statusCode: err.statusCode || 500,
  });

  // Determine status code
  const statusCode = err.statusCode || 500;
  const isOperational = err.isOperational !== false;

  // Prepare error response
  const errorResponse: any = {
    error: err.message || 'Internal server error',
  };

  // Include stack trace in development
  if (env.nodeEnv === 'development') {
    errorResponse.stack = err.stack;
    if (!isOperational) {
      errorResponse.details = 'This is a non-operational error. Please check server logs.';
    }
  }

  // Ensure CORS headers are set on error responses
  const origin = req.headers.origin;
  if (origin) {
    res.setHeader('Access-Control-Allow-Origin', origin);
    res.setHeader('Access-Control-Allow-Credentials', 'true');
  }

  // Send error response
  res.status(statusCode).json(errorResponse);
}

/**
 * 404 Not Found handler
 */
export function notFoundHandler(req: Request, res: Response, next: NextFunction) {
  const error = new ApplicationError(`Route ${req.method} ${req.url} not found`, 404);
  next(error);
}

/**
 * Async error wrapper - wraps async route handlers to catch errors
 */
export function asyncHandler(
  fn: (req: Request, res: Response, next: NextFunction) => Promise<any>
) {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}

