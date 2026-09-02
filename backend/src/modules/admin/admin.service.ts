import {
  Injectable,
  ConflictException,
  UnauthorizedException,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
  Inject,
  Logger,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService, ConfigType } from '@nestjs/config';
import { PrismaService } from 'src/prisma/prisma.service';
import { hashSync, genSaltSync, compareSync } from 'bcrypt';
import * as nodeCrypto from 'crypto';
import { LoginAdminDto } from './dto/login-admin.dto';
import { InviteAdminDto } from './dto/invite-admin.dto';
import { AdminQueryDto } from './dto/admin-query.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import {
  IJwtPayload,
  IAdminResponse,
  IUpdateProfileResponse,
} from './interfaces/admin.interface';
import { MailService } from '../mail/mail.service';
import { AdminCreateAttendeeDto } from './dto/create-attendee.dto';
import { PaymentsService } from '../payment/payment.service';
import JWTConfig from 'src/config/jwt.config';
import {
  type PERMISSION_ID,
  PERMISSIONS,
} from 'src/common/constants/permissions';

type AuthTokens = {
  accessToken: string;
  refreshToken: string;
};

const permissionsMap = new Map<PERMISSION_ID, (typeof PERMISSIONS)[number]>();
PERMISSIONS.forEach((p) => {
  permissionsMap.set(p.id, p);
});

@Injectable()
export class AdminService {
  private readonly logger = new Logger(AdminService.name);
  constructor(
    private readonly configService: ConfigService,
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly mailService: MailService,
    private readonly paymentsService: PaymentsService,
    @Inject(JWTConfig.KEY)
    private jwtConfig: ConfigType<typeof JWTConfig>,
  ) {}

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
      roleId: admin.roleId,
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

      if (!admin || !admin.isActive || !admin.role) {
        throw new UnauthorizedException('Invalid refresh token');
      }

      return this.generateAuthTokens({
        sub: admin.id,
        roleId: admin.roleId,
      });
    } catch (error) {
      this.logger.error(error);
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
      throw new NotFoundException(
        'No admin account is associated with this email address.',
      );
    }

    const rawToken = nodeCrypto.randomBytes(32).toString('hex');
    const hashedToken = nodeCrypto
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

    const passwordResetUrl = this.configService.get<string>(
      'app.passwordResetUrl',
    );
    const resetLink = `${passwordResetUrl}?token=${rawToken}`;

    await this.mailService.sendPasswordResetEmail(
      admin.email,
      admin.fullName,
      resetLink,
    );

    return { message: 'Password reset link has been sent to your email.' };
  }

  async resetPassword(
    resetPasswordDto: ResetPasswordDto,
  ): Promise<{ message: string }> {
    const { token, newPassword } = resetPasswordDto;

    const hashedToken = nodeCrypto
      .createHash('sha256')
      .update(token)
      .digest('hex');

    const resetTokenRecord = await this.prisma.passwordResetToken.findUnique({
      where: { token: hashedToken },
      include: { admin: true },
    });

    if (!resetTokenRecord) {
      throw new BadRequestException('Invalid or expired password reset token');
    }

    if (resetTokenRecord.usedAt) {
      throw new BadRequestException(
        'This reset link has already been used. Please request a new one.',
      );
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

    // Atomically update the password and mark the token as used
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
      data: { password: hashedNewPassword },
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
      include: { role: true },
    });

    if (!admin) {
      throw new NotFoundException('Admin not found');
    }

    if (email && email.toLowerCase() !== admin.email) {
      const emailTaken = await this.prisma.admin.findUnique({
        where: { email: email.toLowerCase() },
      });
      if (emailTaken) {
        throw new ConflictException(
          'An account with that email already exists',
        );
      }
    }

    const updateData: Partial<{ fullName: string; email: string }> = {};
    if (fullName) updateData.fullName = fullName;
    if (email) updateData.email = email.toLowerCase();

    const updatedAdmin = await this.prisma.admin.update({
      where: { id: adminId },
      data: updateData,
      include: { role: true },
    });

    return {
      id: updatedAdmin.id,
      fullName: updatedAdmin.fullName,
      email: updatedAdmin.email,
      role: updatedAdmin.role?.name ?? '',
      isActive: updatedAdmin.isActive,
      updatedAt: updatedAdmin.updatedAt,
    };
  }

  async inviteAdmin(inviteDto: InviteAdminDto, invitedBy: string) {
    const { email, fullName, roleId } = inviteDto;

    const existingAdmin = await this.prisma.admin.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (existingAdmin) {
      throw new ConflictException('An admin with this email already exists');
    }

    const role = await this.prisma.role.findUnique({ where: { id: roleId } });
    if (!role) {
      throw new NotFoundException('Role not found');
    }

    const tempPassword = nodeCrypto.randomBytes(8).toString('hex');
    const salt = genSaltSync(10);
    const hashedPassword = hashSync(tempPassword, salt);

    const newAdmin = await this.prisma.$transaction(async (tx) => {
      const admin = await tx.admin.create({
        data: {
          email: email.toLowerCase(),
          fullName,
          password: hashedPassword,
          roleId,
          invitedById: invitedBy,
        },
      });

      await tx.auditLog.create({
        data: {
          adminId: invitedBy,
          action: 'INVITE_ADMIN',
          metadata: {
            invitedEmail: email,
            invitedRoleId: roleId,
          },
        },
      });

      return admin;
    });

    await this.mailService.sendInviteEmail(email, fullName);

    return {
      message:
        'Admin invitation sent. Please use the password reset process to create your password.',
      adminId: newAdmin.id,
    };
  }

  async deactivateAdmin(
    adminId: string,
    deactivatedBy: string,
  ): Promise<{ message: string }> {
    if (adminId === deactivatedBy) {
      throw new ForbiddenException('You cannot deactivate your own account');
    }

    const target = await this.prisma.admin.findUnique({
      where: { id: adminId },
    });

    if (!target) {
      throw new NotFoundException('Admin not found');
    }

    if (!target.isActive) {
      throw new BadRequestException('Admin account is already deactivated');
    }

    await this.prisma.$transaction(async (tx) => {
      await tx.admin.update({
        where: { id: adminId },
        data: { isActive: false },
      });

      await tx.auditLog.create({
        data: {
          adminId: deactivatedBy,
          action: 'DEACTIVATE_ADMIN',
          metadata: { targetAdminId: adminId },
        },
      });
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
      where.role = { name: { equals: role, mode: 'insensitive' } };
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
          role: {
            select: {
              id: true,
              name: true,
            },
          },
          isActive: true,
          invitedBy: {
            select: {
              id: true,
              fullName: true,
            },
          },
          createdAt: true,
          updatedAt: true,
        },
      }),
      this.prisma.admin.count({ where }),
    ]);

    return {
      data: admins.map((admin) => ({
        ...admin,
        invitedBy: admin.invitedBy
          ? { id: admin.invitedBy.id, name: admin.invitedBy.fullName }
          : null,
      })),
      meta: {
        total,
        page,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: string): Promise<IAdminResponse> {
    const admin = await this.prisma.admin.findUnique({
      where: { id },
      select: {
        id: true,
        fullName: true,
        email: true,
        role: {
          select: {
            id: true,
            name: true,
          },
        },
        isActive: true,
        invitedBy: {
          select: {
            id: true,
            fullName: true,
          },
        },
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!admin) {
      throw new NotFoundException('Admin not found');
    }

    return {
      ...admin,
      invitedBy: admin.invitedBy
        ? { id: admin.invitedBy.id, name: admin.invitedBy.fullName }
        : null,
    };
  }

  async findByEmail(email: string) {
    return await this.prisma.admin.findUnique({
      where: { email: email.toLowerCase() },
      include: { role: true },
    });
  }

  private generateAuthTokens(payload: IJwtPayload): AuthTokens {
    const accessToken = this.jwtService.sign(payload, {
      expiresIn: this.jwtConfig.expiresIn,
      secret: this.jwtConfig.accessSecret,
      algorithm: 'HS256',
    });

    const refreshToken = this.jwtService.sign(payload, {
      secret: this.jwtConfig.refreshSecret,
      expiresIn: this.jwtConfig.refreshExpiresIn,
      algorithm: 'HS256',
    });

    return { accessToken, refreshToken };
  }
}
