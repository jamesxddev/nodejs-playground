import { Router, Request, Response, NextFunction } from 'express';
import { container } from 'tsyringe';
import { AuthController } from '../controllers/AuthController';
import { AppError } from '../../../shared/errors/AppError';

const authRouter = Router();
const authController = container.resolve(AuthController);

authRouter.post('/login', async (req: Request, res: Response, next: NextFunction) => {
  try {
    await authController.login(req, res);
  } catch (error) {
    next(error);
  }
});

authRouter.post('/register', async (req: Request, res: Response, next: NextFunction) => {
  try {
    await authController.register(req, res);
  } catch (error) {
    next(error);
  }
});

export default authRouter;
