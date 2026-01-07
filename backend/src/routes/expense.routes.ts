import { Router } from 'express';
import { ExpenseController } from '../controllers/expense.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();
const expenseController = new ExpenseController();

// All routes require authentication
router.use(authenticate);

router.get('/', (req, res) => expenseController.getAllExpenses(req, res));
router.get('/stats', (req, res) => expenseController.getExpenseStats(req, res));
router.get('/today', (req, res) => expenseController.getTodayExpenses(req, res));
router.get('/month', (req, res) => expenseController.getMonthExpenses(req, res));
router.get('/daily', (req, res) => expenseController.getDailyExpenses(req, res));
router.get('/monthly', (req, res) => expenseController.getMonthlyExpenses(req, res));
router.get('/:id', (req, res) => expenseController.getExpenseById(req, res));
router.post('/', (req, res) => expenseController.createExpense(req, res));
router.put('/:id', (req, res) => expenseController.updateExpense(req, res));
router.delete('/:id', (req, res) => expenseController.deleteExpense(req, res));

export default router;
