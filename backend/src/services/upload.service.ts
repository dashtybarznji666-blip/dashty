import cloudinary from '../lib/cloudinary';
import { UploadApiResponse, UploadApiErrorResponse } from 'cloudinary';
import { logError } from '../lib/logger';

export class UploadService {
  async uploadImage(file: Express.Multer.File): Promise<string> {
    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: 'shoe-store',
          resource_type: 'image',
          allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
          transformation: [
            { width: 800, height: 800, crop: 'limit' },
            { quality: 'auto' },
          ],
        },
        (error: UploadApiErrorResponse | undefined, result: UploadApiResponse | undefined) => {
          if (error) {
            logError('Cloudinary upload error', error);
            reject(new Error('Failed to upload image to Cloudinary'));
          } else if (result) {
            resolve(result.secure_url);
          } else {
            reject(new Error('Unknown error during upload'));
          }
        }
      );

      uploadStream.end(file.buffer);
    });
  }

  async deleteImage(imageUrl: string): Promise<void> {
    try {
      // Extract public_id from Cloudinary URL
      const urlParts = imageUrl.split('/');
      const filenameWithExt = urlParts[urlParts.length - 1];
      const publicId = `shoe-store/${filenameWithExt.split('.')[0]}`;

      await cloudinary.uploader.destroy(publicId);
    } catch (error) {
      logError('Failed to delete image from Cloudinary', error);
      // Don't throw - deletion failure shouldn't break the flow
    }
  }
}







