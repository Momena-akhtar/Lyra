import { Request, Response, NextFunction } from 'express';

export interface ValidationRule {
  field: string;
  required?: boolean;
  type?: 'string' | 'number' | 'boolean' | 'email';
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  custom?: (value: any) => boolean | string;
}

export interface ValidationError {
  field: string;
  message: string;
}

/**
 * Generic validation middleware
 */
export const validateRequest = (rules: ValidationRule[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const errors: ValidationError[] = [];
    const body = req.body;

    rules.forEach(rule => {
      const value = body[rule.field];

      // Check if required
      if (rule.required && (value === undefined || value === null || value === '')) {
        errors.push({
          field: rule.field,
          message: `${rule.field} is required`
        });
        return;
      }

      // Skip validation if value is not provided and not required
      if (value === undefined || value === null) {
        return;
      }

      // Type validation
      if (rule.type) {
        switch (rule.type) {
          case 'string':
            if (typeof value !== 'string') {
              errors.push({
                field: rule.field,
                message: `${rule.field} must be a string`
              });
              return;
            }
            break;
          case 'number':
            if (typeof value !== 'number' || isNaN(value)) {
              errors.push({
                field: rule.field,
                message: `${rule.field} must be a valid number`
              });
              return;
            }
            break;
          case 'boolean':
            if (typeof value !== 'boolean') {
              errors.push({
                field: rule.field,
                message: `${rule.field} must be a boolean`
              });
              return;
            }
            break;
          case 'email':
            if (typeof value !== 'string' || !isValidEmail(value)) {
              errors.push({
                field: rule.field,
                message: `${rule.field} must be a valid email address`
              });
              return;
            }
            break;
        }
      }

      // String length validation
      if (rule.type === 'string' && typeof value === 'string') {
        if (rule.minLength && value.length < rule.minLength) {
          errors.push({
            field: rule.field,
            message: `${rule.field} must be at least ${rule.minLength} characters long`
          });
          return;
        }

        if (rule.maxLength && value.length > rule.maxLength) {
          errors.push({
            field: rule.field,
            message: `${rule.field} must be no more than ${rule.maxLength} characters long`
          });
          return;
        }
      }

      // Pattern validation
      if (rule.pattern && typeof value === 'string' && !rule.pattern.test(value)) {
        errors.push({
          field: rule.field,
          message: `${rule.field} format is invalid`
        });
        return;
      }

      // Custom validation
      if (rule.custom) {
        const customResult = rule.custom(value);
        if (customResult !== true) {
          errors.push({
            field: rule.field,
            message: typeof customResult === 'string' ? customResult : `${rule.field} validation failed`
          });
          return;
        }
      }
    });

    if (errors.length > 0) {
      res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors
      });
      return;
    }

    next();
  };
};

/**
 * Email validation helper
 */
function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Common validation rules
 */
export const commonValidations = {
  email: (field: string = 'email'): ValidationRule => ({
    field,
    required: true,
    type: 'email'
  }),

  password: (field: string = 'password', minLength: number = 6): ValidationRule => ({
    field,
    required: true,
    type: 'string',
    minLength
  }),

  displayName: (field: string = 'displayName', maxLength: number = 50): ValidationRule => ({
    field,
    required: false,
    type: 'string',
    maxLength
  }),

  idToken: (field: string = 'idToken'): ValidationRule => ({
    field,
    required: true,
    type: 'string',
    minLength: 10
  }),

  uid: (field: string = 'uid'): ValidationRule => ({
    field,
    required: true,
    type: 'string',
    minLength: 20
  })
};

/**
 * Predefined validation sets
 */
export const validationSets = {
  register: [
    commonValidations.email(),
    commonValidations.password(),
    commonValidations.displayName()
  ],

  googleAuth: [
    commonValidations.idToken()
  ],

  updateProfile: [
    commonValidations.displayName()
  ],

  verifyToken: [
    commonValidations.idToken()
  ]
};
