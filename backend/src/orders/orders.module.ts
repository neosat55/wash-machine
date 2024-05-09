import { Module } from '@nestjs/common';
import { OrdersService } from './Orders.service';
import { OrdersController } from './Orders.controller';
import { UserRepository } from '../repositories/user.repository';
import { OrderRepository } from '../repositories/order.repository';
import { PackageRepository } from '../repositories/package.repository';
import { BoxRepository } from '../repositories/box.repository';

@Module({
  providers: [
    BoxRepository,
    UserRepository,
    OrderRepository,
    OrdersService,
    PackageRepository,
  ],
  controllers: [OrdersController],
  exports: [OrderRepository, OrdersService],
})
export class OrdersModule {
}