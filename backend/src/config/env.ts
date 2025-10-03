import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Environment configuration with defaults
export const env = {
  // Database
  DATABASE_URL: process.env.DATABASE_URL || 'postgresql://postgres:password@localhost:5432/smart_city_db',
  
  // JWT
  JWT_SECRET: process.env.JWT_SECRET || 'your-super-secret-jwt-key-here-change-in-production',
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '24h',
  JWT_REFRESH_EXPIRES_IN: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
  
  // Server
  PORT: parseInt(process.env.PORT || '3001', 10),
  NODE_ENV: (process.env.NODE_ENV as 'development' | 'production' | 'test') || 'development',
  CORS_ORIGIN: process.env.CORS_ORIGIN || 'http://localhost:3000',
  
  // Redis
  REDIS_URL: process.env.REDIS_URL || 'redis://localhost:6379',
  
  // Security
  BCRYPT_ROUNDS: parseInt(process.env.BCRYPT_ROUNDS || '12', 10),
  RATE_LIMIT_WINDOW: parseInt(process.env.RATE_LIMIT_WINDOW || '15', 10),
  RATE_LIMIT_MAX: parseInt(process.env.RATE_LIMIT_MAX || '100', 10),
  
  // File Upload
  MAX_FILE_SIZE: parseInt(process.env.MAX_FILE_SIZE || '5242880', 10), // 5MB
  UPLOAD_PATH: process.env.UPLOAD_PATH || './uploads',
  
  // Email (Optional)
  SMTP_HOST: process.env.SMTP_HOST,
  SMTP_PORT: process.env.SMTP_PORT ? parseInt(process.env.SMTP_PORT, 10) : undefined,
  SMTP_USER: process.env.SMTP_USER,
  SMTP_PASS: process.env.SMTP_PASS,
};

// Type-safe environment variables
export type Env = typeof env;

// Helper functions
export const isDevelopment = env.NODE_ENV === 'development';
export const isProduction = env.NODE_ENV === 'production';
export const isTest = env.NODE_ENV === 'test';

// Log environment info (without sensitive data)
if (isDevelopment) {
  console.log('🔧 Environment Configuration:');
  console.log(`   NODE_ENV: ${env.NODE_ENV}`);
  console.log(`   PORT: ${env.PORT}`);
  console.log(`   CORS_ORIGIN: ${env.CORS_ORIGIN}`);
  console.log(`   DATABASE_URL: ${env.DATABASE_URL.replace(/\/\/.*@/, '//***:***@')}`);
  console.log(`   REDIS_URL: ${env.REDIS_URL}`);
}
