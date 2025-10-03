import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { prisma } from '../config/database';
import { env } from '../config/env';
import { CreateUserDto, LoginDto, AuthResponse, JwtPayload } from '../types';
import { UserRole } from '@prisma/client';

export class AuthService {
  // Generate JWT token
  private static generateToken(payload: JwtPayload): string {
    return jwt.sign(payload, env.JWT_SECRET, {
      expiresIn: env.JWT_EXPIRES_IN,
      issuer: 'smart-city-api',
      audience: 'smart-city-client'
    } as jwt.SignOptions);
  }

  // Generate refresh token
  private static generateRefreshToken(payload: JwtPayload): string {
    return jwt.sign(payload, env.JWT_SECRET, {
      expiresIn: env.JWT_REFRESH_EXPIRES_IN,
      issuer: 'smart-city-api',
      audience: 'smart-city-client'
    } as jwt.SignOptions);
  }

  // Hash password
  private static async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, env.BCRYPT_ROUNDS);
  }

  // Verify password
  private static async verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
    return bcrypt.compare(password, hashedPassword);
  }

  // Register new user
  static async register(userData: CreateUserDto): Promise<AuthResponse> {
    try {
      // Check if user already exists
      const existingUser = await prisma.user.findUnique({
        where: { email: userData.email }
      });

      if (existingUser) {
        throw new Error('User with this email already exists');
      }

      // Hash password
      const hashedPassword = await this.hashPassword(userData.password);

      // Create user
      const user = await prisma.user.create({
        data: {
          email: userData.email,
          password: hashedPassword,
          firstName: userData.firstName,
          lastName: userData.lastName,
          phone: userData.phone,
          address: userData.address,
          city: userData.city,
          postalCode: userData.postalCode,
          role: userData.role || UserRole.CITIZEN,
          preferences: {
            notifications: true,
            language: 'es',
            theme: 'light',
            emailUpdates: true
          }
        },
        select: {
          id: true,
          email: true,
          firstName: true,
          lastName: true,
          phone: true,
          address: true,
          city: true,
          postalCode: true,
          role: true,
          isActive: true,
          avatar: true,
          preferences: true,
          createdAt: true,
          updatedAt: true
        }
      });

      // Generate tokens
      const tokenPayload: JwtPayload = {
        userId: user.id,
        email: user.email,
        role: user.role
      };

      const token = this.generateToken(tokenPayload);
      const refreshToken = this.generateRefreshToken(tokenPayload);

      // Store refresh token in database
      await prisma.session.create({
        data: {
          userId: user.id,
          token: refreshToken,
          expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days
        }
      });

      return {
        user: user as any,
        token,
        refreshToken
      };
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  }

  // Login user
  static async login(loginData: LoginDto): Promise<AuthResponse> {
    try {
      // Find user by email
      const user = await prisma.user.findUnique({
        where: { email: loginData.email }
      });

      if (!user) {
        throw new Error('Invalid email or password');
      }

      // Check if user is active
      if (!user.isActive) {
        throw new Error('Account is deactivated');
      }

      // Verify password
      const isPasswordValid = await this.verifyPassword(loginData.password, user.password);
      if (!isPasswordValid) {
        throw new Error('Invalid email or password');
      }

      // Generate tokens
      const tokenPayload: JwtPayload = {
        userId: user.id,
        email: user.email,
        role: user.role
      };

      const token = this.generateToken(tokenPayload);
      const refreshToken = this.generateRefreshToken(tokenPayload);

      // Store refresh token in database
      await prisma.session.create({
        data: {
          userId: user.id,
          token: refreshToken,
          expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days
        }
      });

      // Return user without password
      const { password, ...userWithoutPassword } = user;

      return {
        user: userWithoutPassword as any,
        token,
        refreshToken
      };
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  }

  // Refresh token
  static async refreshToken(refreshToken: string): Promise<{ token: string; refreshToken: string }> {
    try {
      // Verify refresh token
      const decoded = jwt.verify(refreshToken, env.JWT_SECRET) as JwtPayload;

      // Check if session exists and is valid
      const session = await prisma.session.findFirst({
        where: {
          token: refreshToken,
          userId: decoded.userId,
          expiresAt: {
            gt: new Date()
          }
        },
        include: {
          user: {
            select: {
              id: true,
              email: true,
              role: true,
              isActive: true
            }
          }
        }
      });

      if (!session || !session.user.isActive) {
        throw new Error('Invalid refresh token');
      }

      // Generate new tokens
      const tokenPayload: JwtPayload = {
        userId: session.user.id,
        email: session.user.email,
        role: session.user.role
      };

      const newToken = this.generateToken(tokenPayload);
      const newRefreshToken = this.generateRefreshToken(tokenPayload);

      // Update session with new refresh token
      await prisma.session.update({
        where: { id: session.id },
        data: {
          token: newRefreshToken,
          expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days
        }
      });

      return {
        token: newToken,
        refreshToken: newRefreshToken
      };
    } catch (error) {
      console.error('Refresh token error:', error);
      throw error;
    }
  }

  // Logout user
  static async logout(refreshToken: string): Promise<void> {
    try {
      // Remove session from database
      await prisma.session.deleteMany({
        where: { token: refreshToken }
      });
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    }
  }

  // Logout all sessions for user
  static async logoutAll(userId: string): Promise<void> {
    try {
      // Remove all sessions for user
      await prisma.session.deleteMany({
        where: { userId }
      });
    } catch (error) {
      console.error('Logout all error:', error);
      throw error;
    }
  }

  // Change password
  static async changePassword(userId: string, currentPassword: string, newPassword: string): Promise<void> {
    try {
      // Get user with password
      const user = await prisma.user.findUnique({
        where: { id: userId }
      });

      if (!user) {
        throw new Error('User not found');
      }

      // Verify current password
      const isCurrentPasswordValid = await this.verifyPassword(currentPassword, user.password);
      if (!isCurrentPasswordValid) {
        throw new Error('Current password is incorrect');
      }

      // Hash new password
      const hashedNewPassword = await this.hashPassword(newPassword);

      // Update password
      await prisma.user.update({
        where: { id: userId },
        data: { password: hashedNewPassword }
      });

      // Logout all sessions to force re-login
      await this.logoutAll(userId);
    } catch (error) {
      console.error('Change password error:', error);
      throw error;
    }
  }

  // Verify token (for middleware)
  static async verifyToken(token: string): Promise<JwtPayload | null> {
    try {
      const decoded = jwt.verify(token, env.JWT_SECRET) as JwtPayload;
      return decoded;
    } catch (error) {
      return null;
    }
  }
}
