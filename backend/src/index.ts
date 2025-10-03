import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import morgan from 'morgan';
import { env, isDevelopment } from './config/env';
import { connectRedis } from './config/redis';
import { securityHeaders, corsOptions, generalRateLimit } from './middleware/security';
import routes from './routes';
import { handleValidationError } from './middleware/validation';

// Create Express app
const app = express();

// Trust proxy (for rate limiting and IP detection)
app.set('trust proxy', 1);

// Security middleware
app.use(helmet());
app.use(securityHeaders);

// CORS
app.use(cors(corsOptions));

// Compression
app.use(compression());

// Request logging
if (isDevelopment) {
  app.use(morgan('dev'));
} else {
  app.use(morgan('combined'));
}

// Body parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Rate limiting
app.use(generalRateLimit);

// API routes
app.use('/api', routes);

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Welcome to Smart City Identity Management API',
    version: '1.0.0',
    documentation: '/api/docs',
    health: '/api/health'
  });
});

// Error handling middleware
app.use(handleValidationError);

// Global error handler
app.use((error: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Global error handler:', error);

  // Don't leak error details in production
  const message = isDevelopment ? error.message : 'Internal server error';
  const stack = isDevelopment ? error.stack : undefined;

  res.status(error.status || 500).json({
    success: false,
    message,
    error: error.name || 'INTERNAL_ERROR',
    ...(isDevelopment && { stack })
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Endpoint not found',
    error: 'NOT_FOUND',
    path: req.originalUrl
  });
});

// Start server
const startServer = async () => {
  try {
    // Connect to Redis
    await connectRedis();

    // Start HTTP server
    const server = app.listen(env.PORT, () => {
      console.log(`🚀 Smart City API server running on port ${env.PORT}`);
      console.log(`📊 Environment: ${env.NODE_ENV}`);
      console.log(`🌐 CORS Origin: ${env.CORS_ORIGIN}`);
      console.log(`📚 API Documentation: http://localhost:${env.PORT}/api/docs`);
      console.log(`❤️  Health Check: http://localhost:${env.PORT}/api/health`);
    });

    // Graceful shutdown
    const gracefulShutdown = (signal: string) => {
      console.log(`\n${signal} received. Starting graceful shutdown...`);
      
      server.close(() => {
        console.log('HTTP server closed');
        process.exit(0);
      });

      // Force close after 10 seconds
      setTimeout(() => {
        console.error('Could not close connections in time, forcefully shutting down');
        process.exit(1);
      }, 10000);
    };

    process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
    process.on('SIGINT', () => gracefulShutdown('SIGINT'));

  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
  process.exit(1);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});

// Start the server
startServer();

export default app;
