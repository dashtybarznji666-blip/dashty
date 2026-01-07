import multer from 'multer';
import { Request, Response, NextFunction } from 'express';

// Configure multer to store files in memory (buffer) for Cloudinary
const storage = multer.memoryStorage();

const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    // Accept only image files
    const allowedMimeTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (allowedMimeTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed (JPEG, PNG, or WebP)'));
    }
  },
});

// Wrapper middleware to handle multer errors properly
export const uploadMiddleware = (req: Request, res: Response, next: NextFunction) => {
  upload.single('image')(req, res, (err: any) => {
    if (err) {
      if (err instanceof multer.MulterError) {
        if (err.code === 'LIMIT_FILE_SIZE') {
          return res.status(400).json({ error: 'File size exceeds 5MB limit' });
        }
        return res.status(400).json({ error: `Upload error: ${err.message}` });
      }
      // Handle fileFilter errors
      return res.status(400).json({ error: err.message || 'Invalid file type' });
    }
    next();
  });
};

