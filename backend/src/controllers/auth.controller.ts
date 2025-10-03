import { Request, Response } from 'express';
import { AuthService } from '../services/auth.service';
import { CreateUserDto, LoginDto } from '../types';
import { validate } from '../middleware/validation';
import Joi from 'joi';
import { commonSchemas } from '../middleware/validation';

// Validation schemas
const registerSchema = Joi.object({
  email: commonSchemas.email,
  password: commonSchemas.password,
  firstName: Joi.string().min(2).max(50).required(),
  lastName: Joi.string().min(2).max(50).required(),
  phone: commonSchemas.phone,
  address: Joi.string().max(200).optional(),
  city: Joi.string().max(100).optional(),
  postalCode: Joi.string().max(20).optional(),
  role: Joi.string().valid('CITIZEN', 'ADMIN', 'OPERATOR').optional()
});

const loginSchema = Joi.object({
  email: commonSchemas.email,
  password: Joi.string().required()
});

const changePasswordSchema = Joi.object({
  currentPassword: Joi.string().required(),
  newPassword: commonSchemas.password
});

const refreshTokenSchema = Joi.object({
  refreshToken: Joi.string().required()
});

export class AuthController {
  // Register new user
  static register = [
    validate(registerSchema),
    async (req: Request, res: Response): Promise<void> => {
      try {
        const userData: CreateUserDto = req.body;
        const result = await AuthService.register(userData);

        res.status(201).json({
          success: true,
          message: 'User registered successfully',
          data: result
        });
      } catch (error: any) {
        console.error('Register error:', error);
        res.status(400).json({
          success: false,
          message: error.message || 'Registration failed',
          error: 'REGISTRATION_ERROR'
        });
      }
    }
  ];

  // Login user
  static login = [
    validate(loginSchema),
    async (req: Request, res: Response): Promise<void> => {
      try {
        const loginData: LoginDto = req.body;
        const result = await AuthService.login(loginData);

        res.json({
          success: true,
          message: 'Login successful',
          data: result
        });
      } catch (error: any) {
        console.error('Login error:', error);
        res.status(401).json({
          success: false,
          message: error.message || 'Login failed',
          error: 'LOGIN_ERROR'
        });
      }
    }
  ];

  // Refresh token
  static refreshToken = [
    validate(refreshTokenSchema),
    async (req: Request, res: Response): Promise<void> => {
      try {
        const { refreshToken } = req.body;
        const result = await AuthService.refreshToken(refreshToken);

        res.json({
          success: true,
          message: 'Token refreshed successfully',
          data: result
        });
      } catch (error: any) {
        console.error('Refresh token error:', error);
        res.status(401).json({
          success: false,
          message: error.message || 'Token refresh failed',
          error: 'REFRESH_ERROR'
        });
      }
    }
  ];

  // Logout user
  static logout = [
    validate(refreshTokenSchema),
    async (req: Request, res: Response): Promise<void> => {
      try {
        const { refreshToken } = req.body;
        await AuthService.logout(refreshToken);

        res.json({
          success: true,
          message: 'Logout successful'
        });
      } catch (error: any) {
        console.error('Logout error:', error);
        res.status(500).json({
          success: false,
          message: error.message || 'Logout failed',
          error: 'LOGOUT_ERROR'
        });
      }
    }
  ];

  // Logout all sessions
  static logoutAll = async (req: any, res: Response): Promise<void> => {
    try {
      const userId = req.user.id;
      await AuthService.logoutAll(userId);

      res.json({
        success: true,
        message: 'All sessions logged out successfully'
      });
    } catch (error: any) {
      console.error('Logout all error:', error);
      res.status(500).json({
        success: false,
        message: error.message || 'Logout all failed',
        error: 'LOGOUT_ALL_ERROR'
      });
    }
  };

  // Change password
  static changePassword = [
    validate(changePasswordSchema),
    async (req: any, res: Response): Promise<void> => {
      try {
        const userId = req.user.id;
        const { currentPassword, newPassword } = req.body;
        
        await AuthService.changePassword(userId, currentPassword, newPassword);

        res.json({
          success: true,
          message: 'Password changed successfully'
        });
      } catch (error: any) {
        console.error('Change password error:', error);
        res.status(400).json({
          success: false,
          message: error.message || 'Password change failed',
          error: 'PASSWORD_CHANGE_ERROR'
        });
      }
    }
  ];

  // Get current user profile
  static getProfile = async (req: any, res: Response): Promise<void> => {
    try {
      const user = req.user;

      res.json({
        success: true,
        message: 'Profile retrieved successfully',
        data: { user }
      });
    } catch (error: any) {
      console.error('Get profile error:', error);
      res.status(500).json({
        success: false,
        message: error.message || 'Failed to get profile',
        error: 'PROFILE_ERROR'
      });
    }
  };

  // Verify token
  static verifyToken = async (req: Request, res: Response): Promise<void> => {
    try {
      const authHeader = req.headers.authorization;
      const token = authHeader && authHeader.split(' ')[1];

      if (!token) {
        res.status(401).json({
          success: false,
          message: 'No token provided',
          error: 'NO_TOKEN'
        });
        return;
      }

      const decoded = await AuthService.verifyToken(token);
      
      if (!decoded) {
        res.status(401).json({
          success: false,
          message: 'Invalid token',
          error: 'INVALID_TOKEN'
        });
        return;
      }

      res.json({
        success: true,
        message: 'Token is valid',
        data: { user: decoded }
      });
    } catch (error: any) {
      console.error('Verify token error:', error);
      res.status(500).json({
        success: false,
        message: error.message || 'Token verification failed',
        error: 'VERIFY_ERROR'
      });
    }
  };
}
