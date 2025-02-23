import { Request, Response, NextFunction } from 'express';
import { ErrorResponse } from '../interfaces/http.interface';

export class ApiError extends Error {
  constructor(
    public statusCode: number,
    message: string,
    public code?: string
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

export const errorHandler = (
  err: Error | ApiError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const statusCode = err instanceof ApiError ? err.statusCode : 500;
  const errorResponse: ErrorResponse = {
    success: false,
    error: err.message || 'Internal Server Error',
    timestamp: new Date().toISOString(),
    code: err instanceof ApiError ? err.code : 'INTERNAL_ERROR'
  };

  if (process.env.NODE_ENV !== 'production') {
    errorResponse.stack = err.stack;
  }

  res.status(statusCode).json(errorResponse);
}; 