import { Injectable, OnModuleInit, Logger, Inject } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import superadminConfig from 'src/config/superadmin.config';
import { PERMISSIONS } from 'src/common/constants/permissions';

@Injectable()
export class SuperadminSeedService implements OnModuleInit {
  private readonly logger = new Logger(SuperadminSeedService.name);

  constructor(
    private readonly prisma: PrismaService,
    @Inject(superadminConfig.KEY)
    private saConfig: ConfigType<typeof superadminConfig>,
  ) {}

  async onModuleInit() {
    await this.seedSuperadmin();
  }

  private async seedSuperadmin() {
    const email = this.saConfig.email;
    const password = this.saConfig.password;

    if (!email || !password) {
      this.logger.warn(
        'Skipping Superadmin auto-creation: SUPERADMIN_EMAIL or SUPERADMIN_PASSWORD not set in env.',
      );
      return;
    }

    const existing = await this.prisma.admin.findFirst({
      where: {
        role: 'SUPER_ADMIN',
      },
    });

    if (existing) {
      this.logger.log(
        'Skipping Superadmin auto-creation: Superadmin exists already.',
      );
      return;
    }

    const hashed = await bcrypt.hash(password, 10);
    await this.prisma.admin.create({
      data: {
        email,
        password: hashed,
        fullName: 'Super Admin',
        role: 'SUPER_ADMIN',
      },
    });

    this.logger.log(`Initialized default superadmin account: ${email}`);
  }
}
