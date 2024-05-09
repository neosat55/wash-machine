import { Injectable } from '@nestjs/common';
import { BoxRepository } from '../repositories/box.repository';
import { UserRepository } from '../repositories/user.repository';
import { BoxModel } from './entities/Box.model';
import { UserModel } from '../users/entities/User.model';
import { AddBoxDto, UpdateBoxDto } from './entities/box.dto';
import { OrdersService } from '../orders/Orders.service';

@Injectable()
export class BoxesService {
  constructor(
    private readonly boxRepo: BoxRepository,
    private readonly orderService: OrdersService,
    private readonly userRepo: UserRepository,
  ) {
  }

  getBoxes() {
    return this.boxRepo.getBoxes();
  }

  getBoxStatus(id: number) {
    return this.boxRepo.getBoxStatus(id);
  }

  async getBoxMasters(id: number) {
    const box = await this.boxRepo.getBox(id);
    const masters = await this.boxRepo.getBoxMasters(id);

    if (!masters.length) {
      return null;
    }

    const users = await this.userRepo.findUsersByIds(masters.map(m => m.user_id));

    return new BoxModel({
      masters: users.map(u => new UserModel(u)),
      id: box.id,
      name: box.name,
    });
  }

  async addNewBox(box: AddBoxDto) {
    return this.boxRepo.addNewBox(box);
  }

  async deleteBox(id: number) {
    return this.boxRepo.deleteBox(id);
  }

  async updateBox(id: number, box: UpdateBoxDto) {
    return this.boxRepo.updateBox(id, box);
  }

  async addBoxMaster(box_id: number, master_id: number) {
    return this.boxRepo.addBoxMaster(box_id, master_id);
  }

  async getBoxQueue(id: number) {
    const { queue } = await this.orderService.countInProgressOrderByBoxNum(id);
    return Number(queue);
  }
}