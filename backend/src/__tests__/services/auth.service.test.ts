import { AuthService } from '../../services/auth.service';
import { UserService } from '../../services/user.service';

// Mock dependencies
jest.mock('../../services/user.service');
jest.mock('../../lib/prisma', () => ({
  __esModule: true,
  default: {
    user: {
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
    },
  },
}));

describe('AuthService', () => {
  let authService: AuthService;
  let mockUserService: jest.Mocked<UserService>;

  beforeEach(() => {
    jest.clearAllMocks();
    authService = new AuthService();
    // Mock the UserService instance methods
    const userServiceInstance = (authService as any).userService;
    mockUserService = userServiceInstance as jest.Mocked<UserService>;
  });

  describe('register', () => {
    it('should throw error if registration password is invalid', async () => {
      const data = {
        name: 'Test User',
        phoneNumber: '07501234567',
        password: 'password123',
        registrationPassword: 'wrong-password',
      };

      await expect(authService.register(data)).rejects.toThrow('Invalid registration password');
    });

    it('should throw error if phone number already exists', async () => {
      const data = {
        name: 'Test User',
        phoneNumber: '07501234567',
        password: 'password123',
        registrationPassword: 'DASHTYfalak2025@',
      };

      (mockUserService.findByPhoneNumber as jest.Mock) = jest.fn().mockResolvedValue({
        id: 'existing-id',
        phoneNumber: '07501234567',
        name: 'Existing User',
        role: 'user',
        isActive: true,
        password: 'hashed',
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      await expect(authService.register(data)).rejects.toThrow('Phone number already exists');
    });
  });

  describe('login', () => {
    it('should throw error if user does not exist', async () => {
      const data = {
        phoneNumber: '07501234567',
        password: 'password123',
      };

      (mockUserService.findByPhoneNumber as jest.Mock) = jest.fn().mockResolvedValue(null);

      await expect(authService.login(data)).rejects.toThrow('Invalid phone number or password');
    });
  });
});
