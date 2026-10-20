import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import { logger } from '../config/logger.js';

export class AppError extends Error {
  statusCode: number;
  isOperational: boolean;

  constructor(message: string, statusCode = 500, isOperational = true) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    Error.captureStackTrace(this, this.constructor);
  }
}

export function errorHandler(
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
): void {
  // 1. Zod Validation Errors
  if (err instanceof ZodError) {
    const formattedErrors = err.errors.map((e) => ({
      path: e.path.join('.'),
      message: e.message,
    }));
    res.status(400).json({
      success: false,
      error: 'Validation failed',
      details: formattedErrors,
    });
    return;
  }

  // 2. Custom AppError
  if (err instanceof AppError) {
    res.status(err.statusCode).json({
      success: false,
      error: err.message,
    });
    return;
  }

  // 3. Prisma Record Not Found (P2025)
  if (err?.code === 'P2025') {
    res.status(404).json({
      success: false,
      error: 'Requested resource not found',
    });
    return;
  }

  // 4. Prisma Unique Constraint Violation (P2002)
  if (err?.code === 'P2002') {
    const target = Array.isArray(err.meta?.target) ? err.meta.target.join(', ') : err.meta?.target;
    res.status(409).json({
      success: false,
      error: `A record with this ${target || 'unique field'} already exists`,
    });
    return;
  }

  // 5. Unhandled Internal Server Errors
  logger.error({ err, path: req.path, method: req.method }, 'Unhandled Exception');
  res.status(500).json({
    success: false,
    error: process.env.NODE_ENV === 'production' ? 'An unexpected error occurred' : err.message,
  });
}
