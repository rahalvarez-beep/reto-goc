import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { prisma } from '../config/database';
import { env } from '../config/env';
import { JwtPayload, AuthenticatedRequest } from '../types';

export const authenticateToken = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = (req.headers as any)['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
      res.status(401).json({
        success: false,
        message: 'Access token required',
        error: 'UNAUTHORIZED'
      });
      return;
    }

    // Verify JWT token
    const decoded = jwt.verify(token, env.JWT_SECRET) as JwtPayload;
    
    // Check if user still exists and is active
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        isActive: true,
        avatar: true,
        preferences: true,
        createdAt: true,
        updatedAt: true
      }
    });

    if (!user || !user.isActive) {
      res.status(401).json({
        success: false,
        message: 'User not found or inactive',
        error: 'UNAUTHORIZED'
      });
      return;
    }

    // Attach user to request
    req.user = user as any;
    next();
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      res.status(401).json({
        success: false,
        message: 'Invalid token',
        error: 'INVALID_TOKEN'
      });
      return;
    }

    if (error instanceof jwt.TokenExpiredError) {
      res.status(401).json({
        success: false,
        message: 'Token expired',
        error: 'TOKEN_EXPIRED'
      });
      return;
    }

    console.error('Auth middleware error:', error);
    res.status(500).json({
      success: false,
      message: 'Authentication error',
      error: 'INTERNAL_ERROR'
    });
  }
};

export const requireRole = (roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!(req as any).user) {
      res.status(401).json({
        success: false,
        message: 'Authentication required',
        error: 'UNAUTHORIZED'
      });
      return;
    }

    if (!roles.includes((req as any).user.role)) {
      res.status(403).json({
        success: false,
        message: 'Insufficient permissions',
        error: 'FORBIDDEN'
      });
      return;
    }

    next();
  };
};

export const requireAdmin = requireRole(['ADMIN']);
export const requireOperator = requireRole(['ADMIN', 'OPERATOR']);
export const requireCitizen = requireRole(['CITIZEN', 'ADMIN', 'OPERATOR']);

// Optional authentication - doesn't fail if no token
export const optionalAuth = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = (req.headers as any)['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      next();
      return;
    }

    const decoded = jwt.verify(token, env.JWT_SECRET) as JwtPayload;
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        isActive: true,
        avatar: true,
        preferences: true,
        createdAt: true,
        updatedAt: true
      }
    });

    if (user && user.isActive) {
      req.user = user as any;
    }

    next();
  } catch (error) {
    // Ignore auth errors for optional auth
    next();
  }
};
