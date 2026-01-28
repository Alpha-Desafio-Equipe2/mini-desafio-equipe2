import { Request, Response, NextFunction } from 'express';
import { AppError } from '../errors/AppError.js';

export function errorHandler(
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (error instanceof AppError) {
    return res.status(error.statusCode).json({
      error: error.message,
      code: error.code
    });
  }

  console.error(error);

  return res.status(500).json({
    error: 'Internal server error'
  });
}