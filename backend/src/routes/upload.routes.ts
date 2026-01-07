import { Router } from 'express';
import { UploadController } from '../controllers/upload.controller';
import { uploadMiddleware } from '../middleware/upload';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();
const uploadController = new UploadController();

// All routes require authentication
router.use(authenticate);

router.post('/', uploadMiddleware, uploadController.uploadImage);

export default router;

