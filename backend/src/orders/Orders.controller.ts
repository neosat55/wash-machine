import { Body, Controller, Get, Param, ParseIntPipe, Post, Put, Req } from '@nestjs/common';
import { OrdersService } from './Orders.service';
import { IRequest, RolesEnum } from '../types';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CreateOrderDto } from './entities/orders.dto';
import { Roles } from '../infrastructure/auth/roles.decorator';

@ApiTags('Orders')
@Controller('order')
@ApiBearerAuth()
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {
  }

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
    return this.ordersService.cancelOrder(id);
  }

  @Put('complete/:id')
  @Roles([RolesEnum.ADMIN, RolesEnum.WORKER])
  async completeOrder(@Param('id', new ParseIntPipe()) id: number) {
    return this.ordersService.completeOrder(id);
  }

  @Post('orders-history')
  @Roles([RolesEnum.ADMIN, RolesEnum.USER])
  async getOrdersHistory(@Req() req: IRequest) {
    return this.ordersService.getOrdersHistory(req.user.id);
  }
}