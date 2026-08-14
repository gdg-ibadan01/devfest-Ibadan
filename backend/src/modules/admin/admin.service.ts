import {
  Injectable,
  ConflictException,
  UnauthorizedException,
  NotFoundException,
  ForbiddenException,
  Inject,
  Logger,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService, ConfigType } from '@nestjs/config';
import { PrismaService } from 'src/prisma/prisma.service';
import { hashSync, genSaltSync, compareSync } from 'bcrypt';
import { CreateAdminDto } from './dto/create-admin.dto';
import { LoginAdminDto } from './dto/login-admin.dto';
import { InviteAdminDto } from './dto/invite-admin.dto';
import { AdminQueryDto } from './dto/admin-query.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import {
  IAdmin,
  IJwtPayload,
  IAdminResponse,
  IDashboardStats,
} from './interfaces/admin.interface';
// import { EventStatus } from '@prisma/client';
import { MailService } from '../mail/mail.service';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
import { AdminCreateAttendeeDto } from './dto/create-attendee.dto';
import { IAttendee, ICreateResponse } from './interfaces/attendee.interface';
import { PaymentsService } from '../payment/payment.service';
import { IPaystackResponse } from '../payment/interfaces/payment.interface';
import JWTConfig from 'src/config/jwt.config';
import { type PERMISSION_IDS } from 'src/common/constants/permissions';

type AuthTokens = {
  accessToken: string;
  refreshToken: string;
};

@Injectable()
export class AdminService {
  private readonly logger = new Logger(AdminService.name);

  constructor(
    private readonly configService: ConfigService,
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private mailService: MailService,
    private readonly paymentsService: PaymentsService,
    @Inject(JWTConfig.KEY)
    private jwtConfig: ConfigType<typeof JWTConfig>,
  ) {}

  // async signup(signupDto: CreateAdminDto): Promise<ILoginResponse> {
  //   const { fullName, email, password } = signupDto;

  //   // Check if admin already exists
  //   const existingAdmin = await this.prisma.admin.findUnique({
  //     where: { email },
  //   });

  //   if (existingAdmin) {
  //     throw new ConflictException('Admin with this email already exists');
  //   }

  //   // Hash the password
  //   const salt = genSaltSync(10);
  //   const hashedPassword = hashSync(password, salt);

  //   // Create admin
  //   const admin = await this.prisma.admin.create({
  //     data: {
  //       fullName,
  //       email,
  //       password: hashedPassword,
  //       roleId: '',
  //     },
  //   });

  //   // Generate tokens
  //   const tokens = await this.generateAuthTokens({
  //     sub: admin.id,
  //     email: admin.email,
  //     role: {
  //     id:
  //     },
  //   });

  //   return {
  //     admin: this.excludePassword(admin),
  //     ...tokens,
  //   };
  // }

  async login(payload: LoginAdminDto) {
    const admin = await this.prisma.admin.findUnique({
      where: { email: payload.email.toLowerCase() },
      include: { role: true },
    });

    if (!admin) {
      throw new UnauthorizedException('Invalid credentials');
    }

    if (!admin.isActive) {
      throw new UnauthorizedException('Account is deactivated');
    }

    const isPasswordValid = compareSync(payload.password, admin.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const tokens = this.generateAuthTokens({
      sub: admin.id,
      email: admin.email,
      role: {
        id: admin.roleId,
        name: admin.role.name,
        permissions: admin.role.permissions as PERMISSION_IDS,
      },
    });

    return {
      admin: {
        id: admin.id,
        fullName: admin.fullName,
        email: admin.email.toLowerCase(),
        role: admin.role.name,
      },
      ...tokens,
    };
  }

  async inviteAdmin(inviteDto: InviteAdminDto, invitedBy: string) {}

  async refreshToken(
    refreshToken: string,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    try {
      const payload = this.jwtService.verify(refreshToken, {
        secret: this.jwtConfig.refreshSecret,
      });

      const admin = await this.prisma.admin.findUnique({
        where: { id: payload.sub },
        include: { role: true },
      });

      if (!admin || !admin.isActive) {
        throw new UnauthorizedException('Invalid refresh token');
      }

      return this.generateAuthTokens({
        sub: admin.id,
        email: admin.email,
        role: {
          id: admin.role.id,
          name: admin.role.name,
          permissions: admin.role.permissions as PERMISSION_IDS,
        },
      });
    } catch (error) {
      this.logger.error(error);
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  async changePassword(
    adminId: string,
    changePasswordDto: ChangePasswordDto,
  ): Promise<{ message: string }> {
    const { currentPassword, newPassword } = changePasswordDto;

    const admin = await this.prisma.admin.findUnique({
      where: { id: adminId },
    });

    if (!admin) {
      throw new NotFoundException('Admin not found');
    }

    // Verify current password
    const isCurrentPasswordValid = compareSync(currentPassword, admin.password);
    if (!isCurrentPasswordValid) {
      throw new UnauthorizedException('Current password is incorrect');
    }

    // Hash new password
    const salt = genSaltSync(10);
    const hashedNewPassword = hashSync(newPassword, salt);

    // Update password and activate account if it was inactive
    await this.prisma.admin.update({
      where: { id: adminId },
      data: {
        password: hashedNewPassword,
        isActive: true, // Activate account on password change
      },
    });

    return { message: 'Password changed successfully' };
  }

  async create(adminCreateAttendeeDto: AdminCreateAttendeeDto) {}

  async deactivateAdmin(
    adminId: string,
    deactivatedBy: string,
  ): Promise<{ message: string }> {
    if (!deactivatedBy) {
      throw new UnauthorizedException('Invalid authentication token');
    }

    const deactivator = await this.prisma.admin.findUnique({
      where: { id: deactivatedBy },
    });

    if (!deactivator || deactivator.roleId !== 'SUPER_ADMIN') {
      throw new ForbiddenException('Only SUPER_ADMIN can deactivate admins');
    }

    if (adminId === deactivatedBy) {
      throw new ForbiddenException('Cannot deactivate yourself');
    }

    await this.prisma.admin.update({
      where: { id: adminId },
      data: { isActive: false },
    });

    return { message: 'Admin deactivated successfully' };
  }

  private generateAuthTokens(payload: IJwtPayload): AuthTokens {
    const accessToken = this.jwtService.sign(payload, {
      expiresIn: this.jwtConfig.expiresIn,
      secret: this.jwtConfig.accessSecret,
      algorithm: 'HS256',
    });

    const refreshToken = this.jwtService.sign<IJwtPayload>(payload, {
      secret: this.jwtConfig.refreshSecret,
      expiresIn: this.jwtConfig.refreshExpiresIn,
      algorithm: 'HS256',
    });

    return { accessToken, refreshToken };
  }

  private excludePassword(admin: any) {
    const { password, ...adminWithoutPassword } = admin;
    return adminWithoutPassword;
  }

  async findAll(query: AdminQueryDto) {
    const { search, role, isActive, page = 1, limit = 10 } = query;
    const skip = (page - 1) * limit;

    const where: any = {};

    if (search) {
      where.OR = [
        { fullName: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
      ];
    }

    if (role) {
      where.role = role;
    }

    if (typeof isActive === 'boolean') {
      where.isActive = isActive;
    }

    const [admins, total] = await Promise.all([
      this.prisma.admin.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        // include: {
        //   _count: {
        //     select: {
        //       createdEvents: true,
        //     },
        //   },
        // },
      }),
      this.prisma.admin.count({ where }),
    ]);

    return {
      data: admins,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: string): Promise<IAdminResponse> {
    const admin = await this.prisma.admin.findUnique({
      where: { id },
      // include: {
      // createdEvents: {
      //   select: {
      //     id: true,
      //     title: true,
      //     startDate: true,
      //     status: true,
      //     currentAttendees: true,
      //     maxAttendees: true,
      //   },
      //   orderBy: { createdAt: 'desc' },
      //   take: 10,
      // },
      // _count: {
      //   select: {
      //     createdEvents: true,
      //   },
      // },
      // },
    });

    if (!admin) {
      throw new NotFoundException('Admin not found');
    }

    return this.excludePassword(admin);
  }

  async findByEmail(email: string) {
    return await this.prisma.admin.findUnique({
      where: { email },
    });
  }

  async updateStatus(id: string, isActive: boolean) {
    await this.findOne(id);
    return await this.prisma.admin.update({
      where: { id },
      data: { isActive },
    });
  }

  async remove(id: string): Promise<void> {
    await this.findOne(id);
    await this.prisma.admin.delete({ where: { id } });
  }

  // async getDashboardStats(): Promise<IDashboardStats> {
  //   const [
  //     totalEvents,
  //     totalAttendees,
  //     totalRegistrations,
  //     totalRevenue,
  //     upcomingEvents,
  //     ongoingEvents,
  //     completedEvents,
  //     recentRegistrations,
  //   ] = await Promise.all([
  //     this.prisma.event.count(),
  //     this.prisma.attendee.count(),
  //     this.prisma.registration.count(),
  //     this.prisma.payment.aggregate({
  //       where: { status: PaymentStatus.SUCCESS },
  //       _sum: { amount: true },
  //     }),
  //     this.prisma.event.count({
  //       where: {
  //         status: EventStatus.PUBLISHED,
  //         startDate: { gt: new Date() },
  //       },
  //     }),
  //     this.prisma.event.count({
  //       where: { status: EventStatus.ONGOING },
  //     }),
  //     this.prisma.event.count({
  //       where: { status: EventStatus.COMPLETED },
  //     }),
  //     this.prisma.registration.findMany({
  //       take: 10,
  //       orderBy: { createdAt: 'desc' },
  //       include: {
  //         event: {
  //           select: { title: true },
  //         },
  //         attendee: {
  //           select: { fullName: true, email: true },
  //         },
  //       },
  //     }),
  //   ]);

  // Get event stats
  //   const eventStats = await this.prisma.event.findMany({
  //     select: {
  //       id: true,
  //       title: true,
  //       startDate: true,
  //       currentAttendees: true,
  //       maxAttendees: true,
  //       status: true,
  //       _count: {
  //         select: {
  //           registrations: true,
  //           payments: true,
  //         },
  //       },
  //     },
  //     orderBy: { startDate: 'desc' },
  //     take: 5,
  //   });

  //   return {
  //     totalEvents,
  //     totalAttendees,
  //     totalRegistrations,
  //     totalRevenue: Number(totalRevenue._sum.amount) || 0,
  //     upcomingEvents,
  //     ongoingEvents,
  //     completedEvents,
  //     recentRegistrations,
  //     eventStats,
  //   };
  // }

  // async getEventAnalytics(eventId: string) {
  //   const event = await this.prisma.event.findUnique({
  //     where: { id: eventId },
  //     include: {
  //       registrations: {
  //         include: {
  //           attendee: true,
  //           payment: true,
  //           ticket: true,
  //         },
  //       },
  //       _count: {
  //         select: {
  //           registrations: true,
  //           payments: true,
  //           tickets: true,
  //         },
  //       },
  //     },
  //   });

  //   if (!event) {
  //     throw new NotFoundException('Event not found');
  //   }
  //   const analytics = {
  //     event: {
  //       id: event.id,
  //       title: event.title,
  //       startDate: event.startDate,
  //       endDate: event.endDate,
  //       maxAttendees: event.maxAttendees,
  //       currentAttendees: event.currentAttendees,
  //       status: event.status,
  //     },
  //     registrations: {
  //       total: event._count.registrations,
  //       confirmed: event.registrations.filter((r) => r.status === 'CONFIRMED')
  //         .length,
  //       pending: event.registrations.filter((r) => r.status === 'PENDING')
  //         .length,
  //       cancelled: event.registrations.filter((r) => r.status === 'CANCELLED')
  //         .length,
  //       checkedIn: event.registrations.filter((r) => r.isCheckedIn).length,
  //     },
  //     payments: {
  //       total: event._count.payments,
  //       successful: event.registrations.filter(
  //         (r) => r.payment?.status === 'SUCCESS',
  //       ).length,
  //       pending: event.registrations.filter(
  //         (r) => r.payment?.status === 'PENDING',
  //       ).length,
  //       failed: event.registrations.filter(
  //         (r) => r.payment?.status === 'FAILED',
  //       ).length,
  //     },
  //     revenue: event.registrations
  //       .filter((r) => r.payment?.status === 'SUCCESS')
  //       .reduce((sum, r) => sum + (Number(r.payment?.amount) || 0), 0),
  //     attendeeBreakdown: {
  //       byCompany: this.groupBy(
  //         event.registrations.map((r) => r.attendee),
  //         'company',
  //       ),
  //       byJobTitle: this.groupBy(
  //         event.registrations.map((r) => r.attendee),
  //         'jobTitle',
  //       ),
  //     },
  //   };

  //   return analytics;
  // }

  private groupBy(array: any[], key: string) {
    return array.reduce((groups, item) => {
      const group = item[key] || 'Not specified';
      if (!groups[group]) {
        groups[group] = 0;
      }
      groups[group]++;
      return groups;
    }, {});
  }
}
