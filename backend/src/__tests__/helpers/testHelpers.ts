import { generateTokenPair } from '../../lib/jwt';

/**
 * Generate a test JWT token for a user
 */
export function generateTestToken(userId: string = 'test-user-id', role: 'admin' | 'user' = 'user') {
  const tokens = generateTokenPair({
    userId,
    phoneNumber: '07501234567',
    role,
  });
  return tokens.accessToken;
}

/**
 * Create a mock request object
 */
export function createMockRequest(overrides: any = {}) {
  return {
    body: {},
    params: {},
    query: {},
    headers: {},
    user: undefined,
    ...overrides,
  };
}

/**
 * Create a mock response object
 */
export function createMockResponse() {
  const res: any = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn().mockReturnThis(),
    send: jest.fn().mockReturnThis(),
  };
  return res;
}

/**
 * Create a mock next function
 */
export function createMockNext() {
  return jest.fn();
}
