import 'reflect-metadata';
import { container } from 'tsyringe';
import { AuthController } from '../interfaces/http/controllers/AuthController';
import { LoginUseCase } from '../domains/auth/usecases/LoginUseCase';
import { getPrismaClient } from '../shared/database/PrismaClient';

export function registerDependencies() {
  // Register database
  container.registerInstance('PrismaClient', getPrismaClient());

  // Register use cases
  container.registerSingleton(LoginUseCase, LoginUseCase);

  // Register controllers
  container.registerSingleton(AuthController, AuthController);
}
