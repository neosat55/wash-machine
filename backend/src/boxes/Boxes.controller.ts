import { Body, Controller, Delete, Get, Param, Post, Put, Sse } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Public } from '../infrastructure/auth/public.decorator';
import { Roles } from '../infrastructure/auth/roles.decorator';
import { RolesEnum } from '../types';
import { BoxesService } from './Boxes.service';
import { AddBoxDto, AddBoxMasterDto, UpdateBoxDto } from './entities/box.dto';

class Result {
  constructor(data: object) {
    Object.assign(this, data);
  }

  static Ok(data: any) {
    return new Result({ success: true, data });
  }

  static Error(data: any, error: Error) {
    return new Result({ success: false, data, error });
  }
}

@Controller('boxes')
@ApiTags('Boxes')
export class BoxesController {
  constructor(private readonly boxesService: BoxesService) {
  }

  @Get('')
  @Public()
  async getBoxes() {
    return Result.Ok(await this.boxesService.getBoxes());
  }

  @Get('/status/:id')
  @Public()
  async getBoxStatus(@Param('id') id: number) {
    return Result.Ok(await this.boxesService.getBoxStatus(id));
  }

  @Get('/masters/:id')
  @Public()
  async getBoxMasters(@Param('id') id: number) {
    return Result.Ok(await this.boxesService.getBoxMasters(id));
  }

  @Get('/queue/:id')
  @Public()
  async getBoxQueue(@Param('id') id: number) {
    return Result.Ok(await this.boxesService.getBoxQueue(id));
  }

  @Post('/add-new')
  @Roles([RolesEnum.ADMIN])
  @ApiBearerAuth()
  async addNewBox(@Body() body: AddBoxDto) {
    return Result.Ok(await this.boxesService.addNewBox(body));
  }

  @Put('/update/:id')
  @Roles([RolesEnum.ADMIN])
  @ApiBearerAuth()
  async updateBox(@Param('id') id: number, @Body() body: UpdateBoxDto) {
    return Result.Ok(await this.boxesService.updateBox(id, body));
  }

  @Delete('/delete/:id')
  @Roles([RolesEnum.ADMIN])
  @ApiBearerAuth()
  async deleteBox(@Param('id') id: number) {
    return Result.Ok(await this.boxesService.deleteBox(id));
  }

  @Put('add-box-master')
  @Roles([RolesEnum.ADMIN])
  @ApiBearerAuth()
  async addMasterToBox(@Body() body: AddBoxMasterDto) {
    return Result.Ok(await this.boxesService.addBoxMaster(body.box_id, body.user_id));
  }
}