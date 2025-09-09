import {
  Injectable,
  BadRequestException,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { v2 as cloudinary, UploadApiResponse } from 'cloudinary';
import { Readable } from 'stream';
import sharp from 'sharp';

@Injectable()
export class UploadService {
  private readonly logger = new Logger(UploadService.name);

  constructor(private readonly configService: ConfigService) {
    const cloudConfig = this.configService.get('cloudinary');
    cloudinary.config({
      cloud_name: cloudConfig.cloudName,
      api_key: cloudConfig.apiKey,
      api_secret: cloudConfig.apiSecret,
    });
  }

  private bufferToStream(buffer: Buffer): Readable {
    return Readable.from(buffer);
  }

  async uploadImage(
    file: Express.Multer.File,
    folder?: string,
  ): Promise<{ url: string; publicId: string }> {
    const cloudConfig = this.configService.get('cloudinary');
    if (!file.mimetype.startsWith('image/')) {
      throw new BadRequestException('Only image files are allowed');
    }
    if (file.size > cloudConfig.maxFileSize) {
      throw new BadRequestException(
        `File too large. Max ${cloudConfig.maxFileSize} bytes allowed.`,
      );
    }

    const optimizedBuffer = await sharp(file.buffer)
      .resize(800, 800, { fit: 'inside' })
      .webp({ quality: 80 })
      .toBuffer();

    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: folder ?? cloudConfig.defaultFolder ?? 'uploads',
          resource_type: 'image',
          format: 'webp',
        },
        (error: Error | undefined, result: UploadApiResponse | undefined) => {
          if (error || !result)
            return reject(error || new Error('Upload failed'));
          resolve({ url: result.secure_url, publicId: result.public_id });
        },
      );

      this.bufferToStream(optimizedBuffer).pipe(uploadStream);
    });
  }

  async uploadMultipleImages(
    files: Express.Multer.File[],
    folder?: string,
  ): Promise<Array<{ url: string; publicId: string }>> {
    return Promise.all(files.map((file) => this.uploadImage(file, folder)));
  }

  async deleteMedia(
    publicId: string,
    resourceType: 'image' = 'image',
  ): Promise<void> {
    try {
      await cloudinary.uploader.destroy(publicId, {
        resource_type: resourceType,
      });
    } catch (error) {
      this.logger.error(
        `Failed to delete ${resourceType} ${publicId}`,
        error.stack,
      );
      throw new InternalServerErrorException('Failed to delete media');
    }
  }
}
