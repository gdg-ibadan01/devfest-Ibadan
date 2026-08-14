import { ApiProperty, ApiResponseProperty } from '@nestjs/swagger';
import {
  ArrayUnique,
  IsArray,
  IsBoolean,
  IsIn,
  IsString,
} from 'class-validator';
import { PERMISSION_ID, PERMISSIONS } from 'src/common/constants/permissions';

export interface IRole {
  id: string;
  name: string;
  description: string;
  permissions: PERMISSION_ID[];
  isActive: boolean;
}

export class CreateRoleDto {
  @IsString()
  @ApiProperty({
    description: 'Name of the role',
    example: 'VOLUNTEER',
  })
  name!: string;

  @IsString()
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

  @ApiResponseProperty({ type: [String], enum: PERMISSIONS.map((p) => p.id) })
  permissions!: string[];

  @ApiResponseProperty()
  createdAt!: Date;
}
