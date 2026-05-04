import 'reflect-metadata';
import * as bcrypt from 'bcrypt';
import { CreateUserUseCase } from '../CreateUserUseCase';
import { AppError } from '../../../../shared/errors/AppError';
import { User } from '../../entities/User';

jest.mock('bcrypt');

const mockedBcrypt = bcrypt as jest.Mocked<typeof bcrypt>;

function makePrisma(overrides: Partial<{ findUnique: jest.Mock; create: jest.Mock }> = {}) {
  return {
    user: {
      findUnique: overrides.findUnique ?? jest.fn().mockResolvedValue(null),
      create: overrides.create ?? jest.fn(),
    },
  } as any;
}

const baseInput = {
  email: 'john@example.com',
  password: 'password123',
  firstName: 'John',
  middleName: undefined,
  lastName: 'Doe',
};

const userRecord = {
  id: 'user-1',
  email: 'john@example.com',
  password: 'hashed_password',
  firstName: 'John',
  middleName: null,
  lastName: 'Doe',
  isActive: true,
  createdAt: new Date('2026-01-01'),
  updatedAt: new Date('2026-01-01'),
};

describe('CreateUserUseCase', () => {
  beforeEach(() => {
    mockedBcrypt.hash.mockResolvedValue('hashed_password' as never);
  });

  describe('execute', () => {
    it('should create and return a User entity when email is not taken', async () => {
      const prisma = makePrisma({
        findUnique: jest.fn().mockResolvedValue(null),
        create: jest.fn().mockResolvedValue(userRecord),
      });

      const useCase = new CreateUserUseCase(prisma);
      const result = await useCase.execute(baseInput);

      expect(result).toBeInstanceOf(User);
      expect(result.email).toBe('john@example.com');
      expect(result.firstName).toBe('John');
      expect(result.lastName).toBe('Doe');
    });

    it('should throw AppError with status 409 when email is already in use', async () => {
      const prisma = makePrisma({
        findUnique: jest.fn().mockResolvedValue(userRecord),
      });

      const useCase = new CreateUserUseCase(prisma);

      await expect(useCase.execute(baseInput)).rejects.toThrow(AppError);
      await expect(useCase.execute(baseInput)).rejects.toMatchObject({
        statusCode: 409,
        message: 'Email already in use',
      });
    });

    it('should hash the password before saving', async () => {
      const prisma = makePrisma({
        findUnique: jest.fn().mockResolvedValue(null),
        create: jest.fn().mockResolvedValue(userRecord),
      });

      const useCase = new CreateUserUseCase(prisma);
      await useCase.execute(baseInput);

      expect(mockedBcrypt.hash).toHaveBeenCalledWith('password123', 10);
      expect(prisma.user.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({ password: 'hashed_password' }),
        }),
      );
    });

    it('should pass all fields to prisma.user.create', async () => {
      const inputWithMiddleName = {
        ...baseInput,
        middleName: 'Michael',
      };

      const recordWithMiddleName = { ...userRecord, middleName: 'Michael' };

      const prisma = makePrisma({
        findUnique: jest.fn().mockResolvedValue(null),
        create: jest.fn().mockResolvedValue(recordWithMiddleName),
      });

      const useCase = new CreateUserUseCase(prisma);
      const result = await useCase.execute(inputWithMiddleName);

      expect(prisma.user.create).toHaveBeenCalledWith({
        data: {
          email: 'john@example.com',
          password: 'hashed_password',
          firstName: 'John',
          middleName: 'Michael',
          lastName: 'Doe',
        },
      });
      expect(result.middleName).toBe('Michael');
    });
  });
});
