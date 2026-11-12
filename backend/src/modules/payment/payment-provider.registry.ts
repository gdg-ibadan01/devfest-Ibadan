import { Inject, Injectable, Logger } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import paymentConfig, {
  PAYMENT_PROVIDER_NAMES,
  PaymentProviderName,
} from 'src/config/payment.config';
import { ServiceError } from 'src/common/errors/service-error';
import { PaymentProvider } from './interfaces/payment-provider.interface';
import { MonnifyService } from './monnify.service';
import { AlatpayService } from './alatpay.service';

/**
 * Resolves payment providers.
 *  - `active()`  → the gateway for NEW orders (PAYMENT_PROVIDER, default ALATPAY).
 *  - `for(name)` → the gateway an EXISTING order was created with. Verify,
 *    webhooks, pay links and refunds always use this, never the switch, so
 *    flipping PAYMENT_PROVIDER never strands an in-flight payment.
 */
@Injectable()
export class PaymentProviderRegistry {
  static ERRORS = {
    UnknownProviderErr: 'UnknownPaymentProviderErr',
  } satisfies Record<string, `${string}Err`>;

  private readonly logger = new Logger(PaymentProviderRegistry.name);
  private readonly providers: Record<PaymentProviderName, PaymentProvider>;
  private readonly activeName: PaymentProviderName;

  constructor(
    monnify: MonnifyService,
    alatpay: AlatpayService,
    @Inject(paymentConfig.KEY)
    cfg: ConfigType<typeof paymentConfig>,
  ) {
    this.providers = { ALATPAY: alatpay, MONNIFY: monnify };
    this.activeName = this.resolveActive(cfg.activeProvider);
  }

  active(): PaymentProvider {
    return this.providers[this.activeName];
  }

  get activeProviderName(): PaymentProviderName {
    return this.activeName;
  }

  for(name: string | null | undefined): PaymentProvider {
    const key = (name ?? '').toUpperCase() as PaymentProviderName;
    const provider = this.providers[key];
    if (!provider) {
      throw new ServiceError(
        `Unknown payment provider "${name}"`,
        PaymentProviderRegistry.ERRORS.UnknownProviderErr,
      );
    }
    return provider;
  }

  private resolveActive(raw: string): PaymentProviderName {
    if (!PAYMENT_PROVIDER_NAMES.includes(raw as PaymentProviderName)) {
      throw new Error(
        `Invalid PAYMENT_PROVIDER "${raw}". Use one of: ${PAYMENT_PROVIDER_NAMES.join(', ')}`,
      );
    }
    const selected = raw as PaymentProviderName;
    if (this.providers[selected].isConfigured()) {
      this.logger.log(`Payment provider for new orders: ${selected}`);
      return selected;
    }

    // Keep taking payments rather than failing every checkout: fall back to
    // the other gateway if it is fully configured, and shout about it.
    const fallback = PAYMENT_PROVIDER_NAMES.find(
      (name) => name !== selected && this.providers[name].isConfigured(),
    );
    if (fallback) {
      this.logger.error(
        `PAYMENT_PROVIDER=${selected} is missing credentials; falling back to ${fallback} for new orders. Fix the ${selected} env vars.`,
      );
      return fallback;
    }

    this.logger.error(
      `PAYMENT_PROVIDER=${selected} is missing credentials and no other provider is configured. Checkout will fail until it is configured.`,
    );
    return selected;
  }
}
