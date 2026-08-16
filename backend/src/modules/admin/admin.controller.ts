import {
  Controller,
  Post,
  Get,
  Body,
  UseGuards,
  Patch,
  Param,
  Req,
  UnauthorizedException,
  Query,
  Delete,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { Request } from 'express';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiOkResponse,
} from '@nestjs/swagger';
import { Roles } from '../../common/decorators/roles.decorator';
import { Role } from '../../common/enums/role.enum';
import { AdminService } from './admin.service';
import { CreateAdminDto } from './dto/create-admin.dto';
import { LoginAdminDto } from './dto/login-admin.dto';
import { AdminQueryDto } from './dto/admin-query.dto';
import { InviteAdminDto } from './dto/invite-admin.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { UpdateAdminStatusDto } from './dto/update-status.dto';
import { AdminCreateAttendeeDto } from './dto/create-attendee.dto';
import { RolesGuard } from './guards/roles.guard';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import {
  IAdminResponse,
  IUpdateProfileResponse,
} from './interfaces/admin.interface';
import { LoginResponseDto } from './dto/login-response.dto';

@ApiTags('Admin')
@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  // @Post('signup')
  // @ApiOperation({ summary: 'Register a super admin account' })
  // @ApiResponse({
  //   status: 201,
  //   description: 'Super admin created successfully.',
  // })
  // @ApiResponse({
  //   status: 409,
  //   description: 'Email already exists.',
  // })
  // async signup(@Body() signupDto: CreateAdminDto) {
  //   return this.adminService.signup(signupDto);
  // }

  @Post('login')
  @ApiOperation({ summary: 'Login as an admin' })
  @ApiResponse({ status: 401, description: 'Invalid credentials.' })
  @ApiOkResponse({
    description: 'Login successful',
    type: LoginResponseDto,
  })
  @HttpCode(HttpStatus.OK)
  async login(@Body() payload: LoginAdminDto) {
    return this.adminService.login(payload);
  }

  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Refresh JWT tokens using a valid refresh token' })
  @ApiResponse({ status: 200, description: 'Tokens refreshed successfully.' })
  @ApiResponse({
    status: 401,
    description: 'Invalid or expired refresh token.',
  })
  async refreshToken(
    @Body() refreshDto: RefreshTokenDto,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    return this.adminService.refreshToken(refreshDto.refreshToken);
  }

  @Post('forgot-password')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Request a password reset email',
    description:
      'Sends a time-limited password reset link to the provided email address if it belongs to a registered admin. Always returns a generic success message to prevent email enumeration.',
  })
  @ApiResponse({
    status: 200,
    description:
      'Reset email dispatched (or silently ignored if email not found).',
    schema: {
      example: {
        message:
          'If that email address is registered, you will receive a password reset link shortly.',
      },
    },
  })
  async forgotPassword(
    @Body() forgotPasswordDto: ForgotPasswordDto,
  ): Promise<{ message: string }> {
    return this.adminService.forgotPassword(forgotPasswordDto);
  }

  @Post('reset-password')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Reset admin password using a token from the reset email',
  })
  @ApiResponse({
    status: 200,
    description: 'Password reset successfully.',
    schema: {
      example: {
        message: 'Password has been reset successfully. You can now log in.',
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Token is invalid, expired, or already used.',
  })
  async resetPassword(
    @Body() resetPasswordDto: ResetPasswordDto,
  ): Promise<{ message: string }> {
    return this.adminService.resetPassword(resetPasswordDto);
  }

  @Get('profile')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.SUPER_ADMIN)
  @ApiOperation({ summary: 'Get the authenticated admin profile' })
  @ApiResponse({ status: 200, description: 'Profile retrieved successfully.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  async getProfile(@Req() req: Request): Promise<IAdminResponse> {
    const adminId = req.user?.id ?? req.user?.sub;
    if (!adminId) {
      throw new UnauthorizedException(
        'Invalid token payload: no user ID found.',
      );
    }
    return this.adminService.findOne(adminId);
  }

  @Patch('profile')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.SUPER_ADMIN)
  @ApiOperation({
    summary: 'Update authenticated admin profile',
    description:
      'Updates fullName and/or email. At least one field is required.',
  })
  @ApiResponse({ status: 200, description: 'Profile updated successfully.' })
  @ApiResponse({ status: 400, description: 'No fields provided.' })
  @ApiResponse({ status: 409, description: 'Email already in use.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  async updateProfile(
    @Body() updateProfileDto: UpdateProfileDto,
    @Req() req: Request,
  ): Promise<IUpdateProfileResponse> {
    const adminId = req.user?.id ?? req.user?.sub;
    if (!adminId) {
      throw new UnauthorizedException(
        'Invalid token payload: no user ID found.',
      );
    }
    return this.adminService.updateProfile(adminId, updateProfileDto);
  }

  @Patch('change-password')
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.SUPER_ADMIN)
  @ApiOperation({
    summary: 'Change password for the authenticated admin',
    description:
      'Requires the current password for verification before setting the new one.',
  })
  @ApiResponse({ status: 200, description: 'Password changed successfully.' })
  @ApiResponse({ status: 401, description: 'Current password is incorrect.' })
  @ApiResponse({
    status: 400,
    description: 'New password must differ from the current one.',
  })
  async changePassword(
    @Body() changePasswordDto: ChangePasswordDto,
    @Req() req: Request,
  ): Promise<{ message: string }> {
    const adminId = req.user?.sub ?? req.user?.id;
    if (!adminId) {
      throw new UnauthorizedException('User ID not found in token');
    }
    return this.adminService.changePassword(adminId, changePasswordDto);
  }

  @Post('invite')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.SUPER_ADMIN)
  @ApiOperation({ summary: 'Invite another admin (Super Admin only)' })
  @ApiResponse({ status: 201, description: 'Admin invited successfully.' })
  @ApiResponse({
    status: 403,
    description: 'Only SUPER_ADMIN can invite other admins.',
  })
  async inviteAdmin(@Body() inviteDto: InviteAdminDto, @Req() req: Request) {
    const inviterId = req.user?.id ?? req.user?.sub;
    return this.adminService.inviteAdmin(inviteDto, inviterId);
  }

  @Get()
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.SUPER_ADMIN)
  @ApiOperation({ summary: 'Get all admins (Super Admin only)' })
  @ApiResponse({ status: 200, description: 'Admins retrieved successfully.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  async findAll(@Query() query: AdminQueryDto) {
    return this.adminService.findAll(query);
  }

  @Patch('status')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.SUPER_ADMIN)
  @ApiOperation({
    summary: 'Update an admin account status (Super Admin only)',
  })
  @ApiResponse({
    status: 200,
    description: 'Admin status updated successfully.',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  async updateStatus(@Body() dto: UpdateAdminStatusDto) {
    return this.adminService.updateStatus(dto.adminId, dto.isActive);
  }

  @Delete(':id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.SUPER_ADMIN)
  @ApiOperation({ summary: 'Delete an admin account (Super Admin only)' })
  @ApiResponse({ status: 200, description: 'Admin deleted successfully.' })
  @ApiResponse({ status: 404, description: 'Admin not found.' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  async remove(@Param('id') adminId: string): Promise<{ message: string }> {
    await this.adminService.remove(adminId);
    return { message: 'Admin deleted successfully' };
  }
}
