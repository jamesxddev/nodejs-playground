import 'reflect-metadata';
import { GetUserUseCase } from '../GetUserUseCase';
import { NotFoundError } from '../../../../shared/errors/AppError';
import { User } from '../../entities/User';

function makePrisma(overrides: Partial<{ findUnique: jest.Mock }> = {}) {
  return {
    user: {
      findUnique: overrides.findUnique ?? jest.fn().mockResolvedValue(null),
    },
  } as any;
}

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

describe('GetUserUseCase', () => {
  describe('execute', () => {
    it('should return a User entity when user exists', async () => {
      const prisma = makePrisma({
        findUnique: jest.fn().mockResolvedValue(userRecord),
      });

      const useCase = new GetUserUseCase(prisma);
      const result = await useCase.execute('user-1');

      expect(result).toBeInstanceOf(User);
      expect(result.id).toBe('user-1');
      expect(result.email).toBe('john@example.com');
      expect(result.firstName).toBe('John');
      expect(result.lastName).toBe('Doe');
    });

    it('should map null middleName to undefined', async () => {
      const prisma = makePrisma({
        findUnique: jest.fn().mockResolvedValue({ ...userRecord, middleName: null }),
      });

      const useCase = new GetUserUseCase(prisma);
      const result = await useCase.execute('user-1');

      expect(result.middleName).toBeUndefined();
    });

    it('should return middleName when it is set', async () => {
      const prisma = makePrisma({
        findUnique: jest.fn().mockResolvedValue({ ...userRecord, middleName: 'Paul' }),
      });

      const useCase = new GetUserUseCase(prisma);
      const result = await useCase.execute('user-1');

      expect(result.middleName).toBe('Paul');
    });

    it('should throw NotFoundError with status 404 when user does not exist', async () => {
      const prisma = makePrisma({
        findUnique: jest.fn().mockResolvedValue(null),
      });

      const useCase = new GetUserUseCase(prisma);

      await expect(useCase.execute('non-existent')).rejects.toThrow(NotFoundError);
      await expect(useCase.execute('non-existent')).rejects.toMatchObject({
        statusCode: 404,
        message: 'User not found',
      });
    });

    it('should call prisma.user.findUnique with the correct id', async () => {
      const prisma = makePrisma({
        findUnique: jest.fn().mockResolvedValue(userRecord),
      });

      const useCase = new GetUserUseCase(prisma);
      await useCase.execute('user-1');

      expect(prisma.user.findUnique).toHaveBeenCalledWith({ where: { id: 'user-1' } });
    });
  });
});
