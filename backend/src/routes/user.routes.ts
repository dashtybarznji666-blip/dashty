import { Router } from 'express';
import { UserController } from '../controllers/user.controller';
import { authenticate } from '../middleware/auth.middleware';
import { requireAdmin } from '../middleware/authorization.middleware';

const router = Router();
const userController = new UserController();

// All routes require authentication
router.use(authenticate);

// All user management routes require admin role
router.use(requireAdmin);

router.get('/', (req, res) => userController.getAllUsers(req, res));
router.get('/sales-stats', (req, res) => userController.getAllUsersWithSalesStats(req, res));
router.get('/:id', (req, res) => userController.getUserById(req, res));
router.get('/:id/sales-stats', (req, res) => userController.getUserWithSalesStats(req, res));
router.put('/:id', (req, res) => userController.updateUser(req, res));
router.delete('/:id', (req, res) => userController.deleteUser(req, res));
router.put('/:id/activate', (req, res) => userController.activateUser(req, res));
router.put('/:id/deactivate', (req, res) => userController.deactivateUser(req, res));
router.put('/:id/role', (req, res) => userController.updateUserRole(req, res));
router.post('/:id/reset-password', (req, res) => userController.adminResetPassword(req, res));

export default router;

