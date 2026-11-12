import { ApiProperty } from '@nestjs/swagger';
import { IsIn } from 'class-validator';
import {
  PAYMENT_PROVIDER_NAMES,
  PaymentProviderName,
} from 'src/config/payment.config';

export class SetPaymentGatewayDto {
  @ApiProperty({ enum: PAYMENT_PROVIDER_NAMES, example: 'ALATPAY' })
  @IsIn(PAYMENT_PROVIDER_NAMES)
  provider: PaymentProviderName;
}

export class PaymentGatewayProviderDto {
  @ApiProperty({ enum: PAYMENT_PROVIDER_NAMES, example: 'ALATPAY' })
  name: PaymentProviderName;

  @ApiProperty({ example: 'ALATPay' })
  label: string;

  @ApiProperty({
    description: 'Whether its credentials are set on the server',
    example: true,
  })
  configured: boolean;
}

export class PaymentGatewayAdminDto {
  @ApiProperty({ example: '01a08cef-ea12-7479-8a52-552dac34f3a0' })
  id: string;

  @ApiProperty({ example: 'Super Admin' })
  fullName: string;
}

export class PaymentGatewayStatusDto {
  @ApiProperty({
    enum: PAYMENT_PROVIDER_NAMES,
    description: 'Gateway new orders use right now',
  })
  active: PaymentProviderName;

  @ApiProperty({
    enum: PAYMENT_PROVIDER_NAMES,
    description:
      'Gateway that was chosen. Differs from `active` only if it is missing credentials and new orders fell back to the other one.',
  })
  selected: PaymentProviderName;

  @ApiProperty({
    enum: ['DASHBOARD', 'ENV'],
    description:
      'DASHBOARD = chosen by an admin; ENV = PAYMENT_PROVIDER default (no one has switched yet)',
  })
  source: 'DASHBOARD' | 'ENV';

  @ApiProperty({ type: String, format: 'date-time', nullable: true })
  updatedAt: Date | null;

  @ApiProperty({ type: PaymentGatewayAdminDto, nullable: true })
  updatedBy: PaymentGatewayAdminDto | null;

  @ApiProperty({ type: [PaymentGatewayProviderDto] })
  providers: PaymentGatewayProviderDto[];
}
