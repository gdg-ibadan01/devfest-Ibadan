import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateDiscountDto } from './create-discount.dto';

@Injectable()
export class DiscountsService {
  static ERRORS = {
    ValidationErr: 'ValidationErr',
  } as const;

  private readonly logger = new Logger(DiscountsService.name);

  constructor(private readonly prisma: PrismaService) {}

  create(payload: CreateDiscountDto) {
    payload.validateForType();

    // TODO: Implement discount creation logic
    this.logger.log('Creating discount', {
      name: payload.name,
      type: payload.type,
    });

    return { message: 'Discount creation not yet implemented' };
  }
}
