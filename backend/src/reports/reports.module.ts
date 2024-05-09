import { Module } from '@nestjs/common';
import { ReportsController } from './Reports.controller';
import { ReportsService } from './Reports.service';
import { UsersModule } from '../users';
import { OrdersModule } from '../orders/orders.module';
import { BonusSystemModule } from '../bonus-system';

@Module({
  controllers: [ReportsController],
  providers: [ReportsService],
  exports: [ReportsService],
  imports: [UsersModule, OrdersModule, BonusSystemModule],
})
export class ReportsModule {}