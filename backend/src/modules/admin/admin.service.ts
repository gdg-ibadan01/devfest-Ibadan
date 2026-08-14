import {
  Injectable,
  ConflictException,
  UnauthorizedException,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from 'src/prisma/prisma.service';
import { hashSync, genSaltSync, compareSync } from 'bcrypt';
import * as crypto from 'crypto';
import { CreateAdminDto } from './dto/create-admin.dto';
import { LoginAdminDto } from './dto/login-admin.dto';
import { InviteAdminDto } from './dto/invite-admin.dto';
import { AdminQueryDto } from './dto/admin-query.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import {
  IAdmin,
  ILoginResponse,
  IJwtPayload,
  IAdminResponse,
  IDashboardStats,
  IUpdateProfileResponse,
} from './interfaces/admin.interface';
import { MailService } from '../mail/mail.service';
import { AdminCreateAttendeeDto } from './dto/create-attendee.dto';
import { PaymentsService } from '../payment/payment.service';

@Injectable()
export class AdminService {
  constructor(
    private readonly configService: ConfigService,
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly mailService: MailService,
    private readonly paymentsService: PaymentsService,
  ) {}

  async signup(signupDto: CreateAdminDto): Promise<ILoginResponse> {
    const { fullName, email, password } = signupDto;

    const existingAdmin = await this.prisma.admin.findUnique({
      where: { email },
    });

    if (existingAdmin) {
      throw new ConflictException('Admin with this email already exists');
    }

    const salt = genSaltSync(10);
    const hashedPassword = hashSync(password, salt);

    const admin = await this.prisma.admin.create({
      data: {
        fullName,
        email,
        password: hashedPassword,
        role: signupDto.role ?? 'ADMIN',
      },
    });

    const tokens = await this.generateTokens({
      sub: admin.id,
      email: admin.email,
      role: admin.role,
    });

    return {
      admin: this.excludePassword(admin),
      ...tokens,
    };
  }

  async login(loginDto: LoginAdminDto): Promise<ILoginResponse> {
    const { email, password } = loginDto;

    const admin = await this.prisma.admin.findUnique({
      where: { email },
    });

    if (!admin) {
      throw new UnauthorizedException('Invalid credentials');
    }

    if (!admin.isActive) {
      throw new UnauthorizedException(
        'Your account has been deactivated. Please contact a super admin.',
      );
    }

    const isPasswordValid = compareSync(password, admin.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const tokens = await this.generateTokens({
      sub: admin.id,
      email: admin.email,
      role: admin.role,
    });

    return {
      admin: this.excludePassword(admin),
      ...tokens,
    };
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
        role: admin.role,
      });
    } catch {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  async forgotPassword(
    forgotPasswordDto: ForgotPasswordDto,
  ): Promise<{ message: string }> {
    const { email } = forgotPasswordDto;

    const admin = await this.prisma.admin.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (!admin || !admin.isActive) {
      return {
        message:
          'If that email address is registered, you will receive a password reset link shortly.',
      };
    }

    const rawToken = crypto.randomBytes(32).toString('hex');
    const hashedToken = crypto
      .createHash('sha256')
      .update(rawToken)
      .digest('hex');

    const expiresAt = new Date(Date.now() + 60 * 60 * 1000);

    await this.prisma.passwordResetToken.deleteMany({
      where: { adminId: admin.id },
    });

    await this.prisma.passwordResetToken.create({
      data: {
        adminId: admin.id,
        token: hashedToken,
        expiresAt,
      },
    });

    const frontendUrl = this.configService.get<string>('app.frontendUrl');

    const resetLink = `${frontendUrl}/admin/reset-password?token=${rawToken}`;

    await this.mailService.sendPasswordResetEmail(
      admin.email,
      admin.fullName,
      resetLink,
    );

    return {
      message:
        'If that email address is registered, you will receive a password reset link shortly.',
    };
  }

  async resetPassword(
    resetPasswordDto: ResetPasswordDto,
  ): Promise<{ message: string }> {
    const { token, newPassword } = resetPasswordDto;

    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

    const resetTokenRecord = await this.prisma.passwordResetToken.findUnique({
      where: { token: hashedToken },
      include: { admin: true },
    });

    if (!resetTokenRecord) {
      throw new BadRequestException('Invalid or expired password reset token');
    }

    if (resetTokenRecord.usedAt) {
      throw new BadRequestException('Invalid password reset token.');
    }

    if (resetTokenRecord.expiresAt < new Date()) {
      await this.prisma.passwordResetToken.delete({
        where: { id: resetTokenRecord.id },
      });
      throw new BadRequestException(
        'Password reset token has expired. Please request a new one.',
      );
    }

    if (!resetTokenRecord.admin.isActive) {
      throw new UnauthorizedException(
        'Your account has been deactivated. Please contact a super admin.',
      );
    }

    const salt = genSaltSync(10);
    const hashedPassword = hashSync(newPassword, salt);

    await this.prisma.$transaction([
      this.prisma.admin.update({
        where: { id: resetTokenRecord.adminId },
        data: { password: hashedPassword },
      }),
      this.prisma.passwordResetToken.update({
        where: { id: resetTokenRecord.id },
        data: { usedAt: new Date() },
      }),
    ]);

    return {
      message: 'Password has been reset successfully. You can now log in.',
    };
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

    const isCurrentPasswordValid = compareSync(currentPassword, admin.password);
    if (!isCurrentPasswordValid) {
      throw new UnauthorizedException('Current password is incorrect');
    }

    const isSamePassword = compareSync(newPassword, admin.password);
    if (isSamePassword) {
      throw new BadRequestException(
        'New password must be different from the current password',
      );
    }

    const salt = genSaltSync(10);
    const hashedNewPassword = hashSync(newPassword, salt);

    await this.prisma.admin.update({
      where: { id: adminId },
      data: {
        password: hashedNewPassword,
        isActive: true,
      },
    });

    return { message: 'Password changed successfully' };
  }

  async updateProfile(
    adminId: string,
    updateProfileDto: UpdateProfileDto,
  ): Promise<IUpdateProfileResponse> {
    const { fullName, email } = updateProfileDto;

    const admin = await this.prisma.admin.findUnique({
      where: { id: adminId },
    });

    if (!admin) {
      throw new NotFoundException('Admin not found');
    }

    if (email && email !== admin.email) {
      const emailTaken = await this.prisma.admin.findUnique({
        where: { email },
      });
      if (emailTaken) {
        throw new ConflictException(
          'An account with that email already exists',
        );
      }
    }

    const updateData: Partial<{ fullName: string; email: string }> = {};
    if (fullName) updateData.fullName = fullName;
    if (email) updateData.email = email;

    const updatedAdmin = await this.prisma.admin.update({
      where: { id: adminId },
      data: updateData,
    });

    return this.excludePassword(updatedAdmin);
  }

  async inviteAdmin(inviteDto: InviteAdminDto, invitedBy: string) {}

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

    if (!deactivator || deactivator.role !== 'SUPER_ADMIN') {
      throw new ForbiddenException('Only SUPER_ADMIN can deactivate admins');
    }

    if (adminId === deactivatedBy) {
      throw new ForbiddenException('Cannot deactivate yourself');
    }

    const target = await this.prisma.admin.findUnique({
      where: { id: adminId },
    });
    if (!target) {
      throw new NotFoundException('Admin not found');
    }

    await this.prisma.admin.update({
      where: { id: adminId },
      data: { isActive: false },
    });

    return { message: 'Admin deactivated successfully' };
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
        select: {
          id: true,
          fullName: true,
          email: true,
          role: true,
          isActive: true,
          invitedById: true,
          createdAt: true,
          updatedAt: true,
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

  private async generateTokens(
    payload: IJwtPayload,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const accessToken = await this.jwtService.sign(payload);

    const refreshSecret =
      await this.configService.get<string>('jwt.refreshSecret');
    const refreshExpiresIn =
      this.configService.get<string>('jwt.refreshExpiresIn') ?? '7d';

    if (!refreshSecret) {
      throw new Error('JWT refresh secret is not configured');
    }

    const refreshToken = await this.jwtService.sign(payload, {
      secret: refreshSecret,
      expiresIn: refreshExpiresIn as `${number}`,
    });

    return { accessToken, refreshToken };
  }

  private excludePassword(admin: any) {
    const { password, ...adminWithoutPassword } = admin;
    return adminWithoutPassword;
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
