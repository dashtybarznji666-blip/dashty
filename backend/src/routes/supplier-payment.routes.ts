import { Router } from 'express';
import { SupplierPaymentController } from '../controllers/supplier-payment.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();
const paymentController = new SupplierPaymentController();

// All routes require authentication
router.use(authenticate);

router.get('/', (req, res) => paymentController.getAllPayments(req, res));
router.get('/supplier/:supplierId', (req, res) => paymentController.getPaymentsBySupplier(req, res));
router.get('/:id', (req, res) => paymentController.getPaymentById(req, res));
router.post('/', (req, res) => paymentController.createPayment(req, res));
router.put('/:id', (req, res) => paymentController.updatePayment(req, res));
router.delete('/:id', (req, res) => paymentController.deletePayment(req, res));

export default router;


