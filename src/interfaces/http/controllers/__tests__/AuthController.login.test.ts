import 'reflect-metadata';
import { AuthController } from '../AuthController';
import { ValidationError, UnauthorizedError } from '../../../../shared/errors/AppError';

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
  password: 'Password1!',
};

describe('AuthController - login', () => {
  let loginUseCase: any;
  let createUserUseCase: any;
  let logoutUseCase: any;
  let controller: AuthController;

  beforeEach(() => {
    loginUseCase = { execute: jest.fn() };
    createUserUseCase = { execute: jest.fn() };
    logoutUseCase = { execute: jest.fn() };
    controller = new AuthController(loginUseCase, createUserUseCase, logoutUseCase);
  });

  it('should return 200 with token on valid credentials', async () => {
    loginUseCase.execute.mockResolvedValue({ token: 'signed_token' });

    const req = makeReq(validBody);
    const res = makeRes();

    await controller.login(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      message: 'Login successful',
      token: 'signed_token',
    });
  });

  it('should call loginUseCase.execute with validated DTO', async () => {
    loginUseCase.execute.mockResolvedValue({ token: 'signed_token' });

    const req = makeReq(validBody);
    const res = makeRes();

    await controller.login(req, res);

    expect(loginUseCase.execute).toHaveBeenCalledWith(validBody);
  });

  it('should throw ValidationError when email is missing', async () => {
    const req = makeReq({ password: 'Password1!' });
    const res = makeRes();

    await expect(controller.login(req, res)).rejects.toThrow(ValidationError);
    expect(loginUseCase.execute).not.toHaveBeenCalled();
  });

  it('should throw ValidationError when email is invalid', async () => {
    const req = makeReq({ email: 'not-an-email', password: 'Password1!' });
    const res = makeRes();

    await expect(controller.login(req, res)).rejects.toThrow(ValidationError);
    expect(loginUseCase.execute).not.toHaveBeenCalled();
  });

  it('should throw ValidationError when password is missing', async () => {
    const req = makeReq({ email: 'john@example.com' });
    const res = makeRes();

    await expect(controller.login(req, res)).rejects.toThrow(ValidationError);
    expect(loginUseCase.execute).not.toHaveBeenCalled();
  });

  it('should throw ValidationError when body is empty', async () => {
    const req = makeReq({});
    const res = makeRes();

    await expect(controller.login(req, res)).rejects.toThrow(ValidationError);
    expect(loginUseCase.execute).not.toHaveBeenCalled();
  });

  it('should re-throw UnauthorizedError from loginUseCase when credentials are invalid', async () => {
    loginUseCase.execute.mockRejectedValue(new UnauthorizedError('Invalid email or password'));

    const req = makeReq(validBody);
    const res = makeRes();

    await expect(controller.login(req, res)).rejects.toMatchObject({
      statusCode: 401,
      message: 'Invalid email or password',
    });
  });

  it('should re-throw UnauthorizedError from loginUseCase when account is inactive', async () => {
    loginUseCase.execute.mockRejectedValue(new UnauthorizedError('Account is inactive'));

    const req = makeReq(validBody);
    const res = makeRes();

    await expect(controller.login(req, res)).rejects.toMatchObject({
      statusCode: 401,
      message: 'Account is inactive',
    });
  });
});
