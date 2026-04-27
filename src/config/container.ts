import 'reflect-metadata';
import { container } from 'tsyringe';
import { AuthController } from '../interfaces/http/controllers/AuthController';
import { LoginUseCase } from '../domains/auth/usecases/LoginUseCase';
import { CreateUserUseCase } from '../domains/auth/usecases/CreateUserUseCase';

export function registerDependencies() {
  // Register use cases
  container.registerSingleton(LoginUseCase, LoginUseCase);
  container.registerSingleton(CreateUserUseCase, CreateUserUseCase);

  // Register controllers
  container.registerSingleton(AuthController, AuthController);
}
