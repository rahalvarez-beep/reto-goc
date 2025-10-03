import { Request, Response } from 'express';
import { prisma } from '../config/database';
import { CreateAccidentDto, AccidentFilters } from '../types';
import { validate, validateQuery } from '../middleware/validation';
import Joi from 'joi';
import { commonSchemas } from '../middleware/validation';
import { AccidentType, AccidentSeverity } from '@prisma/client';

// Validation schemas
const createAccidentSchema = Joi.object({
  location: Joi.string().min(5).max(200).required(),
  type: Joi.string().valid(...Object.values(AccidentType)).required(),
  severity: Joi.string().valid(...Object.values(AccidentSeverity)).required(),
  date: Joi.date().max('now').required(),
  description: Joi.string().max(500).optional(),
  latitude: Joi.number().min(-90).max(90).required(),
  longitude: Joi.number().min(-180).max(180).required()
});

const accidentFiltersSchema = Joi.object({
  type: Joi.string().valid(...Object.values(AccidentType)).optional(),
  severity: Joi.string().valid(...Object.values(AccidentSeverity)).optional(),
  startDate: Joi.date().optional(),
  endDate: Joi.date().min(Joi.ref('startDate')).optional(),
  latitude: Joi.number().min(-90).max(90).optional(),
  longitude: Joi.number().min(-180).max(180).optional(),
  radius: Joi.number().min(0).max(100).optional(), // km
  ...commonSchemas.pagination.describe()
});

const updateAccidentSchema = Joi.object({
  location: Joi.string().min(5).max(200).optional(),
  type: Joi.string().valid(...Object.values(AccidentType)).optional(),
  severity: Joi.string().valid(...Object.values(AccidentSeverity)).optional(),
  date: Joi.date().max('now').optional(),
  description: Joi.string().max(500).optional(),
  latitude: Joi.number().min(-90).max(90).optional(),
  longitude: Joi.number().min(-180).max(180).optional()
});

export class AccidentController {
  // Get all accidents with filters
  static getAccidents = [
    validateQuery(accidentFiltersSchema),
    async (req: Request, res: Response): Promise<void> => {
      try {
        const {
          type,
          severity,
          startDate,
          endDate,
          latitude,
          longitude,
          radius,
          page = 1,
          limit = 10,
          sortBy = 'createdAt',
          sortOrder = 'desc'
        } = req.query as any;

        // Build where clause
        const where: any = {};

        if (type) where.type = type;
        if (severity) where.severity = severity;
        if (startDate || endDate) {
          where.date = {};
          if (startDate) where.date.gte = new Date(startDate);
          if (endDate) where.date.lte = new Date(endDate);
        }

        // Geographic filtering
        if (latitude && longitude && radius) {
          // Simple bounding box approximation (for production, use PostGIS)
          const latRange = radius / 111; // Rough conversion: 1 degree ≈ 111 km
          const lngRange = radius / (111 * Math.cos(latitude * Math.PI / 180));
          
          where.latitude = {
            gte: latitude - latRange,
            lte: latitude + latRange
          };
          where.longitude = {
            gte: longitude - lngRange,
            lte: longitude + lngRange
          };
        }

        // Get total count
        const total = await prisma.accident.count({ where });

        // Get accidents with pagination
        const accidents = await prisma.accident.findMany({
          where,
          include: {
            user: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true
              }
            }
          },
          orderBy: { [sortBy]: sortOrder },
          skip: (page - 1) * limit,
          take: limit
        });

        const totalPages = Math.ceil(total / limit);

        res.json({
          success: true,
          message: 'Accidents retrieved successfully',
          data: accidents,
          pagination: {
            page: Number(page),
            limit: Number(limit),
            total,
            totalPages
          }
        });
      } catch (error: any) {
        console.error('Get accidents error:', error);
        res.status(500).json({
          success: false,
          message: error.message || 'Failed to retrieve accidents',
          error: 'GET_ACCIDENTS_ERROR'
        });
      }
    }
  ];

  // Get accident by ID
  static getAccidentById = [
    validate(commonSchemas.idParam),
    async (req: Request, res: Response): Promise<void> => {
      try {
        const { id } = req.params;

        const accident = await prisma.accident.findUnique({
          where: { id },
          include: {
            user: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true
              }
            }
          }
        });

        if (!accident) {
          res.status(404).json({
            success: false,
            message: 'Accident not found',
            error: 'ACCIDENT_NOT_FOUND'
          });
          return;
        }

        res.json({
          success: true,
          message: 'Accident retrieved successfully',
          data: accident
        });
      } catch (error: any) {
        console.error('Get accident by ID error:', error);
        res.status(500).json({
          success: false,
          message: error.message || 'Failed to retrieve accident',
          error: 'GET_ACCIDENT_ERROR'
        });
      }
    }
  ];

  // Create new accident
  static createAccident = [
    validate(createAccidentSchema),
    async (req: any, res: Response): Promise<void> => {
      try {
        const accidentData: CreateAccidentDto = req.body;
        const userId = req.user?.id;

        const accident = await prisma.accident.create({
          data: {
            ...accidentData,
            reportedBy: userId
          },
          include: {
            user: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true
              }
            }
          }
        });

        res.status(201).json({
          success: true,
          message: 'Accident reported successfully',
          data: accident
        });
      } catch (error: any) {
        console.error('Create accident error:', error);
        res.status(400).json({
          success: false,
          message: error.message || 'Failed to create accident',
          error: 'CREATE_ACCIDENT_ERROR'
        });
      }
    }
  ];

  // Update accident
  static updateAccident = [
    validate(commonSchemas.idParam),
    validate(updateAccidentSchema),
    async (req: any, res: Response): Promise<void> => {
      try {
        const { id } = req.params;
        const updateData = req.body;
        const userId = req.user?.id;
        const userRole = req.user?.role;

        // Check if accident exists
        const existingAccident = await prisma.accident.findUnique({
          where: { id }
        });

        if (!existingAccident) {
          res.status(404).json({
            success: false,
            message: 'Accident not found',
            error: 'ACCIDENT_NOT_FOUND'
          });
          return;
        }

        // Check permissions (only admin, operator, or the reporter can update)
        if (userRole !== 'ADMIN' && userRole !== 'OPERATOR' && existingAccident.reportedBy !== userId) {
          res.status(403).json({
            success: false,
            message: 'Insufficient permissions to update this accident',
            error: 'INSUFFICIENT_PERMISSIONS'
          });
          return;
        }

        const accident = await prisma.accident.update({
          where: { id },
          data: updateData,
          include: {
            user: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true
              }
            }
          }
        });

        res.json({
          success: true,
          message: 'Accident updated successfully',
          data: accident
        });
      } catch (error: any) {
        console.error('Update accident error:', error);
        res.status(400).json({
          success: false,
          message: error.message || 'Failed to update accident',
          error: 'UPDATE_ACCIDENT_ERROR'
        });
      }
    }
  ];

  // Delete accident
  static deleteAccident = [
    validate(commonSchemas.idParam),
    async (req: any, res: Response): Promise<void> => {
      try {
        const { id } = req.params;
        const userId = req.user?.id;
        const userRole = req.user?.role;

        // Check if accident exists
        const existingAccident = await prisma.accident.findUnique({
          where: { id }
        });

        if (!existingAccident) {
          res.status(404).json({
            success: false,
            message: 'Accident not found',
            error: 'ACCIDENT_NOT_FOUND'
          });
          return;
        }

        // Check permissions (only admin or operator can delete)
        if (userRole !== 'ADMIN' && userRole !== 'OPERATOR') {
          res.status(403).json({
            success: false,
            message: 'Insufficient permissions to delete this accident',
            error: 'INSUFFICIENT_PERMISSIONS'
          });
          return;
        }

        await prisma.accident.delete({
          where: { id }
        });

        res.json({
          success: true,
          message: 'Accident deleted successfully'
        });
      } catch (error: any) {
        console.error('Delete accident error:', error);
        res.status(500).json({
          success: false,
          message: error.message || 'Failed to delete accident',
          error: 'DELETE_ACCIDENT_ERROR'
        });
      }
    }
  ];

  // Get accident statistics
  static getAccidentStats = async (req: Request, res: Response): Promise<void> => {
    try {
      const { startDate, endDate } = req.query as any;

      const where: any = {};
      if (startDate || endDate) {
        where.date = {};
        if (startDate) where.date.gte = new Date(startDate);
        if (endDate) where.date.lte = new Date(endDate);
      }

      // Get total accidents
      const total = await prisma.accident.count({ where });

      // Get accidents by type
      const byType = await prisma.accident.groupBy({
        by: ['type'],
        where,
        _count: { type: true }
      });

      // Get accidents by severity
      const bySeverity = await prisma.accident.groupBy({
        by: ['severity'],
        where,
        _count: { severity: true }
      });

      // Get accidents this month
      const thisMonth = new Date();
      thisMonth.setDate(1);
      thisMonth.setHours(0, 0, 0, 0);

      const accidentsThisMonth = await prisma.accident.count({
        where: {
          ...where,
          date: { gte: thisMonth }
        }
      });

      // Get accidents last month
      const lastMonth = new Date();
      lastMonth.setMonth(lastMonth.getMonth() - 1);
      lastMonth.setDate(1);
      lastMonth.setHours(0, 0, 0, 0);

      const lastMonthEnd = new Date();
      lastMonthEnd.setDate(0);
      lastMonthEnd.setHours(23, 59, 59, 999);

      const accidentsLastMonth = await prisma.accident.count({
        where: {
          ...where,
          date: { gte: lastMonth, lte: lastMonthEnd }
        }
      });

      // Calculate trend
      const trend = accidentsThisMonth > accidentsLastMonth ? 'up' : 
                   accidentsThisMonth < accidentsLastMonth ? 'down' : 'stable';

      const stats = {
        total,
        byType: byType.reduce((acc, item) => {
          acc[item.type] = item._count.type;
          return acc;
        }, {} as Record<string, number>),
        bySeverity: bySeverity.reduce((acc, item) => {
          acc[item.severity] = item._count.severity;
          return acc;
        }, {} as Record<string, number>),
        thisMonth: accidentsThisMonth,
        lastMonth: accidentsLastMonth,
        trend
      };

      res.json({
        success: true,
        message: 'Accident statistics retrieved successfully',
        data: stats
      });
    } catch (error: any) {
      console.error('Get accident stats error:', error);
      res.status(500).json({
        success: false,
        message: error.message || 'Failed to retrieve accident statistics',
        error: 'GET_ACCIDENT_STATS_ERROR'
      });
    }
  };
}
