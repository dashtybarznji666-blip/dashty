import { Router } from 'express';
import { SaleController } from '../controllers/sale.controller';
import { authenticate } from '../middleware/auth.middleware';
import { validate } from '../middleware/validation.middleware';
import { createSaleSchema } from '../validators';

const router = Router();
const saleController = new SaleController();

// All routes require authentication
router.use(authenticate);

router.get('/', (req, res) => saleController.getAllSales(req, res));
router.get('/today', (req, res) => saleController.getTodaySales(req, res));
router.get('/online', (req, res) => saleController.getOnlineSales(req, res));
router.get('/stats', (req, res) => saleController.getSalesStats(req, res));
router.get('/user/:userId', (req, res) => saleController.getSalesByUser(req, res));
router.get('/user/:userId/stats', (req, res) => saleController.getUserSalesStats(req, res));
router.get('/:id', (req, res) => saleController.getSaleById(req, res));
router.post('/', validate(createSaleSchema), (req, res) => saleController.createSale(req, res));
router.delete('/all', (req, res) => saleController.deleteAllSales(req, res));
router.delete('/shipping/all', (req, res) => saleController.deleteAllShippingSales(req, res));
router.delete('/:id', (req, res) => saleController.deleteSale(req, res));

export default router;


