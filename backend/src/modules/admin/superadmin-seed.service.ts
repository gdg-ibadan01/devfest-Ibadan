import { Injectable, OnModuleInit, Logger, Inject } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import superadminConfig from 'src/config/superadmin.config';

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

    // Check if a SUPER_ADMIN role exists
    let superAdminRole = await this.prisma.role.findUnique({
      where: { name: 'SUPER_ADMIN' },
    });

    // If not, create it
    if (!superAdminRole) {
      superAdminRole = await this.prisma.role.create({
        data: {
          name: 'SUPER_ADMIN',
          description: 'Super Administrator with full system access',
          permissions: [],
          isActive: true,
        },
      });
      this.logger.log('Created SUPER_ADMIN role.');
    }

    // Check if a super admin already exists
    const existing = await this.prisma.admin.findFirst({
      where: {
        role: { name: 'SUPER_ADMIN' },
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
        role: {
          connect: { id: superAdminRole.id },
        },
      },
    });

    this.logger.log(`Initialized default superadmin account: ${email}`);
  }
}
