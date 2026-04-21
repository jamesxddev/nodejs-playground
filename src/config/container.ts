import 'reflect-metadata';
import { container } from 'tsyringe';
import { AuthController } from '../interfaces/http/controllers/AuthController';
import { LoginUseCase } from '../domains/auth/usecases/LoginUseCase';

export function registerDependencies() {
  // Register use cases
  container.registerSingleton(LoginUseCase, LoginUseCase);

  // Register controllers
  container.registerSingleton(AuthController, AuthController);
}
