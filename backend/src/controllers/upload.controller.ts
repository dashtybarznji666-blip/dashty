import { Request, Response } from 'express';
import { UploadService } from '../services/upload.service';
import { asyncHandler } from '../middleware/errorHandler.middleware';

const uploadService = new UploadService();

export class UploadController {
  uploadImage = asyncHandler(async (req: Request, res: Response) => {
    if (!req.file) {
      return res.status(400).json({ error: 'No image file provided' });
    }

    // Validate file size (additional check)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (req.file.size > maxSize) {
      return res.status(400).json({ error: 'File size exceeds 5MB limit' });
    }

    // Validate file type (additional check)
    const allowedMimeTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!allowedMimeTypes.includes(req.file.mimetype)) {
      return res.status(400).json({ error: 'Invalid file type. Only JPEG, PNG, and WebP images are allowed' });
    }

    try {
      const imageUrl = await uploadService.uploadImage(req.file);
      res.json({ imageUrl });
    } catch (error: any) {
      console.error('Upload error:', error);
      // Provide more specific error messages
      if (error.message?.includes('Cloudinary')) {
        throw new Error('Failed to upload image to cloud storage. Please try again.');
      }
      throw new Error(error.message || 'Failed to upload image');
    }
  });
}

