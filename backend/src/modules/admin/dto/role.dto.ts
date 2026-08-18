import { ApiProperty, ApiResponseProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  ArrayUnique,
  IsArray,
  IsBoolean,
  IsIn,
  IsNotEmpty,
  IsString,
} from 'class-validator';
import { PERMISSION_ID, PERMISSIONS } from 'src/common/constants/permissions';

class PermissionDto {
  @ApiResponseProperty({
    enum: PERMISSIONS.map((p) => p.id),
  })
  id: PERMISSION_ID;
  @ApiResponseProperty({
    enum: PERMISSIONS.map((p) => p.label),
  })
  label: string;
}

export interface IRole {
  id: string;
  name: string;
  description: string;
  permissions: PERMISSION_ID[];
  isActive: boolean;
}

export class CreateRoleDto {
  @IsString()
  @Transform(({ value }) => value === 'true' || value === true)
  @ApiProperty({
    description: 'Name of the role',
    example: 'VOLUNTEER',
  })
  name!: string;

  @IsString()
  @IsNotEmpty()
  @Transform(({ value }) => value?.trim())
  @ApiProperty({
    description: 'Description of the role',
  })
  description!: string;

  @IsArray()
  @ArrayUnique()
  @IsIn(PERMISSIONS.map((p) => p.id), { each: true })
  @ApiProperty({
    description: 'Permissions for this role',
    enum: PERMISSIONS.map((p) => p.id),
    isArray: true,
  })
  permissions!: string[];

  @IsBoolean()
  @ApiProperty()
  isActive!: boolean;
}

export class CreateRoleResponseDto {
  @ApiResponseProperty()
  id!: string;

  @ApiResponseProperty()
  name!: string;

  @ApiResponseProperty()
  description!: string;

  @ApiResponseProperty()
  isActive!: boolean;

  @ApiResponseProperty({ type: [PermissionDto] })
  permissions!: PermissionDto[];

  @ApiResponseProperty()
  createdAt!: Date;
}

class ListRolesItemResponseDto {
  @ApiResponseProperty()
  id!: string;

  @ApiResponseProperty()
  name!: string;

  @ApiResponseProperty({ type: [PermissionDto] })
  permissions!: PermissionDto[];

  @ApiResponseProperty()
  isActive!: boolean;

  @ApiResponseProperty()
  createdAt!: Date;
}

export class ListRolesResponseDto {
  @ApiResponseProperty({
    type: [ListRolesItemResponseDto],
  })
  roles: ListRolesItemResponseDto[];
}

export class ListPermissionsResponse {
  @ApiProperty({ type: [PermissionDto] })
  permissions: PermissionDto[];
}

// ─── Admin Response DTOs ──────────────────────────────────────────────────────

/**
 * Represents the role object returned on admin responses.
 * Exposes both the role name AND its permission list so consumers
 * can clearly see that roles are permission-based.
 */
export class AdminRoleDto {
  @ApiProperty({
    description: 'Human-readable role name',
    example: 'VOLUNTEER',
  })
  name!: string;

  @ApiProperty({
    description:
      'List of permission IDs granted to this role. ' +
      'These permissions control which actions the admin is authorised to perform.',
    enum: PERMISSIONS.map((p) => p.id),
    isArray: true,
    example: ['tickets.create', 'attendees.list'],
  })
  permissions!: PERMISSION_ID[];
}

/** Single admin item returned inside the findAll list. */
export class FindAllAdminsItemDto {
  @ApiProperty({ description: 'Admin unique identifier' })
  id!: string;

  @ApiProperty({ description: 'Admin full name' })
  fullName!: string;

  @ApiProperty({ description: 'Admin email address' })
  email!: string;

  @ApiProperty({
    type: AdminRoleDto,
    description: 'Role assigned to this admin, including its permission set.',
  })
  role!: AdminRoleDto;

  @ApiProperty({ description: 'Whether the admin account is active' })
  isActive!: boolean;

  @ApiProperty({
    description: 'ID of the admin who invited this user',
    nullable: true,
  })
  invitedById!: string | null;

  @ApiProperty()
  createdAt!: Date;

  @ApiProperty()
  updatedAt!: Date;
}

/** Pagination metadata returned alongside the admin list. */
export class FindAllAdminsMetaDto {
  @ApiProperty({ description: 'Total number of matching admins' })
  total!: number;

  @ApiProperty({ description: 'Current page number' })
  page!: number;

  @ApiProperty({ description: 'Number of records per page' })
  limit!: number;

  @ApiProperty({ description: 'Total number of pages' })
  totalPages!: number;
}

/** Full paginated response shape for GET /admin. */
export class FindAllAdminsResponseDto {
  @ApiProperty({ type: [FindAllAdminsItemDto] })
  data!: FindAllAdminsItemDto[];

  @ApiProperty({ type: FindAllAdminsMetaDto })
  meta!: FindAllAdminsMetaDto;
}

/** Response shape for GET /admin/:id and GET /admin/profile. */
export class FindOneAdminResponseDto {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  fullName!: string;

  @ApiProperty()
  email!: string;

  @ApiProperty({
    type: AdminRoleDto,
    description: 'Role assigned to this admin, including its permission set.',
  })
  role!: AdminRoleDto;

  @ApiProperty()
  isActive!: boolean;

  @ApiProperty()
  createdAt!: Date;

  @ApiProperty()
  updatedAt!: Date;
}
