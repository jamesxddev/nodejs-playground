import 'reflect-metadata';
import { ProfileController } from '../ProfileController';
import { ValidationError, NotFoundError } from '../../../../shared/errors/AppError';
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

function makeReq(params: { id: string }, body: unknown) {
  return { params, body } as any;
}

describe('ProfileController - editUser', () => {
  let editUserUseCase: any;
  let controller: ProfileController;

  beforeEach(() => {
    editUserUseCase = { execute: jest.fn() };
    controller = new ProfileController(editUserUseCase);
  });

  it('should return 200 with updated user on valid input', async () => {
    const user = makeUser();
    editUserUseCase.execute.mockResolvedValue(user);

    const req = makeReq({ id: 'user-1' }, { firstName: 'Jane' });
    const res = makeRes();

    await controller.editUser(req, res);

    expect(editUserUseCase.execute).toHaveBeenCalledWith('user-1', { firstName: 'Jane' });
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      message: 'User updated successfully',
      user: user.toJSON(),
    });
  });

  it('should return 200 when all three fields are provided', async () => {
    const user = makeUser();
    editUserUseCase.execute.mockResolvedValue(user);

    const body = { firstName: 'Jane', middleName: 'Paul', lastName: 'Smith' };
    const req = makeReq({ id: 'user-1' }, body);
    const res = makeRes();

    await controller.editUser(req, res);

    expect(editUserUseCase.execute).toHaveBeenCalledWith('user-1', body);
    expect(res.status).toHaveBeenCalledWith(200);
  });

  it('should return 200 when only middleName is provided', async () => {
    const user = makeUser();
    editUserUseCase.execute.mockResolvedValue(user);

    const req = makeReq({ id: 'user-1' }, { middleName: 'Paul' });
    const res = makeRes();

    await controller.editUser(req, res);

    expect(editUserUseCase.execute).toHaveBeenCalledWith('user-1', { middleName: 'Paul' });
    expect(res.status).toHaveBeenCalledWith(200);
  });

  it('should throw ValidationError when body is empty', async () => {
    const req = makeReq({ id: 'user-1' }, {});
    const res = makeRes();

    await expect(controller.editUser(req, res)).rejects.toThrow(ValidationError);
    expect(editUserUseCase.execute).not.toHaveBeenCalled();
  });

  it('should throw ValidationError when firstName is an empty string', async () => {
    const req = makeReq({ id: 'user-1' }, { firstName: '' });
    const res = makeRes();

    await expect(controller.editUser(req, res)).rejects.toThrow(ValidationError);
    expect(editUserUseCase.execute).not.toHaveBeenCalled();
  });

  it('should throw ValidationError when lastName is an empty string', async () => {
    const req = makeReq({ id: 'user-1' }, { lastName: '' });
    const res = makeRes();

    await expect(controller.editUser(req, res)).rejects.toThrow(ValidationError);
    expect(editUserUseCase.execute).not.toHaveBeenCalled();
  });

  it('should re-throw NotFoundError from EditUserUseCase', async () => {
    editUserUseCase.execute.mockRejectedValue(new NotFoundError('User not found'));

    const req = makeReq({ id: 'non-existent' }, { firstName: 'Jane' });
    const res = makeRes();

    await expect(controller.editUser(req, res)).rejects.toMatchObject({
      statusCode: 404,
      message: 'User not found',
    });
  });
});
