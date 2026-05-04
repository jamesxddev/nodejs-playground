import 'reflect-metadata';
import { AuthController } from '../AuthController';
import { ValidationError } from '../../../../shared/errors/AppError';
import { AppError } from '../../../../shared/errors/AppError';
import { User } from '../../../../domains/auth/entities/User';

function makeUser(): User {
  return new User(
    'user-1',
    'john@example.com',
    'hashed_password',
    'John',
    undefined,
    'Doe',
    true,
    new Date('2026-01-01'),
    new Date('2026-01-01'),
  );
}

function makeRes() {
  const res: any = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
}

function makeReq(body: unknown) {
  return { body } as any;
}

const validBody = {
  email: 'john@example.com',
  password: 'password123',
  firstName: 'John',
  lastName: 'Doe',
};

describe('AuthController - register', () => {
  let loginUseCase: any;
  let createUserUseCase: any;
  let controller: AuthController;

  beforeEach(() => {
    loginUseCase = { execute: jest.fn() };
    createUserUseCase = { execute: jest.fn() };
    controller = new AuthController(loginUseCase, createUserUseCase);
  });

  it('should return 201 with user data on valid input', async () => {
    const user = makeUser();
    createUserUseCase.execute.mockResolvedValue(user);

    const req = makeReq(validBody);
    const res = makeRes();

    await controller.register(req, res);

    expect(createUserUseCase.execute).toHaveBeenCalledWith(validBody);
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({
      message: 'User created successfully',
      user: user.toJSON(),
    });
  });

  it('should throw ValidationError when email is invalid', async () => {
    const req = makeReq({ ...validBody, email: 'not-an-email' });
    const res = makeRes();

    await expect(controller.register(req, res)).rejects.toThrow(ValidationError);
    expect(createUserUseCase.execute).not.toHaveBeenCalled();
  });

  it('should throw ValidationError when password is too short', async () => {
    const req = makeReq({ ...validBody, password: 'short' });
    const res = makeRes();

    await expect(controller.register(req, res)).rejects.toThrow(ValidationError);
    expect(createUserUseCase.execute).not.toHaveBeenCalled();
  });

  it('should throw ValidationError when required fields are missing', async () => {
    const req = makeReq({ email: 'john@example.com', password: 'password123' });
    const res = makeRes();

    await expect(controller.register(req, res)).rejects.toThrow(ValidationError);
    expect(createUserUseCase.execute).not.toHaveBeenCalled();
  });

  it('should re-throw AppError from CreateUserUseCase', async () => {
    createUserUseCase.execute.mockRejectedValue(new AppError('Email already in use', 409));

    const req = makeReq(validBody);
    const res = makeRes();

    await expect(controller.register(req, res)).rejects.toMatchObject({
      statusCode: 409,
      message: 'Email already in use',
    });
  });

  it('should include middleName when provided', async () => {
    const user = makeUser();
    createUserUseCase.execute.mockResolvedValue(user);

    const bodyWithMiddleName = { ...validBody, middleName: 'Michael' };
    const req = makeReq(bodyWithMiddleName);
    const res = makeRes();

    await controller.register(req, res);

    expect(createUserUseCase.execute).toHaveBeenCalledWith(bodyWithMiddleName);
    expect(res.status).toHaveBeenCalledWith(201);
  });
});
