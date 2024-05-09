import { Module } from '@nestjs/common';
import { BoxesService } from './Boxes.service';
import { BoxRepository } from '../repositories/box.repository';
import { BoxesController } from './Boxes.controller';
import { OrdersModule } from '../orders/orders.module';
import { UsersModule } from '../users';

@Module({
  providers: [BoxesService, BoxRepository],
  controllers: [BoxesController],
  exports: [BoxesService, BoxRepository],
  imports: [OrdersModule, UsersModule]
})
export class BoxesModule {}