import { Injectable } from '@nestjs/common';
import { CreateOrderDto, LoadAllDto } from './entities/orders.dto';
import { OrderRepository } from '../repositories/order.repository';
import { Order } from './entities/order.model';
import { OrderStatus } from '../types';
import { PackageRepository } from '../repositories/package.repository';
import { BoxRepository } from '../repositories/box.repository';
import { BonusSystemRepository } from '../repositories/bonus-system.repository';

@Injectable()
export class OrdersService {
  constructor(
    private readonly orderRepository: OrderRepository,
    private readonly serviceRepository: PackageRepository,
    private readonly boxesRepository: BoxRepository,
    private readonly bonusesRepository: BonusSystemRepository,
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

    let bonusAmount = 0;

    if (body.use_bonuses) {
      const bonuses =
        await this.bonusesRepository.getUserBonusesByUserId(userId);

      bonusAmount = bonuses.amount;
      if (order.total_price - bonusAmount < 0) {
        bonusAmount = order.total_price;
        order.total_price = 0;
      } else {
        order.total_price -= bonusAmount;
      }
    }

    order.box_num = await this.boxesRepository.findBestBox(order);

    const createdOrder = await this.orderRepository.createOrder(order);

    if (createdOrder && body.use_bonuses) {
      await this.bonusesRepository.chargeBonuses(userId, bonusAmount);
    }

    return order;
  }

  getOrderStatus(id: number) {
    return this.orderRepository.getOrderStatus(id);
  }

  async changeOrderStatus(id: number, orderStatus: OrderStatus) {
    const isSuccess = await this.orderRepository.changeOrderStatus(
      id,
      orderStatus,
    );

    if (isSuccess && orderStatus === OrderStatus.COMPLETED) {
      const { user_id } = await this.orderRepository.getUserIdByOrderId(id);

      await this.bonusesRepository.addBonusToUser(user_id);
    }

    return isSuccess;
  }

  getOrdersHistory(userId: number) {
    return this.orderRepository.getOrdersHistory(userId);
  }

  getBoxesQueueForCurrentDay() {
    return this.orderRepository.getBoxesQueueForCurrentDay();
  }

  loadCurrentOrders(id: number) {
    return this.orderRepository.getCurrentOrders(id);
  }

  loadAllInProgress() {
    return this.orderRepository.loadAllInProgress();
  }

  loadAll(body: LoadAllDto) {
    return this.orderRepository.loadAll(body);
  }
}
