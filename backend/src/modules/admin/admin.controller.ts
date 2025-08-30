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
} from '@nestjs/common';
import { Request } from 'express';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { Roles } from '../../common/decorators/roles.decorator';
import { Role } from '../../common/enums/role.enum';
import { AdminService } from './admin.service';
import { CreateAdminDto } from './dto/create-admin.dto';
import { LoginAdminDto } from './dto/login-admin.dto';
import { AdminQueryDto } from './dto/admin-query.dto';
import { InviteAdminDto } from './dto/invite-admin.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { UpdateAdminStatusDto } from './dto/update-status.dto';
import { RolesGuard } from './guards/roles.guard';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import {
  ILoginResponse,
  IAdminResponse,
  IDashboardStats,
} from './interfaces/admin.interface';

@ApiTags('Admin')
@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Post('signup')
  @ApiOperation({ summary: 'Register a super admin account' })
  @ApiResponse({
    status: 201,
    description: 'Super admin created successfully.',
  })
  @ApiResponse({
    status: 409,
    description: 'Email already exists.',
  })
  async signup(@Body() signupDto: CreateAdminDto): Promise<ILoginResponse> {
    return this.adminService.signup(signupDto);
  }

  @Post('login')
  @ApiOperation({ summary: 'Login as an admin' })
  @ApiResponse({ status: 200, description: 'Login successful.' })
  @ApiResponse({ status: 401, description: 'Invalid credentials.' })
  async login(@Body() loginDto: LoginAdminDto): Promise<ILoginResponse> {
    return this.adminService.login(loginDto);
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
  async inviteAdmin(
    @Body() inviteDto: InviteAdminDto,
    @Req() req: Request,
  ): Promise<{ message: string; tempPassword: string }> {
    const inviterId = req.user?.id ?? req.user?.sub;
    return this.adminService.inviteAdmin(inviteDto, inviterId);
  }

  @Post('refresh')
  @ApiOperation({ summary: 'Refresh JWT tokens' })
  @ApiResponse({ status: 200, description: 'Tokens refreshed successfully.' })
  @ApiResponse({ status: 401, description: 'Invalid refresh token.' })
  async refreshToken(
    @Body() refreshDto: RefreshTokenDto,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    return this.adminService.refreshToken(refreshDto.refreshToken);
  }

  @Get()
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.SUPER_ADMIN)
  @ApiOperation({ summary: 'Get all admins' })
  @ApiResponse({ status: 200, description: 'Admins retrieved successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  async findAll(@Query() query: AdminQueryDto) {
    return this.adminService.findAll(query);
  }

  @Get('dashboard/stats')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.SUPER_ADMIN)
  @ApiOperation({ summary: 'Get dashboard statistics' })
  @ApiResponse({
    status: 200,
    description: 'Dashboard stats retrieved successfully',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  async getDashboardStats(): Promise<IDashboardStats> {
    return this.adminService.getDashboardStats();
  }

  @Get('events/analytics/:eventId')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.SUPER_ADMIN)
  @ApiOperation({ summary: 'Get event analytics' })
  @ApiResponse({
    status: 200,
    description: 'Event analytics retrieved successfully',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  async getEventAnalytics(@Param('eventId') eventId: string) {
    return this.adminService.getEventAnalytics(eventId);
  }

  @Get('profile')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.SUPER_ADMIN)
  @ApiOperation({ summary: 'Get admin by ID' })
  @ApiResponse({ status: 200, description: 'Admin retrieved successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  async findOne(@Req() req: Request): Promise<IAdminResponse> {
    const adminId = req.user?.id ?? req.user?.sub;
    if (!adminId) {
      throw new UnauthorizedException(
        'Invalid token payload: no user ID found.',
      );
    }
    return this.adminService.findOne(adminId);
  }

  @Patch('status')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.SUPER_ADMIN)
  @ApiOperation({ summary: 'Update admin status' })
  @ApiResponse({
    status: 200,
    description: 'Admin status updated successfully',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  async updateStatus(@Body() dto: UpdateAdminStatusDto) {
    return this.adminService.updateStatus(dto.adminId, dto.isActive);
  }

  @Patch('change-password')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN, Role.SUPER_ADMIN)
  @ApiOperation({ summary: 'Change current admin password' })
  @ApiResponse({ status: 200, description: 'Password changed successfully.' })
  @ApiResponse({ status: 400, description: 'Invalid password format.' })
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

  @Patch('deactivate/:id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.SUPER_ADMIN)
  @ApiOperation({ summary: 'Deactivate an admin account (Super Admin only)' })
  @ApiResponse({ status: 200, description: 'Admin deactivated successfully.' })
  @ApiResponse({
    status: 403,
    description: 'Only SUPER_ADMIN can deactivate other admins.',
  })
  async deactivateAdmin(
    @Param('id') adminId: string,
    @Req() req: Request,
  ): Promise<{ message: string }> {
    const deactivator = req.user?.id ?? req.user?.sub;
    return this.adminService.deactivateAdmin(adminId, deactivator);
  }

  @Delete(':id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.SUPER_ADMIN)
  @ApiOperation({ summary: 'Delete an admin account (SUPER_ADMIN only)' })
  @ApiResponse({ status: 200, description: 'Admin deleted successfully.' })
  @ApiResponse({ status: 404, description: 'Admin not found.' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  async remove(@Param('id') adminId: string): Promise<{ message: string }> {
    await this.adminService.remove(adminId);
    return { message: 'Admin deleted successfully' };
  }
}
