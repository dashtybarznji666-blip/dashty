import { Router } from 'express';
import { ExchangeRateController } from '../controllers/exchange-rate.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();
const exchangeRateController = new ExchangeRateController();

// All routes require authentication
router.use(authenticate);

router.get('/', (req, res) => exchangeRateController.getCurrentRate(req, res));
router.post('/', (req, res) => exchangeRateController.setRate(req, res));
router.get('/history', (req, res) => exchangeRateController.getRateHistory(req, res));

export default router;

