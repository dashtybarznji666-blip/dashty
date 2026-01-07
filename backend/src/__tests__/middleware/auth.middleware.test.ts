import { Request, Response, NextFunction } from 'express';
import { authenticate } from '../../middleware/auth.middleware';
import { verifyAccessToken } from '../../lib/jwt';
import { createMockRequest, createMockResponse, createMockNext } from '../helpers/testHelpers';

jest.mock('../../lib/jwt');

describe('authenticate middleware', () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let next: NextFunction;

  beforeEach(() => {
    req = createMockRequest();
    res = createMockResponse();
    next = createMockNext();
    jest.clearAllMocks();
  });

  it('should return 401 if no authorization header', () => {
    authenticate(req as Request, res as Response, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ error: 'No authorization header provided' });
    expect(next).not.toHaveBeenCalled();
  });

  it('should return 401 if authorization header format is invalid', () => {
    req.headers = { authorization: 'InvalidFormat token123' };
    authenticate(req as Request, res as Response, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ error: 'Invalid authorization header format' });
    expect(next).not.toHaveBeenCalled();
  });

  it('should call next if token is valid', () => {
    req.headers = { authorization: 'Bearer valid-token' };
    (verifyAccessToken as jest.Mock).mockReturnValue({
      userId: 'user-id',
      phoneNumber: '07501234567',
      role: 'user',
    });

    authenticate(req as Request, res as Response, next);

    expect(verifyAccessToken).toHaveBeenCalledWith('valid-token');
    expect(req.user).toEqual({
      userId: 'user-id',
      phoneNumber: '07501234567',
      role: 'user',
    });
    expect(next).toHaveBeenCalled();
  });

  it('should return 401 if token is invalid', () => {
    req.headers = { authorization: 'Bearer invalid-token' };
    (verifyAccessToken as jest.Mock).mockImplementation(() => {
      throw new Error('Invalid token');
    });

    authenticate(req as Request, res as Response, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ error: 'Invalid or expired token' });
    expect(next).not.toHaveBeenCalled();
  });
});







