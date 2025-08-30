import {
  Injectable,
  ConflictException,
  UnauthorizedException,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../database/prisma.service';
import { hashSync, genSaltSync, compareSync } from 'bcrypt';
import * as crypto from 'crypto';
import { CreateAdminDto } from './dto/create-admin.dto';
import { LoginAdminDto } from './dto/login-admin.dto';
import { InviteAdminDto } from './dto/invite-admin.dto';
import { AdminQueryDto } from './dto/admin-query.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import {
  IAdmin,
  ILoginResponse,
  IJwtPayload,
  IAdminResponse,
  IDashboardStats,
} from './interfaces/admin.interface';
import { EventStatus } from '@prisma/client';
import { Role } from '@prisma/client';
import { PaymentStatus } from '@prisma/client';
import { MailService } from '../mail/mail.service';

@Injectable()
export class AdminService {
  constructor(
    private readonly configService: ConfigService,
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private mailService: MailService,
  ) {}

  async signup(signupDto: CreateAdminDto): Promise<ILoginResponse> {
    const { fullName, email, password } = signupDto;

    // Check if admin already exists
    const existingAdmin = await this.prisma.admin.findUnique({
      where: { email },
    });

    if (existingAdmin) {
      throw new ConflictException('Admin with this email already exists');
    }

    // Hash the password
    const salt = genSaltSync(10);
    const hashedPassword = hashSync(password, salt);

    // Create admin
    const admin = await this.prisma.admin.create({
      data: {
        fullName,
        email,
        password: hashedPassword,
        role: Role.SUPER_ADMIN,
      },
    });

    // Generate tokens
    const tokens = await this.generateTokens({
      sub: admin.id,
      email: admin.email,
      role: Role.SUPER_ADMIN,
    });

    return {
      admin: this.excludePassword(admin),
      ...tokens,
    };
  }

  async login(loginDto: LoginAdminDto): Promise<ILoginResponse> {
    const { email, password } = loginDto;

    // Find admin by email
    const admin = await this.prisma.admin.findUnique({
      where: { email },
    });

    if (!admin) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Check if admin is active
    if (!admin.isActive) {
      throw new UnauthorizedException('Account is deactivated');
    }

    // Verify password
    const isPasswordValid = compareSync(password, admin.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Generate tokens
    const tokens = await this.generateTokens({
      sub: admin.id,
      email: admin.email,
      role: Role.ADMIN,
    });

    return {
      admin: this.excludePassword(admin),
      ...tokens,
    };
  }

  async inviteAdmin(
    inviteDto: InviteAdminDto,
    invitedBy: string,
  ): Promise<{ message: string; tempPassword: string }> {
    const { fullName, email, role } = inviteDto;
    if (!invitedBy) {
      throw new UnauthorizedException('Missing inviter id from auth context');
    }

    // Verify inviter exists & is SUPER_ADMIN
    const inviter = await this.prisma.admin.findUnique({
      where: { id: invitedBy },
    });
    if (!inviter) {
      throw new UnauthorizedException('Inviter not found');
    }
    if (inviter.role !== Role.SUPER_ADMIN) {
      throw new ForbiddenException('Only SUPER_ADMIN can invite other admins');
    }

    // Prevent duplicates
    const existingAdmin = await this.prisma.admin.findUnique({
      where: { email },
    });
    if (existingAdmin) {
      throw new ConflictException('Admin with this email already exists');
    }

    // Create admin with temp password
    const tempPassword = crypto.randomBytes(12).toString('hex');
    const salt = genSaltSync(10);
    const hashedPassword = hashSync(tempPassword, salt);

    const admin = await this.prisma.admin.create({
      data: {
        fullName,
        email,
        password: hashedPassword,
        role,
        isActive: false,
        invitedById: inviter.id,
      },
    });

    await this.mailService.sendInviteEmail(
      admin.email,
      admin.fullName,
      tempPassword,
    );

    return { message: 'Admin invited successfully', tempPassword };
  }

  async refreshToken(
    refreshToken: string,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    try {
      const payload = this.jwtService.verify(refreshToken, {
        secret: process.env.JWT_REFRESH_SECRET,
      });

      const admin = await this.prisma.admin.findUnique({
        where: { id: payload.sub },
      });

      if (!admin || !admin.isActive) {
        throw new UnauthorizedException('Invalid refresh token');
      }

      return this.generateTokens({
        sub: admin.id,
        email: admin.email,
        role: Role.ADMIN,
      });
    } catch (error) {
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

  //   async getProfile(adminId: string): Promise<IAdminResponse> {
  //     const admin = await this.prisma.admin.findUnique({
  //       where: { id: adminId },
  //     });

  //     if (!admin) {
  //       throw new NotFoundException('Admin not found');
  //     }

  //     return this.excludePassword(admin);
  //   }

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

    if (!deactivator || deactivator.role !== 'SUPER_ADMIN') {
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

  private async generateTokens(
    payload: IJwtPayload,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const accessToken = await this.jwtService.sign(payload);

    const refreshSecret =
      await this.configService.get<string>('jwt.refreshSecret');
    const refreshExpiresIn =
      this.configService.get<string>('jwt.refreshExpiresIn') ?? '7d';
    if (!refreshSecret) {
      throw new Error('Refresh secret is not configured');
    }

    const refreshToken = await this.jwtService.sign(payload, {
      secret: refreshSecret,
      expiresIn: refreshExpiresIn,
    });

    return { accessToken, refreshToken };
  }

  private excludePassword(admin: any): IAdminResponse {
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
        include: {
          _count: {
            select: {
              createdEvents: true,
            },
          },
        },
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
      include: {
        createdEvents: {
          select: {
            id: true,
            title: true,
            startDate: true,
            status: true,
            currentAttendees: true,
            maxAttendees: true,
          },
          orderBy: { createdAt: 'desc' },
          take: 10,
        },
        _count: {
          select: {
            createdEvents: true,
          },
        },
      },
    });

    if (!admin) {
      throw new NotFoundException('Admin not found');
    }

    return this.excludePassword(admin);
  }

  async findByEmail(email: string): Promise<IAdmin | null> {
    return await this.prisma.admin.findUnique({
      where: { email },
    });
  }

  async updateStatus(id: string, isActive: boolean): Promise<IAdmin> {
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

  async getDashboardStats(): Promise<IDashboardStats> {
    const [
      totalEvents,
      totalAttendees,
      totalRegistrations,
      totalRevenue,
      upcomingEvents,
      ongoingEvents,
      completedEvents,
      recentRegistrations,
    ] = await Promise.all([
      this.prisma.event.count(),
      this.prisma.attendee.count(),
      this.prisma.registration.count(),
      this.prisma.payment.aggregate({
        where: { status: PaymentStatus.SUCCESS },
        _sum: { amount: true },
      }),
      this.prisma.event.count({
        where: {
          status: EventStatus.PUBLISHED,
          startDate: { gt: new Date() },
        },
      }),
      this.prisma.event.count({
        where: { status: EventStatus.ONGOING },
      }),
      this.prisma.event.count({
        where: { status: EventStatus.COMPLETED },
      }),
      this.prisma.registration.findMany({
        take: 10,
        orderBy: { createdAt: 'desc' },
        include: {
          event: {
            select: { title: true },
          },
          attendee: {
            select: { fullName: true, email: true },
          },
        },
      }),
    ]);

    // Get event stats
    const eventStats = await this.prisma.event.findMany({
      select: {
        id: true,
        title: true,
        startDate: true,
        currentAttendees: true,
        maxAttendees: true,
        status: true,
        _count: {
          select: {
            registrations: true,
            payments: true,
          },
        },
      },
      orderBy: { startDate: 'desc' },
      take: 5,
    });

    return {
      totalEvents,
      totalAttendees,
      totalRegistrations,
      totalRevenue: Number(totalRevenue._sum.amount) || 0,
      upcomingEvents,
      ongoingEvents,
      completedEvents,
      recentRegistrations,
      eventStats,
    };
  }

  async getEventAnalytics(eventId: string) {
    const event = await this.prisma.event.findUnique({
      where: { id: eventId },
      include: {
        registrations: {
          include: {
            attendee: true,
            payment: true,
            ticket: true,
          },
        },
        _count: {
          select: {
            registrations: true,
            payments: true,
            tickets: true,
          },
        },
      },
    });

    if (!event) {
      throw new NotFoundException('Event not found');
    }
    const analytics = {
      event: {
        id: event.id,
        title: event.title,
        startDate: event.startDate,
        endDate: event.endDate,
        maxAttendees: event.maxAttendees,
        currentAttendees: event.currentAttendees,
        status: event.status,
      },
      registrations: {
        total: event._count.registrations,
        confirmed: event.registrations.filter((r) => r.status === 'CONFIRMED')
          .length,
        pending: event.registrations.filter((r) => r.status === 'PENDING')
          .length,
        cancelled: event.registrations.filter((r) => r.status === 'CANCELLED')
          .length,
        checkedIn: event.registrations.filter((r) => r.isCheckedIn).length,
      },
      payments: {
        total: event._count.payments,
        successful: event.registrations.filter(
          (r) => r.payment?.status === 'SUCCESS',
        ).length,
        pending: event.registrations.filter(
          (r) => r.payment?.status === 'PENDING',
        ).length,
        failed: event.registrations.filter(
          (r) => r.payment?.status === 'FAILED',
        ).length,
      },
      revenue: event.registrations
        .filter((r) => r.payment?.status === 'SUCCESS')
        .reduce((sum, r) => sum + (Number(r.payment?.amount) || 0), 0),
      attendeeBreakdown: {
        byCompany: this.groupBy(
          event.registrations.map((r) => r.attendee),
          'company',
        ),
        byJobTitle: this.groupBy(
          event.registrations.map((r) => r.attendee),
          'jobTitle',
        ),
      },
    };

    return analytics;
  }

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
