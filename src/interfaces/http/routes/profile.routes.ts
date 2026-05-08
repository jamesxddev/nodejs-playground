import { Router, Request, Response, NextFunction } from 'express';
import { container } from 'tsyringe';
import { ProfileController } from '../controllers/ProfileController';
import { authenticate } from '../../../shared/middleware/authenticate';

const profileRouter = Router();

profileRouter.get('/:id', authenticate, async (req: Request, res: Response, next: NextFunction) => {
  try {
    await container.resolve(ProfileController).getUser(req, res);
  } catch (error) {
    next(error);
  }
});

profileRouter.put('/:id', authenticate, async (req: Request, res: Response, next: NextFunction) => {
  try {
    await container.resolve(ProfileController).editUser(req, res);
  } catch (error) {
    next(error);
  }
});

profileRouter.patch('/:id/password', authenticate, async (req: Request, res: Response, next: NextFunction) => {
  try {
    await container.resolve(ProfileController).changePassword(req, res);
  } catch (error) {
    next(error);
  }
});

export default profileRouter;
