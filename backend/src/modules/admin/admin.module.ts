import { Module, BadRequestException } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService, ConfigModule } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { JwtStrategy } from './strategies/jwt.strategy';
import { DatabaseModule } from '../database/prisma.module';
import { MailModule } from '../mail/mail.module';

@Module({
  imports: [
    ConfigModule,
    DatabaseModule,
    MailModule,
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        const secret = config.get<string>('jwt.accessSecret');
        const expiresIn = config.get<string>('jwt.expiresIn');
        if (!secret) {
          throw new BadRequestException('JWT secret is not configured');
        }
        return {
          secret,
          signOptions: {
            expiresIn,
          },
        };
      },
    }),
  ],
  controllers: [AdminController],
  providers: [AdminService, JwtStrategy],
  exports: [AdminService],
})
export class AdminModule {}
