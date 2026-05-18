import 'reflect-metadata';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import { LoginUseCase } from '../LoginUseCase';
import { UnauthorizedError } from '../../../../shared/errors/AppError';

jest.mock('bcrypt');
jest.mock('jsonwebtoken');

const mockedBcrypt = bcrypt as jest.Mocked<typeof bcrypt>;
const mockedJwt = jwt as jest.Mocked<typeof jwt>;

function makePrisma(overrides: Partial<{ findUnique: jest.Mock }> = {}) {
  return {
    user: {
      findUnique: overrides.findUnique ?? jest.fn().mockResolvedValue(null),
    },
  } as any;
}

const activeUser = {
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

const inactiveUser = { ...activeUser, isActive: false };

describe('LoginUseCase', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('execute', () => {
    it('should return a token when credentials are valid', async () => {
      const prisma = makePrisma({ findUnique: jest.fn().mockResolvedValue(activeUser) });
      mockedBcrypt.compare.mockResolvedValue(true as never);
      mockedJwt.sign.mockReturnValue('signed_token' as any);

      const useCase = new LoginUseCase(prisma);
      const result = await useCase.execute({ email: 'john@example.com', password: 'Password1!' });

      expect(result).toEqual({ token: 'signed_token' });
    });

    it('should call jwt.sign with correct payload, secret, and expiry', async () => {
      const prisma = makePrisma({ findUnique: jest.fn().mockResolvedValue(activeUser) });
      mockedBcrypt.compare.mockResolvedValue(true as never);
      mockedJwt.sign.mockReturnValue('signed_token' as any);

      const useCase = new LoginUseCase(prisma);
      await useCase.execute({ email: 'john@example.com', password: 'Password1!' });

      expect(mockedJwt.sign).toHaveBeenCalledWith(
        { sub: 'user-1', email: 'john@example.com' },
        expect.any(String),
        { expiresIn: '8h' },
      );
    });

    it('should throw UnauthorizedError with status 401 when user does not exist', async () => {
      const prisma = makePrisma({ findUnique: jest.fn().mockResolvedValue(null) });

      const useCase = new LoginUseCase(prisma);

      await expect(
        useCase.execute({ email: 'nobody@example.com', password: 'Password1!' }),
      ).rejects.toThrow(UnauthorizedError);

      await expect(
        useCase.execute({ email: 'nobody@example.com', password: 'Password1!' }),
      ).rejects.toMatchObject({ statusCode: 401, message: 'Invalid email or password' });
    });

    it('should throw UnauthorizedError with status 401 when account is inactive', async () => {
      const prisma = makePrisma({ findUnique: jest.fn().mockResolvedValue(inactiveUser) });

      const useCase = new LoginUseCase(prisma);

      await expect(
        useCase.execute({ email: 'john@example.com', password: 'Password1!' }),
      ).rejects.toThrow(UnauthorizedError);

      await expect(
        useCase.execute({ email: 'john@example.com', password: 'Password1!' }),
      ).rejects.toMatchObject({ statusCode: 401, message: 'Account is inactive' });
    });

    it('should throw UnauthorizedError with status 401 when password is incorrect', async () => {
      const prisma = makePrisma({ findUnique: jest.fn().mockResolvedValue(activeUser) });
      mockedBcrypt.compare.mockResolvedValue(false as never);

      const useCase = new LoginUseCase(prisma);

      await expect(
        useCase.execute({ email: 'john@example.com', password: 'WrongPass!' }),
      ).rejects.toThrow(UnauthorizedError);

      await expect(
        useCase.execute({ email: 'john@example.com', password: 'WrongPass!' }),
      ).rejects.toMatchObject({ statusCode: 401, message: 'Invalid email or password' });
    });

    it('should not check password when user does not exist', async () => {
      const prisma = makePrisma({ findUnique: jest.fn().mockResolvedValue(null) });

      const useCase = new LoginUseCase(prisma);
      await useCase.execute({ email: 'nobody@example.com', password: 'Password1!' }).catch(() => {});

      expect(mockedBcrypt.compare).not.toHaveBeenCalled();
    });

    it('should not check password when account is inactive', async () => {
      const prisma = makePrisma({ findUnique: jest.fn().mockResolvedValue(inactiveUser) });

      const useCase = new LoginUseCase(prisma);
      await useCase.execute({ email: 'john@example.com', password: 'Password1!' }).catch(() => {});

      expect(mockedBcrypt.compare).not.toHaveBeenCalled();
    });
  });
});
