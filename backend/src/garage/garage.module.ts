import { Module } from '@nestjs/common';
import { GarageService } from './Garage.service';
import { GarageController } from './Garage.controller';
import { UsersModule } from '../users';
import { GarageRepository } from '../repositories/garage.repository';

@Module({
  providers: [GarageService, GarageRepository],
  controllers: [GarageController],
  exports: [GarageService, GarageRepository],
  imports: [UsersModule],
})
export class GarageModule {}
