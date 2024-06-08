import { LoadAllDto } from '../../orders/entities/orders.dto';
import { Inject, Injectable } from '@nestjs/common';
import { OrdersService } from '../../orders/Orders.service';
import * as ExcelJS from 'exceljs';
import { PackageRepository } from '../../repositories/package.repository';
import { Simplify } from 'kysely';
import { UserRepository } from '../../repositories/user.repository';
import * as fs from 'node:fs';
import * as path from 'node:path';

@Injectable()
export class OrdersExcel {
  private readonly headers: Partial<ExcelJS.Column>[] = [
    {
      header: 'Дата заказа',
      key: 'start_at',
    },
    {
      header: 'Время',
      key: 'total_time',
    },
    {
      header: 'Цена',
      key: 'total_price',
    },
    {
      header: 'Статус',
      key: 'status',
    },
  ];

  constructor(
    private ordersService: OrdersService,
    private packageRepository: PackageRepository,
    private userRepository: UserRepository,
  ) {}

  async exec(body: LoadAllDto) {
    const orders = await this.ordersService.loadAll(body);

    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet('Заказы');
    const rows = await this.mapOrdersToRows(orders);

    sheet.columns = this.headers;
    sheet.addRows(rows);

    const fname = `orders_${+new Date()}.xlsx`;

    const ws = fs.createWriteStream(path.join('public', fname));

    await workbook.xlsx.write(ws);

    return fname;
  }

  async mapOrdersToRows(orders: Simplify<any>[]) {
    const rows = [];
    const packageIds = new Set(orders.flatMap((o) => o.package_ids));
    const usersIds = new Set(orders.flatMap((o) => o.user_id));
    // const packages = await this.packageRepository.getPackagesByIds([
    //   ...packageIds,
    // ]);
    // const users = await this.userRepository.getUsersByIds([...usersIds]);

    return orders;
  }
}
