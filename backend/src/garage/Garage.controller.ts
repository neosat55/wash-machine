import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, Req } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { GarageService } from './Garage.service';
import { IRequest, Result } from '../types';
import { AddGarageDto, UpdateGarageDto } from './entities/garage.dto';

@Controller('garage')
@ApiTags('garage')
@ApiBearerAuth()
export class GarageController {
  constructor(private garageService: GarageService) {}

  @Post()
  async addNewCar(@Req() req: IRequest, @Body() body: AddGarageDto) {
    return this.garageService.addNewCar(req.user.id, body);
  }

  @Put('/:id')
  async updateCar(@Param('id', new ParseIntPipe()) id: number, @Body() body: UpdateGarageDto) {
    return this.garageService.updateGarage(id, body);
  }

  @Delete('/:id')
  async deleteCar(@Param('id', new ParseIntPipe()) id: number) {
    return this.garageService.deleteGarage(id);
  }

  @Get()
  async getCars(@Req() req: IRequest) {
    return Result.Ok(await this.garageService.getCars(req.user.id));
  }
}
