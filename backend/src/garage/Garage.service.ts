import { Injectable } from '@nestjs/common';
import { UserRepository } from '../repositories/user.repository';
import { GarageRepository } from '../repositories/garage.repository';
import { AddGarageDto, UpdateGarageDto } from './entities/garage.dto';

@Injectable()
export class GarageService {
  constructor(
    private readonly userRepo: UserRepository,
    private readonly garageRepo: GarageRepository,
  ) {}

  addNewCar(user_id: number, body: AddGarageDto) {
    return this.garageRepo.insertToGarage(user_id, body);
  }

  updateGarage(id: number, body: UpdateGarageDto) {
    return this.garageRepo.updateGarage(id, body);
  }

  getCars(user_id: number) {
    return this.garageRepo.getCars(user_id);
  }

  deleteGarage(id: number) {
    return this.garageRepo.deleteCar(id)
  }
}
