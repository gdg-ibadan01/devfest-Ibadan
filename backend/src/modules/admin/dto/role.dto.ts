import { ApiProperty, ApiResponseProperty } from '@nestjs/swagger';
import {
  ArrayUnique,
  IsArray,
  IsBoolean,
  IsIn,
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
  permissions: string[];
  isActive: boolean;
}

export class CreateRoleDto {
  @IsString()
  @ApiProperty({
    description: 'Name of the role',
    example: 'Volunteer',
  })
  name: string;

  @IsString()
  @ApiProperty({
    description: 'Description of the role',
  })
  description: string;

  @IsArray()
  @ArrayUnique()
  @IsIn(PERMISSIONS.map((p) => p.id), { each: true })
  @ApiProperty({
    description: 'Permissions for this role',
    enum: PERMISSIONS.map((p) => p.id),
  })
  permissions: string[];

  @IsBoolean()
  @ApiProperty()
  isActive: boolean;
}

export class ListPermissionsResponse {
  @ApiProperty({ type: [PermissionDto] })
  permissions: PermissionDto[];
}
