import { Router } from 'express';
import { PurchaseController } from '../controllers/purchase.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();
const purchaseController = new PurchaseController();

// All routes require authentication
router.use(authenticate);

router.get('/', (req, res) => purchaseController.getAllPurchases(req, res));
router.get('/todos', (req, res) => purchaseController.getTodosGroupedBySupplier(req, res));
router.get('/supplier/:supplierId', (req, res) => purchaseController.getPurchasesBySupplier(req, res));
router.get('/supplier/:supplierId/credit', (req, res) => purchaseController.getCreditPurchases(req, res));
router.get('/:id', (req, res) => purchaseController.getPurchaseById(req, res));
router.get('/:id/balance', (req, res) => purchaseController.getPurchaseBalance(req, res));
router.post('/', (req, res) => purchaseController.createPurchase(req, res));
router.put('/:id', (req, res) => purchaseController.updatePurchase(req, res));
router.patch('/:id/todo', (req, res) => purchaseController.markAsTodo(req, res));
router.patch('/:id/done', (req, res) => purchaseController.markAsDone(req, res));
router.delete('/:id', (req, res) => purchaseController.deletePurchase(req, res));

export default router;


