import { Request, Response, NextFunction } from 'express';
import Joi from 'joi';

// Validation middleware factory
export const validate = (schema: Joi.ObjectSchema) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const { error, value } = schema.validate(req.body, {
      abortEarly: false,
      stripUnknown: true,
      allowUnknown: false
    });

    if (error) {
      const errorDetails = error.details.map(detail => ({
        field: detail.path.join('.'),
        message: detail.message,
        value: detail.context?.value
      }));

      res.status(400).json({
        success: false,
        message: 'Validation failed',
        error: 'VALIDATION_ERROR',
        details: errorDetails
      });
      return;
    }

    // Replace req.body with validated and sanitized data
    req.body = value;
    next();
  };
};

// Query validation middleware
export const validateQuery = (schema: Joi.ObjectSchema) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const { error, value } = schema.validate(req.query, {
      abortEarly: false,
      stripUnknown: true,
      allowUnknown: false
    });

    if (error) {
      const errorDetails = error.details.map(detail => ({
        field: detail.path.join('.'),
        message: detail.message,
        value: detail.context?.value
      }));

      res.status(400).json({
        success: false,
        message: 'Query validation failed',
        error: 'VALIDATION_ERROR',
        details: errorDetails
      });
      return;
    }

    req.query = value;
    next();
  };
};

// Params validation middleware
export const validateParams = (schema: Joi.ObjectSchema) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const { error, value } = schema.validate(req.params, {
      abortEarly: false,
      stripUnknown: true,
      allowUnknown: false
    });

    if (error) {
      const errorDetails = error.details.map(detail => ({
        field: detail.path.join('.'),
        message: detail.message,
        value: detail.context?.value
      }));

      res.status(400).json({
        success: false,
        message: 'Params validation failed',
        error: 'VALIDATION_ERROR',
        details: errorDetails
      });
      return;
    }

    req.params = value;
    next();
  };
};

// Common validation schemas
export const commonSchemas = {
  // Pagination
  pagination: Joi.object({
    page: Joi.number().integer().min(1).default(1),
    limit: Joi.number().integer().min(1).max(100).default(10),
    sortBy: Joi.string().valid('createdAt', 'updatedAt', 'name', 'email').default('createdAt'),
    sortOrder: Joi.string().valid('asc', 'desc').default('desc')
  }),

  // ID parameter
  idParam: Joi.object({
    id: Joi.string().required()
  }),

  // Email
  email: Joi.string().email().required().messages({
    'string.email': 'Please provide a valid email address'
  }),

  // Password
  password: Joi.string()
    .min(8)
    .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
    .required()
    .messages({
      'string.min': 'Password must be at least 8 characters long',
      'string.pattern.base': 'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'
    }),

  // Phone number
  phone: Joi.string()
    .pattern(/^\+?[\d\s\-\(\)]+$/)
    .optional()
    .messages({
      'string.pattern.base': 'Please provide a valid phone number'
    }),

  // Coordinates
  coordinates: Joi.object({
    latitude: Joi.number().min(-90).max(90).required(),
    longitude: Joi.number().min(-180).max(180).required()
  }),

  // Date range
  dateRange: Joi.object({
    startDate: Joi.date().optional(),
    endDate: Joi.date().min(Joi.ref('startDate')).optional()
  })
};

// Error handler for validation errors
export const handleValidationError = (error: any, req: Request, res: Response, next: NextFunction): void => {
  if (error instanceof Joi.ValidationError) {
    const errorDetails = error.details.map(detail => ({
      field: detail.path.join('.'),
      message: detail.message,
      value: detail.context?.value
    }));

    res.status(400).json({
      success: false,
      message: 'Validation failed',
      error: 'VALIDATION_ERROR',
      details: errorDetails
    });
    return;
  }

  next(error);
};
