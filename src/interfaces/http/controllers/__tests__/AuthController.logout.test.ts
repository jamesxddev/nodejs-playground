import 'reflect-metadata';
import { AuthController } from '../AuthController';
import { AppError } from '../../../../shared/errors/AppError';

function makeRes() {
  const res: any = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
}

function makeReq() {
  return {
    body: {},
    user: { sub: 'user-1', email: 'john@example.com' },
  } as any;
}

describe('AuthController - logout', () => {
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

  it('should return 200 with logout message on success', async () => {
    logoutUseCase.execute.mockResolvedValue(undefined);

    const req = makeReq();
    const res = makeRes();

    await controller.logout(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ message: 'Logout successful' });
  });

  it('should call logoutUseCase.execute with the user id from the token', async () => {
    logoutUseCase.execute.mockResolvedValue(undefined);

    const req = makeReq();
    const res = makeRes();

    await controller.logout(req, res);

    expect(logoutUseCase.execute).toHaveBeenCalledWith('user-1');
  });

  it('should propagate errors thrown by the use case', async () => {
    const error = new AppError('Unexpected error', 500);
    logoutUseCase.execute.mockRejectedValue(error);

    const req = makeReq();
    const res = makeRes();

    await expect(controller.logout(req, res)).rejects.toMatchObject({
      statusCode: 500,
      message: 'Unexpected error',
    });
  });
});
