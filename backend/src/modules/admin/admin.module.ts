import { Module, BadRequestException } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService, ConfigModule } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { JwtStrategy } from './strategies/jwt.strategy';
import { MailModule } from '../mail/mail.module';
import { AttendeeModule } from '../attendee/attendee.module';
import { PaymentsModule } from '../payment/payment.module';
import { RolesController } from './roles.controller';
import { RolesService } from './roles.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { SuperadminSeedService } from './superadmin-seed.service';
// import { AuditLogModule } from './audit-log/audit-log.module';

@Module({
  imports: [
    // AuditLogModule,
    AttendeeModule,
    ConfigModule,
    PaymentsModule,
    MailModule,
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        const secret = config.get<string>('jwt.accessSecret');
        const expiresIn = config.get<`${number}`>('jwt.expiresIn');
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
  controllers: [AdminController, RolesController],
  providers: [
    AdminService,
    JwtStrategy,
    RolesService,
    PrismaService,
    SuperadminSeedService,
  ],
  exports: [
    AdminService,
    // AuditLogModule
  ],
})
export class AdminModule {}
