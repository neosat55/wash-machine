import { Injectable } from '@nestjs/common';
import { CreateOrderDto } from './entities/orders.dto';
import { OrderRepository } from '../repositories/order.repository';
import { Order } from './entities/order.model';
import { OrderStatus } from '../types';
import { PackageRepository } from '../repositories/package.repository';

@Injectable()
export class OrdersService {
  constructor(
    private readonly orderRepository: OrderRepository,
    private readonly serviceRepository: PackageRepository,
  ) {
  }

  async createOrder(userId: number, body: CreateOrderDto) {
    const servicesTotal = await this.serviceRepository.getPackagesTotalData(body.packages);

    const order = new Order({
      box_num: body.box_num,
      user_id: userId,
      status: OrderStatus.CREATED,
      start_at: body.start_at,
      packages: body.packages,
      total_time: servicesTotal.total_time,
      total_price: servicesTotal.total_price
    });

    return this.orderRepository.createOrder(order);
  }

  getOrderStatus(id: number) {
    return this.orderRepository.getOrderStatus(id);
  }

  cancelOrder(id: number) {
    return this.orderRepository.cancelOrder(id);
  }

  completeOrder(id: number) {
    return this.orderRepository.completeOrder(id);
  }

  getOrdersHistory(userId: number) {
    return this.orderRepository.getOrdersHistory(userId);
  }

  createGuestOrder(body: CreateOrderDto) {
    return Promise.resolve(undefined);
  }

  countInProgressOrderByBoxNum(id: number) {
    return this.orderRepository.countOrdersByBoxNum(id);
  }
}