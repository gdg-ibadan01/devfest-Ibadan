import { Injectable, Logger } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { ServiceError } from '../../../common/errors/service-error';
import { AuditLogQueryDto } from './dto/audit-log-query.dto';
import {
  AuditLogDetailResponseDto,
  AuditLogResponseDto,
  PaginatedAuditLogResponseDto,
} from './dto/audit-log-response.dto';

const AUDIT_LOG_SELECT = {
  id: true,
  action: true,
  createdAt: true,
  admin: { select: { id: true, fullName: true, email: true } },
  role: { select: { id: true, name: true } },
} satisfies Prisma.AuditLogSelect;

export interface CreateAuditLogInput {
  adminId: string;
  action: string;
  roleId?: string;
  metadata?: Record<string, any>;
}

@Injectable()
export class AuditLogService {
  static ERRORS = {
    NotFoundErr: 'NotFoundErr',
  } as Record<string, `${string}Err`>;

  private readonly logger = new Logger(AuditLogService.name);

  constructor(private readonly prisma: PrismaService) {}

  async findAll(
    query: AuditLogQueryDto,
  ): Promise<PaginatedAuditLogResponseDto> {
    const page = query.page ?? 1;
    const limit = query.limit ?? 10;
    const from = query.from || query.startDate;
    const to = query.to || query.endDate;

    const where: Prisma.AuditLogWhereInput = {
      ...(query.adminId ? { adminId: query.adminId } : {}),
      ...(query.roleId ? { roleId: query.roleId } : {}),
      ...(query.action
        ? { action: { contains: query.action.trim(), mode: 'insensitive' } }
        : {}),
      createdAt:
        query.from || query.to
          ? {
              ...(query.from ? { gte: new Date(query.from) } : {}),
              ...(query.to ? { lte: new Date(query.to) } : {}),
            }
          : undefined,
      ...(query.search
        ? {
            OR: [
              {
                action: { contains: query.search.trim(), mode: 'insensitive' },
              },
              {
                admin: {
                  fullName: {
                    contains: query.search.trim(),
                    mode: 'insensitive',
                  },
                },
              },
              {
                admin: {
                  email: { contains: query.search.trim(), mode: 'insensitive' },
                },
              },
            ],
          }
        : {}),
    };

    const [total, rows] = await Promise.all([
      this.prisma.auditLog.count({ where }),
      this.prisma.auditLog.findMany({
        where,
        select: AUDIT_LOG_SELECT,
        orderBy: { createdAt: query.sortOrder ?? 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
    ]);

    const totalPages = Math.max(1, Math.ceil(total / limit));

    return {
      data: rows.map((row) => this.toResponseDto(row)),
      meta: {
        total,
        page,
        limit,
        totalPages,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
      },
    };
  }

  async findOne(id: string): Promise<AuditLogDetailResponseDto> {
    const row = await this.prisma.auditLog.findUnique({
      where: { id },
      select: { ...AUDIT_LOG_SELECT, metadata: true },
    });

    if (!row) {
      throw new ServiceError(
        'Audit log not found',
        AuditLogService.ERRORS.NotFoundErr,
      );
    }

    return {
      ...this.toResponseDto(row),
      metadata: (row.metadata as Record<string, unknown> | null) ?? null,
    };
  }

  /** Distinct action names in use, for populating a filter dropdown. */
  async findDistinctActions(): Promise<string[]> {
    const rows = await this.prisma.auditLog.findMany({
      distinct: ['action'],
      select: { action: true },
      orderBy: { action: 'asc' },
    });
    return rows.map((row) => row.action);
  }

  private toResponseDto(row: {
    id: string;
    action: string;
    createdAt: Date;
    admin: { id: string; fullName: string; email: string };
    role: { id: string; name: string } | null;
  }): AuditLogResponseDto {
    return {
      id: row.id,
      action: row.action,
      admin: row.admin,
      role: row.role,
      createdAt: row.createdAt,
    };
  }
}
