import 'reflect-metadata';
import { EditUserUseCase } from '../EditUserUseCase';
import { NotFoundError } from '../../../../shared/errors/AppError';
import { User } from '../../entities/User';

function makePrisma(overrides: Partial<{ findUnique: jest.Mock; update: jest.Mock }> = {}) {
  return {
    user: {
      findUnique: overrides.findUnique ?? jest.fn().mockResolvedValue(null),
      update: overrides.update ?? jest.fn(),
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

describe('EditUserUseCase', () => {
  describe('execute', () => {
    it('should return an updated User entity when user exists', async () => {
      const updatedRecord = { ...userRecord, firstName: 'Jane' };
      const prisma = makePrisma({
        findUnique: jest.fn().mockResolvedValue(userRecord),
        update: jest.fn().mockResolvedValue(updatedRecord),
      });

      const useCase = new EditUserUseCase(prisma);
      const result = await useCase.execute('user-1', { firstName: 'Jane' });

      expect(result).toBeInstanceOf(User);
      expect(result.firstName).toBe('Jane');
    });

    it('should throw NotFoundError with status 404 when user does not exist', async () => {
      const prisma = makePrisma({
        findUnique: jest.fn().mockResolvedValue(null),
      });

      const useCase = new EditUserUseCase(prisma);

      await expect(useCase.execute('non-existent', { firstName: 'Jane' })).rejects.toThrow(NotFoundError);
      await expect(useCase.execute('non-existent', { firstName: 'Jane' })).rejects.toMatchObject({
        statusCode: 404,
        message: 'User not found',
      });
    });

    it('should only pass firstName to prisma.user.update when only firstName is provided', async () => {
      const prisma = makePrisma({
        findUnique: jest.fn().mockResolvedValue(userRecord),
        update: jest.fn().mockResolvedValue(userRecord),
      });

      const useCase = new EditUserUseCase(prisma);
      await useCase.execute('user-1', { firstName: 'Jane' });

      expect(prisma.user.update).toHaveBeenCalledWith({
        where: { id: 'user-1' },
        data: { firstName: 'Jane' },
      });
    });

    it('should only pass lastName to prisma.user.update when only lastName is provided', async () => {
      const prisma = makePrisma({
        findUnique: jest.fn().mockResolvedValue(userRecord),
        update: jest.fn().mockResolvedValue(userRecord),
      });

      const useCase = new EditUserUseCase(prisma);
      await useCase.execute('user-1', { lastName: 'Smith' });

      expect(prisma.user.update).toHaveBeenCalledWith({
        where: { id: 'user-1' },
        data: { lastName: 'Smith' },
      });
    });

    it('should only pass middleName to prisma.user.update when only middleName is provided', async () => {
      const prisma = makePrisma({
        findUnique: jest.fn().mockResolvedValue(userRecord),
        update: jest.fn().mockResolvedValue(userRecord),
      });

      const useCase = new EditUserUseCase(prisma);
      await useCase.execute('user-1', { middleName: 'Paul' });

      expect(prisma.user.update).toHaveBeenCalledWith({
        where: { id: 'user-1' },
        data: { middleName: 'Paul' },
      });
    });

    it('should pass all three fields to prisma.user.update when all are provided', async () => {
      const updatedRecord = { ...userRecord, firstName: 'Jane', middleName: 'Paul', lastName: 'Smith' };
      const prisma = makePrisma({
        findUnique: jest.fn().mockResolvedValue(userRecord),
        update: jest.fn().mockResolvedValue(updatedRecord),
      });

      const useCase = new EditUserUseCase(prisma);
      const result = await useCase.execute('user-1', {
        firstName: 'Jane',
        middleName: 'Paul',
        lastName: 'Smith',
      });

      expect(prisma.user.update).toHaveBeenCalledWith({
        where: { id: 'user-1' },
        data: { firstName: 'Jane', middleName: 'Paul', lastName: 'Smith' },
      });
      expect(result.firstName).toBe('Jane');
      expect(result.middleName).toBe('Paul');
      expect(result.lastName).toBe('Smith');
    });

    it('should map null middleName from DB to undefined on the User entity', async () => {
      const prisma = makePrisma({
        findUnique: jest.fn().mockResolvedValue(userRecord),
        update: jest.fn().mockResolvedValue({ ...userRecord, middleName: null }),
      });

      const useCase = new EditUserUseCase(prisma);
      const result = await useCase.execute('user-1', { firstName: 'Jane' });

      expect(result.middleName).toBeUndefined();
    });
  });
});
