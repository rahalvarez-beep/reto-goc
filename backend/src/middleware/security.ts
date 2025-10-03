import { Request, Response, NextFunction } from 'express';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import { env } from '../config/env';

// Rate limiting configuration
export const createRateLimit = (windowMs: number, max: number, message?: string) => {
  return rateLimit({
    windowMs,
    max,
    message: {
      success: false,
      message: message || 'Too many requests, please try again later',
      error: 'RATE_LIMIT_EXCEEDED'
    },
    standardHeaders: true,
    legacyHeaders: false,
    handler: (req: Request, res: Response) => {
      res.status(429).json({
        success: false,
        message: message || 'Too many requests, please try again later',
        error: 'RATE_LIMIT_EXCEEDED',
        retryAfter: Math.round(windowMs / 1000)
      });
    }
  });
};

// General rate limiting
export const generalRateLimit = createRateLimit(
  env.RATE_LIMIT_WINDOW * 60 * 1000, // Convert minutes to milliseconds
  env.RATE_LIMIT_MAX,
  'Too many requests from this IP, please try again later'
);

// Strict rate limiting for auth endpoints
export const authRateLimit = createRateLimit(
  15 * 60 * 1000, // 15 minutes
  5, // 5 attempts
  'Too many authentication attempts, please try again later'
);

// File upload rate limiting
export const uploadRateLimit = createRateLimit(
  60 * 60 * 1000, // 1 hour
  10, // 10 uploads per hour
  'Too many file uploads, please try again later'
);

// API rate limiting
export const apiRateLimit = createRateLimit(
  15 * 60 * 1000, // 15 minutes
  100, // 100 requests per 15 minutes
  'API rate limit exceeded, please try again later'
);

// Helmet security configuration
export const securityHeaders = helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      imgSrc: ["'self'", "data:", "https:"],
      scriptSrc: ["'self'"],
      connectSrc: ["'self'"],
      frameSrc: ["'none'"],
      objectSrc: ["'none'"],
      upgradeInsecureRequests: []
    }
  },
  crossOriginEmbedderPolicy: false,
  hsts: {
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true
  }
});

// CORS configuration
export const corsOptions = {
  origin: (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) => {
    // Allow requests with no origin (mobile apps, Postman, etc.)
    if (!origin) return callback(null, true);
    
    const allowedOrigins = [
      env.CORS_ORIGIN,
      'http://localhost:3000',
      'http://localhost:3001',
      'http://127.0.0.1:3000',
      'http://127.0.0.1:3001'
    ];
    
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  exposedHeaders: ['X-Total-Count', 'X-Page-Count']
};

// Request size limiting
export const requestSizeLimit = (req: Request, res: Response, next: NextFunction): void => {
  const contentLength = parseInt(req.headers['content-length'] || '0');
  const maxSize = env.MAX_FILE_SIZE;

  if (contentLength > maxSize) {
    res.status(413).json({
      success: false,
      message: 'Request entity too large',
      error: 'PAYLOAD_TOO_LARGE',
      maxSize: maxSize
    });
    return;
  }

  next();
};

// IP whitelist middleware (for admin endpoints)
export const ipWhitelist = (allowedIPs: string[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const clientIP = req.ip || req.connection.remoteAddress || req.socket.remoteAddress;
    
    if (!clientIP || !allowedIPs.includes(clientIP)) {
      res.status(403).json({
        success: false,
        message: 'Access denied from this IP address',
        error: 'IP_NOT_ALLOWED'
      });
      return;
    }

    next();
  };
};

// Security headers middleware
export const securityHeadersMiddleware = (req: Request, res: Response, next: NextFunction): void => {
  // Remove X-Powered-By header
  res.removeHeader('X-Powered-By');
  
  // Add security headers
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.setHeader('Permissions-Policy', 'geolocation=(), microphone=(), camera=()');
  
  next();
};

// Request logging for security monitoring
export const securityLogger = (req: Request, res: Response, next: NextFunction): void => {
  const startTime = Date.now();
  const clientIP = req.ip || req.connection.remoteAddress || 'unknown';
  const userAgent = req.get('User-Agent') || 'unknown';
  
  // Log suspicious requests
  const suspiciousPatterns = [
    /\.\.\//, // Directory traversal
    /<script/i, // XSS attempts
    /union.*select/i, // SQL injection
    /eval\(/i, // Code injection
    /javascript:/i // JavaScript injection
  ];
  
  const isSuspicious = suspiciousPatterns.some(pattern => 
    pattern.test(req.url) || pattern.test(req.body?.toString() || '')
  );
  
  if (isSuspicious) {
    console.warn(`🚨 Suspicious request detected:`, {
      ip: clientIP,
      method: req.method,
      url: req.url,
      userAgent,
      timestamp: new Date().toISOString()
    });
  }
  
  // Log response time
  res.on('finish', () => {
    const duration = Date.now() - startTime;
    const status = res.statusCode;
    
    if (status >= 400) {
      console.warn(`⚠️  Error response:`, {
        ip: clientIP,
        method: req.method,
        url: req.url,
        status,
        duration: `${duration}ms`,
        timestamp: new Date().toISOString()
      });
    }
  });
  
  next();
};
