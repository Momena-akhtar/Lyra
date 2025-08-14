import { Request, Response, NextFunction } from 'express';
import { authService } from '../services/authService';
import { DecodedIdToken } from 'firebase-admin/auth';

// Extend Express Request interface to include user
declare global {
  namespace Express {
    interface Request {
      user?: DecodedIdToken;
      uid?: string;
    }
  }
}

/**
 * Middleware to verify Firebase ID token from Authorization header
 * Expects: Authorization: Bearer <idToken>
 */
export const authenticateToken = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader) {
      res.status(401).json({
        success: false,
        message: 'Authorization header is required'
      });
      return;
    }

    const token = authHeader.split(' ')[1]; // Bearer <token>
    
    if (!token) {
      res.status(401).json({
        success: false,
        message: 'Token is required'
      });
      return;
    }

    // Verify the token
    const decodedToken = await authService.verifyIdToken(token);
    
    // Add user info to request
    req.user = decodedToken;
    req.uid = decodedToken.uid;
    
    next();
  } catch (error: any) {
    console.error('Token verification failed:', error);
    res.status(401).json({
      success: false,
      message: 'Invalid or expired token'
    });
  }
};

/**
 * Optional authentication middleware - doesn't fail if no token provided
 * Useful for routes that can work with or without authentication
 */
export const optionalAuth = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;
    
    if (authHeader) {
      const token = authHeader.split(' ')[1];
      if (token) {
        const decodedToken = await authService.verifyIdToken(token);
        req.user = decodedToken;
        req.uid = decodedToken.uid;
      }
    }
    
    next();
  } catch (error: any) {
    // Continue without authentication if token is invalid
    console.warn('Optional auth failed, continuing without user:', error.message);
    next();
  }
};

/**
 * Middleware to check if user email is verified
 */
export const requireEmailVerification = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  if (!req.user) {
    res.status(401).json({
      success: false,
      message: 'Authentication required'
    });
    return;
  }

  if (!req.user.email_verified) {
    res.status(403).json({
      success: false,
      message: 'Email verification required'
    });
    return;
  }

  next();
};

/**
 * Middleware to check if user has specific custom claims
 */
export const requireCustomClaim = (claim: string) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
      return;
    }

    if (!req.user[claim]) {
      res.status(403).json({
        success: false,
        message: `Required claim '${claim}' not found`
      });
      return;
    }

    next();
  };
};

/**
 * Middleware to check if user is accessing their own resource
 * Expects resourceId parameter in route
 */
export const requireOwnership = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  if (!req.user) {
    res.status(401).json({
      success: false,
      message: 'Authentication required'
    });
    return;
  }

  const resourceId = req.params.userId || req.params.uid || req.params.id;
  
  if (!resourceId) {
    res.status(400).json({
      success: false,
      message: 'Resource ID parameter is required'
      });
    return;
  }

  if (req.uid !== resourceId) {
    res.status(403).json({
      success: false,
      message: 'Access denied: You can only access your own resources'
    });
    return;
  }

  next();
};

/**
 * Rate limiting middleware for authentication endpoints
 */
export const authRateLimit = (maxAttempts: number = 5, windowMs: number = 15 * 60 * 1000) => {
  const attempts = new Map<string, { count: number; resetTime: number }>();

  return (req: Request, res: Response, next: NextFunction): void => {
    const ip = req.ip || req.connection.remoteAddress || 'unknown';
    const now = Date.now();
    
    const userAttempts = attempts.get(ip);
    
    if (!userAttempts || now > userAttempts.resetTime) {
      attempts.set(ip, { count: 1, resetTime: now + windowMs });
      next();
      return;
    }

    if (userAttempts.count >= maxAttempts) {
      res.status(429).json({
        success: false,
        message: 'Too many authentication attempts. Please try again later.'
      });
      return;
    }

    userAttempts.count++;
    next();
  };
};
