import { registerAs } from '@nestjs/config';

export default registerAs('cloudinary', () => ({
  cloudName: process.env.CLOUDINARY_CLOUD_NAME || '',
  apiKey: process.env.CLOUDINARY_API_KEY || '',
  apiSecret: process.env.CLOUDINARY_API_SECRET || '',
  defaultFolder: process.env.CLOUDINARY_DEFAULT_FOLDER || 'uploads',
  maxFileSize: parseInt(process.env.CLOUDINARY_MAX_FILE_SIZE ?? '5242880', 10), // 5MB default
}));
