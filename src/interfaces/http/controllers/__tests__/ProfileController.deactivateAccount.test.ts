import 'reflect-metadata';
import { ProfileController } from '../ProfileController';
import { NotFoundError } from '../../../../shared/errors/AppError';

function makeRes() {
  const res: any = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
}

function makeReq(params: { id: string }) {
  return { params } as any;
}

describe('ProfileController - deactivateAccount', () => {
  let deactivateAccountUseCase: any;
  let controller: ProfileController;

  beforeEach(() => {
    deactivateAccountUseCase = { execute: jest.fn() };
    controller = new ProfileController(
      { execute: jest.fn() } as any,
      { execute: jest.fn() } as any,
      { execute: jest.fn() } as any,
      deactivateAccountUseCase,
    );
  });

  it('should return 200 with success message when account is deactivated', async () => {
    deactivateAccountUseCase.execute.mockResolvedValue(undefined);

    const req = makeReq({ id: 'user-1' });
    const res = makeRes();

    await controller.deactivateAccount(req, res);

    expect(deactivateAccountUseCase.execute).toHaveBeenCalledWith('user-1');
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ message: 'Account deactivated successfully' });
  });

  it('should propagate NotFoundError from use case', async () => {
    deactivateAccountUseCase.execute.mockRejectedValue(new NotFoundError('User not found'));

    const req = makeReq({ id: 'non-existent' });
    const res = makeRes();

    await expect(controller.deactivateAccount(req, res)).rejects.toThrow(NotFoundError);
    await expect(controller.deactivateAccount(req, res)).rejects.toMatchObject({
      statusCode: 404,
      message: 'User not found',
    });
  });
});
