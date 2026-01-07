import { Router } from 'express';
import { ActivityLogController } from '../controllers/activity-log.controller';
import { authenticate } from '../middleware/auth.middleware';
import { requireRole } from '../middleware/authorization.middleware';

const router = Router();
const activityLogController = new ActivityLogController();

// All routes require authentication
router.use(authenticate);

/**
 * @swagger
 * /activity-logs:
 *   get:
 *     summary: Get activity logs
 *     tags: [Activity Logs]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: skip
 *         schema:
 *           type: integer
 *         description: Number of records to skip
 *       - in: query
 *         name: take
 *         schema:
 *           type: integer
 *         description: Number of records to take
 *       - in: query
 *         name: userId
 *         schema:
 *           type: string
 *         description: Filter by user ID
 *       - in: query
 *         name: action
 *         schema:
 *           type: string
 *         description: Filter by action
 *       - in: query
 *         name: entityType
 *         schema:
 *           type: string
 *         description: Filter by entity type
 *     responses:
 *       200:
 *         description: List of activity logs
 */
router.get('/', requireRole('admin'), activityLogController.getAll);

/**
 * @swagger
 * /activity-logs/{id}:
 *   get:
 *     summary: Get activity log by ID
 *     tags: [Activity Logs]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Activity log details
 *       404:
 *         description: Activity log not found
 */
router.get('/:id', requireRole('admin'), activityLogController.getById);

/**
 * @swagger
 * /activity-logs/user/{userId}:
 *   get:
 *     summary: Get user activity logs
 *     tags: [Activity Logs]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *       - in: query
 *         name: skip
 *         schema:
 *           type: integer
 *       - in: query
 *         name: take
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: User activity logs
 */
router.get('/user/:userId', activityLogController.getUserActivity);

export default router;

