import { Request, Response, NextFunction } from 'express';

export interface AppError extends Error {
  statusCode?: number;
  isOperational?: boolean;
  code?: string;
}

/**
 * Custom error class for operational errors
 */
export class OperationalError extends Error implements AppError {
  public statusCode: number;
  public isOperational: boolean;
  public code?: string;

  constructor(message: string, statusCode: number = 500, code?: string) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;
    this.code = code;

    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * Error handler middleware
 */
export const errorHandler = (
  error: AppError,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  let { statusCode = 500, message, code } = error;

  // Log error
  console.error('Error occurred:', {
    message: error.message,
    stack: error.stack,
    url: req.url,
    method: req.method,
    ip: req.ip,
    userAgent: req.get('User-Agent'),
    timestamp: new Date().toISOString()
  });

  // Handle Firebase Auth errors
  if (error.code) {
    switch (error.code) {
      case 'auth/user-not-found':
        statusCode = 404;
        message = 'User not found';
        break;
      case 'auth/email-already-exists':
        statusCode = 409;
        message = 'Email already exists';
        break;
      case 'auth/invalid-email':
        statusCode = 400;
        message = 'Invalid email address';
        break;
      case 'auth/weak-password':
        statusCode = 400;
        message = 'Password is too weak';
        break;
      case 'auth/id-token-expired':
        statusCode = 401;
        message = 'Token has expired';
        break;
      case 'auth/id-token-revoked':
        statusCode = 401;
        message = 'Token has been revoked';
        break;
      case 'auth/invalid-id-token':
        statusCode = 401;
        message = 'Invalid token';
        break;
      case 'auth/insufficient-permission':
        statusCode = 403;
        message = 'Insufficient permissions';
        break;
      default:
        // Keep original status code and message for other Firebase errors
        break;
    }
  }

  // Handle validation errors
  if (error.name === 'ValidationError') {
    statusCode = 400;
    message = 'Validation failed';
  }

  // Handle JSON parsing errors
  if (error instanceof SyntaxError && 'body' in error) {
    statusCode = 400;
    message = 'Invalid JSON payload';
  }

  // Handle rate limiting errors
  if (error.message && error.message.includes('Too many requests')) {
    statusCode = 429;
    message = 'Too many requests. Please try again later.';
  }

  // Don't leak error details in production
  if (process.env.NODE_ENV === 'production' && !error.isOperational) {
    message = 'Internal server error';
    code = undefined;
  }

  // Send error response
  res.status(statusCode).json({
    success: false,
    message,
    ...(code && { code }),
    ...(process.env.NODE_ENV === 'development' && { stack: error.stack })
  });
};

/**
 * 404 handler for undefined routes
 */
export const notFoundHandler = (req: Request, res: Response): void => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
    path: req.originalUrl,
    method: req.method
  });
};

/**
 * Async error wrapper to catch async errors in route handlers
 */
export const asyncHandler = (fn: Function) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

/**
 * Error response helper
 */
export const createErrorResponse = (message: string, statusCode: number = 500, code?: string) => {
  const error = new OperationalError(message, statusCode, code);
  return error;
};

/**
 * Success response helper
 */
export const createSuccessResponse = (data: any, message: string = 'Success') => {
  return {
    success: true,
    message,
    data
  };
};
