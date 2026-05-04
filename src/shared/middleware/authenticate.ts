import { Request, Response, NextFunction } from 'express';
import * as jwt from 'jsonwebtoken';
import { environment } from '../../config/environment';
import { UnauthorizedError } from '../errors/AppError';

export const authenticate = (req: Request, res: Response, next: NextFunction): void => {
  const authHeader = req.headers['authorization'];

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return next(new UnauthorizedError('Missing or invalid Authorization header'));
  }

  const token = authHeader.slice(7);

  try {
    const decoded = jwt.verify(token, environment.jwtSecret);
    (req as any).user = decoded;
    next();
  } catch {
    next(new UnauthorizedError('Invalid or expired token'));
  }
};
