import { Router } from 'express';
import { StockController } from '../controllers/stock.controller';
import { authenticate } from '../middleware/auth.middleware';
import { validate } from '../middleware/validation.middleware';
import { addStockSchema, bulkAddStockSchema, updateStockSchema } from '../validators';

const router = Router();
const stockController = new StockController();

// All routes require authentication
router.use(authenticate);

router.get('/', (req, res) => stockController.getAllStock(req, res));
router.get('/low', (req, res) => stockController.getLowStock(req, res));
router.get('/shoe/:shoeId', (req, res) => stockController.getStockByShoeId(req, res));
router.post('/', validate(addStockSchema), (req, res) => stockController.addStock(req, res));
router.post('/bulk', validate(bulkAddStockSchema), (req, res) => stockController.bulkAddStock(req, res));
router.put('/:id', validate(updateStockSchema), (req, res) => stockController.updateStock(req, res));
router.delete('/:id', (req, res) => stockController.deleteStock(req, res));

router.get('/', (req, res) => stockController.getAllStock(req, res));
router.get('/low', (req, res) => stockController.getLowStock(req, res));
router.get('/shoe/:shoeId', (req, res) => stockController.getStockByShoeId(req, res));
router.post('/', (req, res) => stockController.addStock(req, res));
router.post('/bulk', (req, res) => stockController.bulkAddStock(req, res));
router.put('/:id', (req, res) => stockController.updateStock(req, res));
router.delete('/:id', (req, res) => stockController.deleteStock(req, res));

export default router;


