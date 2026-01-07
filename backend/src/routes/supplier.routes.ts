import { Router } from 'express';
import { SupplierController } from '../controllers/supplier.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();
const supplierController = new SupplierController();

// All routes require authentication
router.use(authenticate);

router.get('/', (req, res) => supplierController.getAllSuppliers(req, res));
router.get('/:id', (req, res) => supplierController.getSupplierById(req, res));
router.get('/:id/balance', (req, res) => supplierController.getSupplierBalance(req, res));
router.get('/:id/with-balance', (req, res) => supplierController.getSupplierWithBalance(req, res));
router.post('/', (req, res) => supplierController.createSupplier(req, res));
router.put('/:id', (req, res) => supplierController.updateSupplier(req, res));
router.delete('/:id', (req, res) => supplierController.deleteSupplier(req, res));

export default router;


