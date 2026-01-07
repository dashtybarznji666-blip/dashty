import prisma from '../lib/prisma';

export interface CreateExpenseInput {
  title: string;
  description?: string;
  amount: number;
  category: string;
  type: 'daily' | 'monthly';
  date: Date;
}

export interface UpdateExpenseInput extends Partial<CreateExpenseInput> {}

export class ExpenseService {
  async getAllExpenses() {
    return prisma.expense.findMany({
      orderBy: {
        date: 'desc',
      },
    });
  }

  async getExpenseById(id: string) {
    return prisma.expense.findUnique({
      where: { id },
    });
  }

  async getDailyExpenses(date?: Date) {
    const targetDate = date || new Date();
    const startOfDay = new Date(targetDate);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(targetDate);
    endOfDay.setHours(23, 59, 59, 999);

    return prisma.expense.findMany({
      where: {
        date: {
          gte: startOfDay,
          lte: endOfDay,
        },
      },
      orderBy: {
        date: 'desc',
      },
    });
  }

  async getMonthlyExpenses(year: number, month: number) {
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0, 23, 59, 59, 999);

    return prisma.expense.findMany({
      where: {
        date: {
          gte: startDate,
          lte: endDate,
        },
      },
      orderBy: {
        date: 'desc',
      },
    });
  }

  async getExpensesByCategory(category: string) {
    return prisma.expense.findMany({
      where: { category },
      orderBy: {
        date: 'desc',
      },
    });
  }

  async createExpense(data: CreateExpenseInput) {
    return prisma.expense.create({
      data,
    });
  }

  async updateExpense(id: string, data: UpdateExpenseInput) {
    return prisma.expense.update({
      where: { id },
      data,
    });
  }

  async deleteExpense(id: string) {
    return prisma.expense.delete({
      where: { id },
    });
  }

  async getExpenseStats(startDate: Date, endDate: Date) {
    const expenses = await prisma.expense.findMany({
      where: {
        date: {
          gte: startDate,
          lte: endDate,
        },
      },
    });

    const totalExpenses = expenses.reduce((sum, exp) => sum + exp.amount, 0);
    const byCategory = expenses.reduce((acc, exp) => {
      acc[exp.category] = (acc[exp.category] || 0) + exp.amount;
      return acc;
    }, {} as Record<string, number>);

    const byType = expenses.reduce((acc, exp) => {
      acc[exp.type] = (acc[exp.type] || 0) + exp.amount;
      return acc;
    }, {} as Record<string, number>);

    return {
      totalExpenses,
      count: expenses.length,
      byCategory,
      byType,
    };
  }

  async getTodayExpenses() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    return this.getExpenseStats(today, tomorrow);
  }

  async getMonthExpenses() {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);

    return this.getExpenseStats(startOfMonth, endOfMonth);
  }
}
