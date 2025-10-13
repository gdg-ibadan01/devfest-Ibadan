import { Global, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import config from '../../config/cloudinary.config';
import { UploadService } from './upload.service';

@Global()
@Module({
  imports: [
    ConfigModule.forRoot({
      load: [config],
      isGlobal: true,
    }),
  ], // Ensure ConfigModule is available
  providers: [UploadService],
  exports: [UploadService], // Export to use in other modules
})
export class UploadModule {}
