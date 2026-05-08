import 'reflect-metadata';
import { ProfileController } from '../ProfileController';
import { ValidationError, UnauthorizedError, NotFoundError } from '../../../../shared/errors/AppError';

function makeRes() {
  const res: any = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
}

function makeReq(params: { id: string }, body: unknown) {
  return { params, body } as any;
}

describe('ProfileController - changePassword', () => {
  let changePasswordUseCase: any;
  let controller: ProfileController;

  beforeEach(() => {
    changePasswordUseCase = { execute: jest.fn() };
    controller = new ProfileController(
      { execute: jest.fn() } as any,
      { execute: jest.fn() } as any,
      changePasswordUseCase,
    );
  });

  it('should return 200 with success message on valid input', async () => {
    changePasswordUseCase.execute.mockResolvedValue(undefined);

    const req = makeReq({ id: 'user-1' }, { currentPassword: 'OldPass1!', newPassword: 'NewPass1!' });
    const res = makeRes();

    await controller.changePassword(req, res);

    expect(changePasswordUseCase.execute).toHaveBeenCalledWith('user-1', {
      currentPassword: 'OldPass1!',
      newPassword: 'NewPass1!',
    });
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ message: 'Password changed successfully' });
  });

  it('should throw ValidationError when body is empty', async () => {
    const req = makeReq({ id: 'user-1' }, {});
    const res = makeRes();

    await expect(controller.changePassword(req, res)).rejects.toThrow(ValidationError);
  });

  it('should throw ValidationError when newPassword is shorter than 8 characters', async () => {
    const req = makeReq({ id: 'user-1' }, { currentPassword: 'OldPass1!', newPassword: 'short' });
    const res = makeRes();

    await expect(controller.changePassword(req, res)).rejects.toThrow(ValidationError);
    await expect(controller.changePassword(req, res)).rejects.toMatchObject({
      statusCode: 400,
      message: expect.stringContaining('newPassword'),
    });
  });

  it('should propagate UnauthorizedError from use case', async () => {
    changePasswordUseCase.execute.mockRejectedValue(
      new UnauthorizedError('Current password is incorrect'),
    );

    const req = makeReq({ id: 'user-1' }, { currentPassword: 'WrongPass!', newPassword: 'NewPass1!' });
    const res = makeRes();

    await expect(controller.changePassword(req, res)).rejects.toThrow(UnauthorizedError);
    await expect(controller.changePassword(req, res)).rejects.toMatchObject({
      statusCode: 401,
      message: 'Current password is incorrect',
    });
  });

  it('should propagate NotFoundError from use case', async () => {
    changePasswordUseCase.execute.mockRejectedValue(new NotFoundError('User not found'));

    const req = makeReq({ id: 'non-existent' }, { currentPassword: 'OldPass1!', newPassword: 'NewPass1!' });
    const res = makeRes();

    await expect(controller.changePassword(req, res)).rejects.toThrow(NotFoundError);
    await expect(controller.changePassword(req, res)).rejects.toMatchObject({
      statusCode: 404,
      message: 'User not found',
    });
  });
});
