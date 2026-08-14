import { ApiProperty, ApiResponseProperty } from '@nestjs/swagger';
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
  @IsNotEmpty()
  @ApiProperty({
    description: 'Name of the role',
    example: 'VOLUNTEER',
  })
  name!: string;

  @IsString()
  @IsNotEmpty()
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
