import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Req, Res,
} from '@nestjs/common';
import { OrdersService } from './Orders.service';
import { IRequest, OrderStatus, Result, RolesEnum } from '../types';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CreateOrderDto, LoadAllDto } from './entities/orders.dto';
import { Roles } from '../infrastructure/auth/roles.decorator';

@ApiTags('Orders')
@Controller('order')
@ApiBearerAuth()
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post('place')
  async placeOrder(@Req() req: IRequest, @Body() body: CreateOrderDto) {
    return this.ordersService.createOrder(req.user.id, body);
  }

  @Get('status/:id')
  async getOrderStatus(@Param('id', new ParseIntPipe()) id: number) {
    return this.ordersService.getOrderStatus(id);
  }

  @Put('cancel/:id')
  async cancelOrder(@Param('id', new ParseIntPipe()) id: number) {
    return this.ordersService.changeOrderStatus(id, OrderStatus.CANCELLED);
  }

  @Put('complete/:id')
  @Roles([RolesEnum.ADMIN, RolesEnum.WORKER])
  async completeOrder(@Param('id', new ParseIntPipe()) id: number) {
    return this.ordersService.changeOrderStatus(id, OrderStatus.COMPLETED);
  }

  @Put('to-in-progress/:id')
  @Roles([RolesEnum.ADMIN, RolesEnum.WORKER])
  async toInProgress(@Param('id', new ParseIntPipe()) id: number) {
    return this.ordersService.changeOrderStatus(id, OrderStatus.IN_PROGRESS);
  }

  @Post('orders-history')
  @Roles([RolesEnum.ADMIN, RolesEnum.USER])
  async getOrdersHistory(@Req() req: IRequest) {
    return this.ordersService.getOrdersHistory(req.user.id);
  }

  @Get('load-current')
  async loadCurrent(@Req() req: IRequest) {
    return Result.Ok(await this.ordersService.loadCurrentOrders(req.user.id));
  }

  @Get('in-progress')
  @Roles([RolesEnum.WORKER, RolesEnum.ADMIN])
  async loadAllInProgress() {
    return Result.Ok(await this.ordersService.loadAllInProgress());
  }

  @Post('load-all')
  @Roles([RolesEnum.ADMIN])
  async loadAllWithFilters(@Req() req: IRequest, @Body() body: LoadAllDto) {
    return Result.Ok(await this.ordersService.loadAll(body));
  }
}
