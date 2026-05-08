import 'reflect-metadata';
import * as bcrypt from 'bcrypt';
import { ChangePasswordUseCase } from '../ChangePasswordUseCase';
import { NotFoundError, UnauthorizedError } from '../../../../shared/errors/AppError';

jest.mock('bcrypt');

const mockedBcrypt = bcrypt as jest.Mocked<typeof bcrypt>;

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

describe('ChangePasswordUseCase', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('execute', () => {
    it('should change the password successfully when current password is correct', async () => {
      const prisma = makePrisma({
        findUnique: jest.fn().mockResolvedValue(userRecord),
        update: jest.fn().mockResolvedValue(undefined),
      });

      mockedBcrypt.compare.mockResolvedValue(true as never);
      mockedBcrypt.hash.mockResolvedValue('new_hashed_password' as never);

      const useCase = new ChangePasswordUseCase(prisma);
      await expect(
        useCase.execute('user-1', { currentPassword: 'OldPass1!', newPassword: 'NewPass1!' }),
      ).resolves.toBeUndefined();

      expect(prisma.user.update).toHaveBeenCalledWith({
        where: { id: 'user-1' },
        data: { password: 'new_hashed_password' },
      });
    });

    it('should throw NotFoundError with status 404 when user does not exist', async () => {
      const prisma = makePrisma({
        findUnique: jest.fn().mockResolvedValue(null),
      });

      const useCase = new ChangePasswordUseCase(prisma);

      await expect(
        useCase.execute('non-existent', { currentPassword: 'OldPass1!', newPassword: 'NewPass1!' }),
      ).rejects.toThrow(NotFoundError);

      await expect(
        useCase.execute('non-existent', { currentPassword: 'OldPass1!', newPassword: 'NewPass1!' }),
      ).rejects.toMatchObject({ statusCode: 404, message: 'User not found' });
    });

    it('should throw UnauthorizedError with status 401 when current password is incorrect', async () => {
      const prisma = makePrisma({
        findUnique: jest.fn().mockResolvedValue(userRecord),
      });

      mockedBcrypt.compare.mockResolvedValue(false as never);

      const useCase = new ChangePasswordUseCase(prisma);

      await expect(
        useCase.execute('user-1', { currentPassword: 'WrongPass!', newPassword: 'NewPass1!' }),
      ).rejects.toThrow(UnauthorizedError);

      await expect(
        useCase.execute('user-1', { currentPassword: 'WrongPass!', newPassword: 'NewPass1!' }),
      ).rejects.toMatchObject({ statusCode: 401, message: 'Current password is incorrect' });
    });

    it('should call bcrypt.hash with the new password and salt rounds 10', async () => {
      const prisma = makePrisma({
        findUnique: jest.fn().mockResolvedValue(userRecord),
        update: jest.fn().mockResolvedValue(undefined),
      });

      mockedBcrypt.compare.mockResolvedValue(true as never);
      mockedBcrypt.hash.mockResolvedValue('new_hashed_password' as never);

      const useCase = new ChangePasswordUseCase(prisma);
      await useCase.execute('user-1', { currentPassword: 'OldPass1!', newPassword: 'NewPass1!' });

      expect(mockedBcrypt.hash).toHaveBeenCalledWith('NewPass1!', 10);
    });
  });
});
