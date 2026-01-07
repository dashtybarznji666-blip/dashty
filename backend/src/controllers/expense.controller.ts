import { Request, Response } from 'express';
import { ExpenseService, CreateExpenseInput, UpdateExpenseInput } from '../services/expense.service';

const expenseService = new ExpenseService();

export class ExpenseController {
  async getAllExpenses(req: Request, res: Response) {
    try {
      const expenses = await expenseService.getAllExpenses();
      res.json(expenses);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  async getExpenseById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const expense = await expenseService.getExpenseById(id);
      if (!expense) {
        return res.status(404).json({ error: 'Expense not found' });
      }
      res.json(expense);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  async getDailyExpenses(req: Request, res: Response) {
    try {
      const date = req.query.date ? new Date(req.query.date as string) : undefined;
      const expenses = await expenseService.getDailyExpenses(date);
      res.json(expenses);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  async getMonthlyExpenses(req: Request, res: Response) {
    try {
      const year = parseInt(req.query.year as string) || new Date().getFullYear();
      const month = parseInt(req.query.month as string) || new Date().getMonth() + 1;
      const expenses = await expenseService.getMonthlyExpenses(year, month);
      res.json(expenses);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  async createExpense(req: Request, res: Response) {
    try {
      const data = req.body as CreateExpenseInput;
      const expense = await expenseService.createExpense(data);
      res.status(201).json(expense);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  async updateExpense(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const data = req.body as UpdateExpenseInput;
      const expense = await expenseService.updateExpense(id, data);
      res.json(expense);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  async deleteExpense(req: Request, res: Response) {
    try {
      const { id } = req.params;
      await expenseService.deleteExpense(id);
      res.status(204).send();
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  async getExpenseStats(req: Request, res: Response) {
    try {
      const startDate = req.query.startDate
        ? new Date(req.query.startDate as string)
        : new Date(new Date().getFullYear(), new Date().getMonth(), 1);
      const endDate = req.query.endDate
        ? new Date(req.query.endDate as string)
        : new Date();

      const stats = await expenseService.getExpenseStats(startDate, endDate);
      res.json(stats);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  async getTodayExpenses(req: Request, res: Response) {
    try {
      const stats = await expenseService.getTodayExpenses();
      res.json(stats);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  async getMonthExpenses(req: Request, res: Response) {
    try {
      const stats = await expenseService.getMonthExpenses();
      res.json(stats);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }
}
