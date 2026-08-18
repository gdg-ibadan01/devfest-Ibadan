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
  BadRequestException,
  InternalServerErrorException,
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
import { PermissionsGuard } from './guards/permissions.guard';
import { RequirePermission } from 'src/common/decorators/permissions.decorator';
import {
  IAdminResponse,
  IUpdateProfileResponse,
} from './interfaces/admin.interface';
import { LoginResponseDto } from './dto/login-response.dto';
import {
  FindAllAdminsResponseDto,
  FindOneAdminResponseDto,
} from './dto/role.dto';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { IJwtPayload } from './interfaces/admin.interface';
import { AdminActionResponseDto } from './dto/admin-response.dto';

@ApiTags('Admin')
@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

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
  @ApiOperation({
    summary: 'Request a password reset email',
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid credentials.',
  })
  @ApiOkResponse({
    description:
      'Password reset link has been sent to the provided email address.',
    type: ForgotPasswordDto,
  })
  @HttpCode(HttpStatus.OK)
  async forgotPassword(
    @Body() forgotPasswordDto: ForgotPasswordDto,
  ): Promise<{ message: string }> {
    return this.adminService.forgotPassword(forgotPasswordDto);
  }

  @Post('reset-password')
  @ApiOperation({
    summary: 'Reset admin password',
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid token.',
  })
  @ApiOkResponse({
    description: 'Password reset successfully.',
    type: ResetPasswordDto,
  })
  @HttpCode(HttpStatus.OK)
  async resetPassword(
    @Body() resetPasswordDto: ResetPasswordDto,
  ): Promise<{ message: string }> {
    return this.adminService.resetPassword(resetPasswordDto);
  }

  // @Get('findOne')
  // @ApiBearerAuth()
  // @RequirePermission('admins.profile')
  // @UseGuards(JwtAuthGuard, PermissionsGuard)
  // @ApiOperation({ summary: 'Get the authenticated admin profile' })
  // @ApiOkResponse({
  //   description: 'Profile retrieved successfully.',
  //   type: FindOneAdminResponseDto,
  // })
  // @ApiResponse({ status: 401, description: 'Unauthorized.' })
  // @HttpCode(HttpStatus.OK)
  // async getProfile(@CurrentUser() user: IJwtPayload): Promise<IAdminResponse> {
  //   return this.adminService.findOne(user.sub);
  // }

  @Patch('profile')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequirePermission('admins.update')
  @ApiOperation({
    summary: 'Update authenticated admin profile',
  })
  @ApiOkResponse({
    description: 'Profile updated successfully.',
    type: UpdateProfileDto,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @HttpCode(HttpStatus.OK)
  async updateProfile(
    @Body() updateProfileDto: UpdateProfileDto,
    @CurrentUser() user: IJwtPayload,
  ): Promise<IUpdateProfileResponse> {
    return this.adminService.updateProfile(user.sub, updateProfileDto);
  }

  @Patch('change-password')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: 'Change password for the authenticated admin',
  })
  @ApiOkResponse({
    description: 'Password changed successfully.',
    type: ChangePasswordDto,
  })
  @ApiResponse({ status: 401, description: 'Current password is incorrect.' })
  @ApiResponse({
    status: 400,
    description: 'New password must differ from the current one.',
  })
  @HttpCode(HttpStatus.OK)
  async changePassword(
    @Body() changePasswordDto: ChangePasswordDto,
    @CurrentUser() user: IJwtPayload,
  ): Promise<{ message: string }> {
    return this.adminService.changePassword(user.sub, changePasswordDto);
  }

  @Post('invite')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequirePermission('admins.invite')
  @ApiOperation({ summary: 'Invite another admin (Super Admin only)' })
  @ApiOkResponse({
    description: 'Admin invited successfully',
    type: InviteAdminDto,
  })
  @ApiResponse({
    status: 403,
    description: 'Only SUPER_ADMIN can invite other admins.',
  })
  @HttpCode(HttpStatus.OK)
  async inviteAdmin(
    @Body() inviteDto: InviteAdminDto,
    @CurrentUser() user: IJwtPayload,
  ) {
    return this.adminService.inviteAdmin(inviteDto, user.sub);
  }

  // @Patch('deactivate/:id')
  // @ApiBearerAuth()
  // @UseGuards(JwtAuthGuard, PermissionsGuard)
  // @RequirePermission('admins.deactivate')
  // @ApiOperation({ summary: 'Deactivate an admin account (Super Admin only)' })
  // @ApiOkResponse({
  //   description: 'Admin deactivated successfully',
  //   type: AdminActionResponseDto,
  // })
  // @ApiResponse({
  //   status: 403,
  //   description: 'Only SUPER_ADMIN can deactivate other admins.',
  // })
  // @HttpCode(HttpStatus.OK)
  // async deactivateAdmin(
  //   @Param('id') adminId: string,
  //   @CurrentUser() user: IJwtPayload,
  // ) {
  //   return this.adminService.deactivateAdmin(adminId, user.sub);
  // }

  // @Get()
  // @ApiBearerAuth()
  // @RequirePermission('admins.list')
  // @UseGuards(JwtAuthGuard, PermissionsGuard)
  // @ApiOperation({
  //   summary: 'Get all admins',
  // })
  // @ApiOkResponse({
  //   description: 'Admins retrieved successfully.',
  //   type: FindAllAdminsResponseDto,
  // })
  // @ApiResponse({ status: 401, description: 'Unauthorized.' })
  // async findAll(@Query() query: AdminQueryDto) {
  //   return this.adminService.findAll(query);
  // }

  // @Patch('status')
  // @ApiBearerAuth()
  // @UseGuards(JwtAuthGuard, RolesGuard)
  // @Roles(Role.SUPER_ADMIN)
  // @ApiOperation({
  //   summary: 'Update an admin account status (Super Admin only)',
  // })
  // @ApiResponse({
  //   status: 200,
  //   description: 'Admin status updated successfully.',
  // })
  // @ApiResponse({ status: 401, description: 'Unauthorized.' })
  // async updateStatus(@Body() dto: UpdateAdminStatusDto) {
  //   return this.adminService.updateStatus(dto.adminId, dto.isActive);
  // }
}
