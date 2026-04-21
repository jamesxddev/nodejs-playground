import { Request, Response, NextFunction } from 'express';
import { AppError } from '../../../shared/errors/AppError';

export const errorHandler = (err: unknown, req: Request, res: Response, next: NextFunction) => {
  console.error('Error:', err);

  if (err instanceof AppError) {
    res.status(err.statusCode).json({
      error: err.message,
      statusCode: err.statusCode,
    });
    return;
  }

  res.status(500).json({
    error: 'Internal Server Error',
    statusCode: 500,
  });
};
