import { Injectable } from '@nestjs/common';
import { CreateOrderDto, LoadAllDto } from './entities/orders.dto';
import { OrderRepository } from '../repositories/order.repository';
import { Order } from './entities/order.model';
import { OrderStatus } from '../types';
import { PackageRepository } from '../repositories/package.repository';
import { BoxRepository } from '../repositories/box.repository';

@Injectable()
export class OrdersService {
  constructor(
    private readonly orderRepository: OrderRepository,
    private readonly serviceRepository: PackageRepository,
    private readonly boxesRepository: BoxRepository,
  ) {}

  async createOrder(userId: number, body: CreateOrderDto) {
    const servicesTotal = await this.serviceRepository.getPackagesTotalData(
      body.packages,
    );

    const order = new Order({
      user_id: userId,
      status: OrderStatus.CREATED,
      start_at: body.start_at,
      packages: body.packages,
      total_time: servicesTotal.total_time,
      total_price: servicesTotal.total_price,
    });

    order.box_num = await this.boxesRepository.findBestBox(order);

    return this.orderRepository.createOrder(order);
  }

  getOrderStatus(id: number) {
    return this.orderRepository.getOrderStatus(id);
  }

  changeOrderStatus(id: number, orderStatus: OrderStatus) {
    return this.orderRepository.changeOrderStatus(id, orderStatus);
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

  getBoxesQueueForCurrentDay() {
    return this.orderRepository.getBoxesQueueForCurrentDay();
  }

  async loadCurrentOrders(id: number) {
    const orders = await this.orderRepository.getCurrentOrders(id);

    return orders;
  }

  async loadAllInProgress() {
    return this.orderRepository.loadAllInProgress();
  }

  async loadAll(body: LoadAllDto) {
    return this.orderRepository.loadAll(body);
  }
}
