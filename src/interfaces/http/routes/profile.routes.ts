import { Router, Request, Response, NextFunction } from 'express';
import { container } from 'tsyringe';
import { ProfileController } from '../controllers/ProfileController';
import { authenticate } from '../../../shared/middleware/authenticate';

const profileRouter = Router();

profileRouter.put('/:id', authenticate, async (req: Request, res: Response, next: NextFunction) => {
  try {
    await container.resolve(ProfileController).editUser(req, res);
  } catch (error) {
    next(error);
  }
});

export default profileRouter;
