import {
  Inject,
  Injectable,
  Logger,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import paymentConfig, {
  PAYMENT_PROVIDER_NAMES,
  PaymentProviderName,
} from 'src/config/payment.config';
import { ServiceError } from 'src/common/errors/service-error';
import { PrismaService } from 'src/prisma/prisma.service';
import { PaymentProvider } from './interfaces/payment-provider.interface';
import { MonnifyService } from './monnify.service';
import { AlatpayService } from './alatpay.service';

/** app_settings key holding the gateway admins picked for new orders. */
export const ACTIVE_PROVIDER_SETTING = 'payment.activeProvider';

/** How often each instance re-reads the setting, so all instances converge. */
const REFRESH_INTERVAL_MS = 30_000;

const PROVIDER_LABELS: Record<PaymentProviderName, string> = {
  ALATPAY: 'ALATPay',
  MONNIFY: 'Monnify',
};

export interface PaymentGatewayStatus {
  /** Gateway new orders use right now. */
  active: PaymentProviderName;
  /** Gateway that was chosen. Differs from `active` only if it lost its credentials. */
  selected: PaymentProviderName;
  /** DASHBOARD = chosen by an admin; ENV = PAYMENT_PROVIDER default. */
  source: 'DASHBOARD' | 'ENV';
  updatedAt: Date | null;
  updatedBy: { id: string; fullName: string } | null;
  providers: {
    name: PaymentProviderName;
    label: string;
    configured: boolean;
  }[];
}

/**
 * Resolves payment providers.
 *  - `active()`  → the gateway for NEW orders. Chosen by admins from the
 *    dashboard (stored in app_settings); PAYMENT_PROVIDER is the default
 *    until someone picks one.
 *  - `for(name)` → the gateway an EXISTING order was created with. Verify,
 *    webhooks, pay links and refunds always use this, never the switch, so
 *    switching never strands an in-flight payment.
 */
@Injectable()
export class PaymentProviderRegistry implements OnModuleInit, OnModuleDestroy {
  static ERRORS = {
    UnknownProviderErr: 'UnknownPaymentProviderErr',
    NotConfiguredErr: 'PaymentProviderNotConfiguredErr',
  } satisfies Record<string, `${string}Err`>;

  private readonly logger = new Logger(PaymentProviderRegistry.name);
  private readonly providers: Record<PaymentProviderName, PaymentProvider>;
  private readonly envDefault: PaymentProviderName;
  private selected: PaymentProviderName;
  private source: PaymentGatewayStatus['source'] = 'ENV';
  private activeName: PaymentProviderName;
  private timer?: NodeJS.Timeout;

  constructor(
    monnify: MonnifyService,
    alatpay: AlatpayService,
    @Inject(paymentConfig.KEY)
    cfg: ConfigType<typeof paymentConfig>,
    private readonly prisma: PrismaService,
  ) {
    this.providers = { ALATPAY: alatpay, MONNIFY: monnify };
    this.envDefault = this.parseEnvDefault(cfg.activeProvider);
    this.selected = this.envDefault;
    this.activeName = this.resolveActive(this.selected);
  }

  async onModuleInit() {
    await this.refresh();
    if (process.env.NODE_ENV === 'test') return;
    this.timer = setInterval(() => void this.refresh(), REFRESH_INTERVAL_MS);
    this.timer.unref();
  }

  onModuleDestroy() {
    if (this.timer) clearInterval(this.timer);
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

  async getStatus(): Promise<PaymentGatewayStatus> {
    const setting = await this.prisma.appSetting.findUnique({
      where: { key: ACTIVE_PROVIDER_SETTING },
    });
    const updatedBy = setting?.updatedById
      ? await this.prisma.admin.findUnique({
          where: { id: setting.updatedById },
          select: { id: true, fullName: true },
        })
      : null;

    return {
      active: this.activeName,
      selected: this.selected,
      source: this.source,
      updatedAt: setting?.updatedAt ?? null,
      updatedBy,
      providers: PAYMENT_PROVIDER_NAMES.map((name) => ({
        name,
        label: PROVIDER_LABELS[name],
        configured: this.providers[name].isConfigured(),
      })),
    };
  }

  /** Switches the gateway for new orders. Orders already started keep theirs. */
  async setActive(
    rawName: string,
    adminId: string,
  ): Promise<PaymentGatewayStatus> {
    const name = rawName.trim().toUpperCase() as PaymentProviderName;
    if (!PAYMENT_PROVIDER_NAMES.includes(name)) {
      throw new ServiceError(
        `Unknown payment provider "${rawName}"`,
        PaymentProviderRegistry.ERRORS.UnknownProviderErr,
      );
    }
    if (!this.providers[name].isConfigured()) {
      throw new ServiceError(
        `${PROVIDER_LABELS[name]} is missing its credentials on the server, so it can't take payments yet.`,
        PaymentProviderRegistry.ERRORS.NotConfiguredErr,
      );
    }

    const from = this.activeName;
    await this.prisma.$transaction([
      this.prisma.appSetting.upsert({
        where: { key: ACTIVE_PROVIDER_SETTING },
        create: {
          key: ACTIVE_PROVIDER_SETTING,
          value: name,
          updatedById: adminId,
        },
        update: { value: name, updatedById: adminId },
      }),
      this.prisma.auditLog.create({
        data: {
          adminId,
          action: 'SWITCH_PAYMENT_GATEWAY',
          metadata: { from, to: name },
        },
      }),
    ]);

    this.apply(name, 'DASHBOARD');
    return this.getStatus();
  }

  /** Re-reads the admin's choice. Keeps the current gateway if the DB is unreachable. */
  async refresh(): Promise<void> {
    try {
      const setting = await this.prisma.appSetting.findUnique({
        where: { key: ACTIVE_PROVIDER_SETTING },
      });
      const stored =
        typeof setting?.value === 'string'
          ? (setting.value.toUpperCase() as PaymentProviderName)
          : null;

      if (stored && PAYMENT_PROVIDER_NAMES.includes(stored)) {
        this.apply(stored, 'DASHBOARD');
      } else {
        if (setting) {
          this.logger.error(
            `Ignoring invalid ${ACTIVE_PROVIDER_SETTING} value ${JSON.stringify(setting.value)}`,
          );
        }
        this.apply(this.envDefault, 'ENV');
      }
    } catch (err) {
      this.logger.warn(
        `Could not load the payment gateway setting; keeping ${this.activeName}: ${(err as Error).message}`,
      );
    }
  }

  private apply(
    name: PaymentProviderName,
    source: PaymentGatewayStatus['source'],
  ) {
    this.source = source;
    if (name === this.selected) return;
    this.selected = name;
    this.activeName = this.resolveActive(name);
  }

  private parseEnvDefault(raw: string): PaymentProviderName {
    if (!PAYMENT_PROVIDER_NAMES.includes(raw as PaymentProviderName)) {
      throw new Error(
        `Invalid PAYMENT_PROVIDER "${raw}". Use one of: ${PAYMENT_PROVIDER_NAMES.join(', ')}`,
      );
    }
    return raw as PaymentProviderName;
  }

  private resolveActive(selected: PaymentProviderName): PaymentProviderName {
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
        `${selected} is missing credentials; falling back to ${fallback} for new orders. Fix the ${selected} env vars.`,
      );
      return fallback;
    }

    this.logger.error(
      `${selected} is missing credentials and no other provider is configured. Checkout will fail until it is configured.`,
    );
    return selected;
  }
}
