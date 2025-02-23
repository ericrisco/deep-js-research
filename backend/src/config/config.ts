import dotenv from 'dotenv';

dotenv.config();

export const config = {
  env: process.env.NODE_ENV || 'development',
  port: parseInt(process.env.PORT || '3000', 10),
  cors: {
    origins: process.env.CORS_ORIGINS?.split(',') || ['http://localhost:3000'],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  },
  logs: {
    level: process.env.LOG_LEVEL || 'info',
  },
  api: {
    prefix: '/api/v1',
  },
  swagger: {
    path: '/docs',
  },
  rateLimiter: {
    windowMs: 15 * 60 * 1000,
    max: 100,
  }
}; 