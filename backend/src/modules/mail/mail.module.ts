import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import config from '../../config/mail.config';
import { MailService } from './mail.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [config],
      isGlobal: true,
    }),
  ],
  providers: [MailService],
  exports: [MailService],
})
export class MailModule {}
