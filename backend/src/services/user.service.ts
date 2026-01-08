import prisma from '../lib/prisma';
import { CreateUserInput, UpdateUserInput } from '../types';
import bcrypt from 'bcrypt';

export class UserService {
  async createUser(data: CreateUserInput) {
    // Hash password
    const hashedPassword = await bcrypt.hash(data.password, 10);

    // Normalize phone number by trimming whitespace
    const normalizedPhone = data.phoneNumber.trim();

    // Check if phone number already exists
    const existingUser = await prisma.user.findUnique({
      where: { phoneNumber: normalizedPhone },
    });

    if (existingUser) {
      throw new Error('Phone number already exists');
    }

    return prisma.user.create({
      data: {
        name: data.name,
        phoneNumber: normalizedPhone,
        password: hashedPassword,
        role: data.role || 'user',
      },
    });
  }

  async findByPhoneNumber(phoneNumber: string) {
    // Normalize phone number by trimming whitespace
    const normalizedPhone = phoneNumber.trim();
    return prisma.user.findUnique({
      where: { phoneNumber: normalizedPhone },
      select: {
        id: true,
        name: true,
        phoneNumber: true,
        password: true,
        role: true,
        isActive: true,
        resetToken: true,
        resetTokenExpiry: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  async findById(id: string) {
    return prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        phoneNumber: true,
        password: true,
        role: true,
        isActive: true,
        resetToken: true,
        resetTokenExpiry: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  async validatePassword(plainPassword: string, hashedPassword: string): Promise<boolean> {
    return bcrypt.compare(plainPassword, hashedPassword);
  }

  async getAllUsers() {
    return prisma.user.findMany({
      orderBy: {
        createdAt: 'desc',
      },
      select: {
        id: true,
        name: true,
        phoneNumber: true,
        role: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  async getUserById(id: string) {
    return prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        phoneNumber: true,
        role: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  async updateUser(id: string, data: UpdateUserInput) {
    return prisma.user.update({
      where: { id },
      data,
      select: {
        id: true,
        name: true,
        phoneNumber: true,
        role: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  async deleteUser(id: string) {
    return prisma.user.delete({
      where: { id },
    });
  }

  async activateUser(id: string) {
    return prisma.user.update({
      where: { id },
      data: { isActive: true },
      select: {
        id: true,
        name: true,
        phoneNumber: true,
        role: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  async deactivateUser(id: string) {
    return prisma.user.update({
      where: { id },
      data: { isActive: false },
      select: {
        id: true,
        name: true,
        phoneNumber: true,
        role: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  async updateUserRole(id: string, role: 'admin' | 'user') {
    return prisma.user.update({
      where: { id },
      data: { role },
      select: {
        id: true,
        name: true,
        phoneNumber: true,
        role: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  async getUserSalesStats(userId: string) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    const weekAgo = new Date(today);
    weekAgo.setDate(weekAgo.getDate() - 7);
    
    const monthAgo = new Date(today);
    monthAgo.setMonth(monthAgo.getMonth() - 1);

    const [totalStats, todayStats, weekStats, monthStats] = await Promise.all([
      prisma.sale.aggregate({
        where: { userId },
        _count: { id: true },
        _sum: { totalPrice: true, profit: true },
        _avg: { totalPrice: true, profit: true },
      }),
      prisma.sale.aggregate({
        where: {
          userId,
          createdAt: {
            gte: today,
            lt: tomorrow,
          },
        },
        _count: { id: true },
        _sum: { totalPrice: true, profit: true },
      }),
      prisma.sale.aggregate({
        where: {
          userId,
          createdAt: {
            gte: weekAgo,
          },
        },
        _count: { id: true },
        _sum: { totalPrice: true, profit: true },
      }),
      prisma.sale.aggregate({
        where: {
          userId,
          createdAt: {
            gte: monthAgo,
          },
        },
        _count: { id: true },
        _sum: { totalPrice: true, profit: true },
      }),
    ]);

    return {
      totalSales: totalStats._count.id || 0,
      totalRevenue: totalStats._sum.totalPrice || 0,
      totalProfit: totalStats._sum.profit || 0,
      averageSaleAmount: totalStats._avg.totalPrice || 0,
      averageProfit: totalStats._avg.profit || 0,
      todaySales: todayStats._count.id || 0,
      todayRevenue: todayStats._sum.totalPrice || 0,
      todayProfit: todayStats._sum.profit || 0,
      weekSales: weekStats._count.id || 0,
      weekRevenue: weekStats._sum.totalPrice || 0,
      weekProfit: weekStats._sum.profit || 0,
      monthSales: monthStats._count.id || 0,
      monthRevenue: monthStats._sum.totalPrice || 0,
      monthProfit: monthStats._sum.profit || 0,
    };
  }

  async getAllUsersWithSalesStats() {
    const users = await this.getAllUsers();
    
    const usersWithStats = await Promise.all(
      users.map(async (user) => {
        const stats = await this.getUserSalesStats(user.id);
        return {
          ...user,
          salesStats: stats,
        };
      })
    );

    return usersWithStats;
  }

  async getUserWithSalesStats(id: string) {
    const user = await this.getUserById(id);
    if (!user) {
      return null;
    }
    
    const stats = await this.getUserSalesStats(id);
    return {
      ...user,
      salesStats: stats,
    };
  }
}


