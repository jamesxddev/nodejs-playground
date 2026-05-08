import 'reflect-metadata';
import { DeactivateAccountUseCase } from '../DeactivateAccountUseCase';
import { NotFoundError } from '../../../../shared/errors/AppError';

function makePrisma(overrides: Partial<{ findUnique: jest.Mock; update: jest.Mock }> = {}) {
  return {
    user: {
      findUnique: overrides.findUnique ?? jest.fn().mockResolvedValue(null),
      update: overrides.update ?? jest.fn().mockResolvedValue(undefined),
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

describe('DeactivateAccountUseCase', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('execute', () => {
    it('should deactivate the account successfully when user exists', async () => {
      const updateMock = jest.fn().mockResolvedValue(undefined);
      const prisma = makePrisma({
        findUnique: jest.fn().mockResolvedValue(userRecord),
        update: updateMock,
      });

      const useCase = new DeactivateAccountUseCase(prisma);
      await expect(useCase.execute('user-1')).resolves.toBeUndefined();

      expect(updateMock).toHaveBeenCalledWith({
        where: { id: 'user-1' },
        data: { isActive: false },
      });
    });

    it('should throw NotFoundError with status 404 when user does not exist', async () => {
      const prisma = makePrisma({
        findUnique: jest.fn().mockResolvedValue(null),
      });

      const useCase = new DeactivateAccountUseCase(prisma);

      await expect(useCase.execute('non-existent')).rejects.toThrow(NotFoundError);
      await expect(useCase.execute('non-existent')).rejects.toMatchObject({
        statusCode: 404,
        message: 'User not found',
      });
    });

    it('should not call update when user does not exist', async () => {
      const updateMock = jest.fn();
      const prisma = makePrisma({
        findUnique: jest.fn().mockResolvedValue(null),
        update: updateMock,
      });

      const useCase = new DeactivateAccountUseCase(prisma);

      await expect(useCase.execute('non-existent')).rejects.toThrow(NotFoundError);
      expect(updateMock).not.toHaveBeenCalled();
    });
  });
});
