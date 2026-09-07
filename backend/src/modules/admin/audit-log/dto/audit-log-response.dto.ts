import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { PaginationMetaDto } from 'src/common/dto/pagination-meta.dto';

export class AuditLogRoleDto {
  @ApiProperty({ example: '01912f2c-5678-7000-8000-000000000001' })
  id: string;

  @ApiProperty({ example: 'SUPERADMIN' })
  name: string;
}

export class AuditLogAdminDto {
  @ApiProperty({ example: '01912f2c-1234-7000-8000-000000000001' })
  id: string;

  @ApiProperty({ example: 'Mary Esivue' })
  fullName: string;

  @ApiProperty({ example: 'mary@devfestibadan.com' })
  email: string;

  @ApiPropertyOptional({ type: AuditLogRoleDto, nullable: true })
  role?: AuditLogRoleDto | null;
}

export class AuditLogResponseDto {
  @ApiProperty({ example: '01912f2c-abcd-7000-8000-000000000001' })
  id: string;

  @ApiProperty({ example: 'INVITE_ADMIN' })
  action: string;

  @ApiProperty({ type: AuditLogAdminDto })
  admin: AuditLogAdminDto;

  @ApiPropertyOptional({ type: AuditLogRoleDto, nullable: true })
  role?: AuditLogRoleDto | null;

  @ApiProperty({ example: '2025-03-15T10:24:28.000Z' })
  createdAt: Date;
}

export class AuditLogItemDto extends AuditLogResponseDto {
  @ApiProperty({ example: '01912f2c-1234-7000-8000-000000000001' })
  adminId: string;

  @ApiPropertyOptional({
    type: String,
    nullable: true,
    example: '01912f2c-5678-7000-8000-000000000001',
  })
  roleId: string | null;

  @ApiPropertyOptional({
    type: 'object',
    nullable: true,
    additionalProperties: true,
    example: { invitedEmail: 'newadmin@example.com' },
  })
  metadata?: Record<string, any> | null;
}

export class AuditLogMetaDto extends PaginationMetaDto {}

export class PaginatedAuditLogResponseDto {
  @ApiProperty({ type: [AuditLogResponseDto] })
  data: AuditLogResponseDto[];

  @ApiProperty({ type: PaginationMetaDto })
  meta: PaginationMetaDto;
}

export class AuditLogListResponseDto {
  @ApiProperty({ example: true })
  success: boolean;

  @ApiProperty({ example: 'Audit logs retrieved successfully' })
  message: string;

  @ApiProperty({ type: [AuditLogItemDto] })
  data: AuditLogItemDto[];

  @ApiProperty({ type: PaginationMetaDto })
  meta: PaginationMetaDto;
}

export class AuditLogDetailResponseDto {
  @ApiProperty({ example: '01912f2c-abcd-7000-8000-000000000001' })
  id: string;

  @ApiProperty({ example: 'INVITE_ADMIN' })
  action: string;

  @ApiProperty({ type: AuditLogAdminDto })
  admin: AuditLogAdminDto;

  @ApiPropertyOptional({ type: AuditLogRoleDto, nullable: true })
  role?: AuditLogRoleDto | null;

  @ApiProperty({ example: '2025-03-15T10:24:28.000Z' })
  createdAt: Date;

  @ApiPropertyOptional({
    type: 'object',
    nullable: true,
    additionalProperties: true,
    example: { invitedEmail: 'newadmin@example.com' },
  })
  metadata?: Record<string, unknown> | null;
}
