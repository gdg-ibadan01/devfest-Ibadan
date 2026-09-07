import { Module } from '@nestjs/common';
import { DashboardController } from './dashboard.controller';
import { DashboardService } from './dashboard.service';
import { OrdersModule } from 'src/modules/order/order.module';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  imports: [OrdersModule],
  controllers: [DashboardController],
  providers: [DashboardService, PrismaService],
})
export class DashboardModule {}
