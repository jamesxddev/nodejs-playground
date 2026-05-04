import 'reflect-metadata';
import { container } from 'tsyringe';
import { PrismaClient } from '@prisma/client';
import { AuthController } from '../interfaces/http/controllers/AuthController';
import { ProfileController } from '../interfaces/http/controllers/ProfileController';
import { LoginUseCase } from '../domains/auth/usecases/LoginUseCase';
import { CreateUserUseCase } from '../domains/auth/usecases/CreateUserUseCase';
import { EditUserUseCase } from '../domains/auth/usecases/EditUserUseCase';

export function registerDependencies(prismaClient: PrismaClient) {
  // Register database
  container.registerInstance('PrismaClient', prismaClient);

  // Register use cases
  container.registerSingleton(LoginUseCase, LoginUseCase);
  container.registerSingleton(CreateUserUseCase, CreateUserUseCase);
  container.registerSingleton(EditUserUseCase, EditUserUseCase);

  // Register controllers
  container.registerSingleton(AuthController, AuthController);
  container.registerSingleton(ProfileController, ProfileController);
}
