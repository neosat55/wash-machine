import { Module } from '@nestjs/common';
import { BonusSystemController } from './BonusSystem.controller';
import { BonusSystemService } from './BonusSystem.service';
import { UsersModule } from '../users';
import { OrdersModule } from '../orders/orders.module';

@Module({
  controllers: [BonusSystemController],
  providers: [BonusSystemService],
  imports: [UsersModule, OrdersModule],
  exports: [BonusSystemService],
})
export class BonusSystemModule {}