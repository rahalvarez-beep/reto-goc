import { Router } from 'express';
import authRoutes from './auth.routes';
import accidentRoutes from './accident.routes';

const router = Router();

// Health check endpoint
router.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'Smart City API is running',
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});

// API routes
router.use('/auth', authRoutes);
router.use('/accidents', accidentRoutes);

// 404 handler for API routes
router.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'API endpoint not found',
    error: 'NOT_FOUND',
    path: req.originalUrl
  });
});

export default router;
