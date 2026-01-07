import { Request, Response, NextFunction } from 'express';
import { verifyAccessToken, TokenPayload } from '../lib/jwt';

// Extend Express Request to include user
declare global {
  namespace Express {
    interface Request {
      user?: TokenPayload;
    }
  }
}

/**
 * Authentication middleware to verify JWT tokens
 */
export function authenticate(req: Request, res: Response, next: NextFunction) {
  // Skip authentication for OPTIONS requests (CORS preflight)
  if (req.method === 'OPTIONS') {
    return next();
  }

  try {
    // Get token from Authorization header
    const authHeader = req.headers.authorization;
    
    if (!authHeader) {
      return res.status(401).json({ error: 'No authorization header provided' });
    }

    // Extract token from "Bearer <token>"
    const parts = authHeader.split(' ');
    if (parts.length !== 2 || parts[0] !== 'Bearer') {
      return res.status(401).json({ error: 'Invalid authorization header format' });
    }

    const token = parts[1];

    // Verify token
    try {
      const payload = verifyAccessToken(token);
      // Attach user info to request
      req.user = payload;
      next();
    } catch (error: any) {
      return res.status(401).json({ error: 'Invalid or expired token' });
    }
  } catch (error: any) {
    return res.status(401).json({ error: 'Authentication failed' });
  }
}

/**
 * Optional authentication - doesn't fail if no token, but attaches user if token is valid
 */
export function optionalAuthenticate(req: Request, res: Response, next: NextFunction) {
  try {
    const authHeader = req.headers.authorization;
    
    if (authHeader) {
      const parts = authHeader.split(' ');
      if (parts.length === 2 && parts[0] === 'Bearer') {
        const token = parts[1];
        try {
          const payload = verifyAccessToken(token);
          req.user = payload;
        } catch {
          // Token invalid, but continue without user
        }
      }
    }
    
    next();
  } catch {
    next();
  }
}

