import { Router, Request, Response, NextFunction } from 'express';
import { container } from 'tsyringe';
import { AuthController } from '../controllers/AuthController';

const authRouter = Router();

authRouter.post('/login', async (req: Request, res: Response, next: NextFunction) => {
  try {
    await container.resolve(AuthController).login(req, res);
  } catch (error) {
    next(error);
  }
});

authRouter.post('/register', async (req: Request, res: Response, next: NextFunction) => {
  try {
    await container.resolve(AuthController).register(req, res);
  } catch (error) {
    next(error);
  }
});

export default authRouter;
