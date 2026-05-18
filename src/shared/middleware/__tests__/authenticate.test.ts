import 'reflect-metadata';
import * as jwt from 'jsonwebtoken';
import { authenticate } from '../authenticate';
import { UnauthorizedError } from '../../errors/AppError';

jest.mock('jsonwebtoken');

const mockedJwt = jwt as jest.Mocked<typeof jwt>;

const decodedPayload = { sub: 'user-1', email: 'john@example.com' };

function makeReq(authHeader?: string) {
  return {
    headers: authHeader !== undefined ? { authorization: authHeader } : {},
  } as any;
}

function makeRes() {
  return {} as any;
}

function makeNext() {
  return jest.fn();
}

describe('authenticate middleware', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should call next() and attach decoded payload to req.user on a valid token', () => {
    mockedJwt.verify.mockReturnValue(decodedPayload as any);

    const req = makeReq('Bearer valid_token');
    const res = makeRes();
    const next = makeNext();

    authenticate(req, res, next);

    expect(mockedJwt.verify).toHaveBeenCalledWith('valid_token', expect.any(String));
    expect(req.user).toEqual(decodedPayload);
    expect(next).toHaveBeenCalledWith();
  });

  it('should call next() with UnauthorizedError when Authorization header is missing', () => {
    const req = makeReq();
    const res = makeRes();
    const next = makeNext();

    authenticate(req, res, next);

    expect(next).toHaveBeenCalledWith(expect.any(UnauthorizedError));
    expect(next.mock.calls[0][0]).toMatchObject({
      statusCode: 401,
      message: 'Missing or invalid Authorization header',
    });
    expect(mockedJwt.verify).not.toHaveBeenCalled();
  });

  it('should call next() with UnauthorizedError when Authorization header does not start with Bearer', () => {
    const req = makeReq('Basic sometoken');
    const res = makeRes();
    const next = makeNext();

    authenticate(req, res, next);

    expect(next).toHaveBeenCalledWith(expect.any(UnauthorizedError));
    expect(next.mock.calls[0][0]).toMatchObject({
      statusCode: 401,
      message: 'Missing or invalid Authorization header',
    });
    expect(mockedJwt.verify).not.toHaveBeenCalled();
  });

  it('should call next() with UnauthorizedError when token is invalid or expired', () => {
    mockedJwt.verify.mockImplementation(() => {
      throw new jwt.JsonWebTokenError('invalid token');
    });

    const req = makeReq('Bearer bad_token');
    const res = makeRes();
    const next = makeNext();

    authenticate(req, res, next);

    expect(next).toHaveBeenCalledWith(expect.any(UnauthorizedError));
    expect(next.mock.calls[0][0]).toMatchObject({
      statusCode: 401,
      message: 'Invalid or expired token',
    });
  });

  it('should call next() with UnauthorizedError when token is expired', () => {
    mockedJwt.verify.mockImplementation(() => {
      throw new jwt.TokenExpiredError('jwt expired', new Date());
    });

    const req = makeReq('Bearer expired_token');
    const res = makeRes();
    const next = makeNext();

    authenticate(req, res, next);

    expect(next).toHaveBeenCalledWith(expect.any(UnauthorizedError));
    expect(next.mock.calls[0][0]).toMatchObject({
      statusCode: 401,
      message: 'Invalid or expired token',
    });
  });

  it('should strip the "Bearer " prefix before verifying the token', () => {
    mockedJwt.verify.mockReturnValue(decodedPayload as any);

    const req = makeReq('Bearer my_jwt_token');
    const res = makeRes();
    const next = makeNext();

    authenticate(req, res, next);

    expect(mockedJwt.verify).toHaveBeenCalledWith('my_jwt_token', expect.any(String));
  });

  it('should not attach req.user when token verification fails', () => {
    mockedJwt.verify.mockImplementation(() => {
      throw new jwt.JsonWebTokenError('invalid');
    });

    const req = makeReq('Bearer bad_token');
    const res = makeRes();
    const next = makeNext();

    authenticate(req, res, next);

    expect(req.user).toBeUndefined();
  });
});
