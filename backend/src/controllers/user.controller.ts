import { Request, Response } from 'express';
import { UserService } from '../services/user.service';
import { AuthService } from '../services/auth.service';
import { UpdateUserInput } from '../types';

const userService = new UserService();
const authService = new AuthService();

export class UserController {
  async getAllUsers(req: Request, res: Response) {
    try {
      const users = await userService.getAllUsers();
      res.json(users);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  async getUserById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const user = await userService.getUserById(id);
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
      res.json(user);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  async updateUser(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const data: UpdateUserInput = req.body;
      const user = await userService.updateUser(id, data);
      res.json(user);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  async deleteUser(req: Request, res: Response) {
    try {
      const { id } = req.params;
      await userService.deleteUser(id);
      res.json({ message: 'User deleted successfully' });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  async activateUser(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const user = await userService.activateUser(id);
      res.json(user);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  async deactivateUser(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const user = await userService.deactivateUser(id);
      res.json(user);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  async updateUserRole(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { role } = req.body;
      if (role !== 'admin' && role !== 'user') {
        return res.status(400).json({ error: 'Invalid role. Must be "admin" or "user"' });
      }
      const user = await userService.updateUserRole(id, role);
      res.json(user);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  async adminResetPassword(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { newPassword } = req.body;
      if (!newPassword) {
        return res.status(400).json({ error: 'New password is required' });
      }

      await authService.adminResetPassword(id, newPassword);
      res.json({ message: 'Password has been reset successfully' });
    } catch (error: any) {
      if (error.message === 'Password must be at least 6 characters') {
        return res.status(400).json({ error: error.message });
      }
      res.status(500).json({ error: error.message || 'Failed to reset password' });
    }
  }

  async getUserWithSalesStats(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const user = await userService.getUserWithSalesStats(id);
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
      res.json(user);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  async getAllUsersWithSalesStats(req: Request, res: Response) {
    try {
      const users = await userService.getAllUsersWithSalesStats();
      res.json(users);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }
}

