import 'reflect-metadata';
import { ProfileController } from '../ProfileController';
import { NotFoundError } from '../../../../shared/errors/AppError';
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

function makeReq(params: { id: string }) {
  return { params } as any;
}

describe('ProfileController - getUser', () => {
  let editUserUseCase: any;
  let getUserUseCase: any;
  let controller: ProfileController;

  beforeEach(() => {
    editUserUseCase = { execute: jest.fn() };
    getUserUseCase = { execute: jest.fn() };
    controller = new ProfileController(editUserUseCase, getUserUseCase, { execute: jest.fn() } as any, { execute: jest.fn() } as any);
  });

  it('should return 200 with user data when user exists', async () => {
    const user = makeUser();
    getUserUseCase.execute.mockResolvedValue(user);

    const req = makeReq({ id: 'user-1' });
    const res = makeRes();

    await controller.getUser(req, res);

    expect(getUserUseCase.execute).toHaveBeenCalledWith('user-1');
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      message: 'User retrieved successfully',
      user: user.toJSON(),
    });
  });

  it('should return user with middleName when it is set', async () => {
    const user = new User(
      'user-1',
      'john@example.com',
      'hashed_password',
      'John',
      'Paul',
      'Doe',
      true,
      new Date('2026-01-01'),
      new Date('2026-01-01'),
    );
    getUserUseCase.execute.mockResolvedValue(user);

    const req = makeReq({ id: 'user-1' });
    const res = makeRes();

    await controller.getUser(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      message: 'User retrieved successfully',
      user: user.toJSON(),
    });
  });

  it('should throw NotFoundError when user does not exist', async () => {
    getUserUseCase.execute.mockRejectedValue(new NotFoundError('User not found'));

    const req = makeReq({ id: 'non-existent' });
    const res = makeRes();

    await expect(controller.getUser(req, res)).rejects.toThrow(NotFoundError);
    await expect(controller.getUser(req, res)).rejects.toMatchObject({
      statusCode: 404,
      message: 'User not found',
    });
  });
});
