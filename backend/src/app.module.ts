import { Module } from '@nestjs/common';
import { UsersModule } from './users';
import { AuthModule } from './auth';
import { DatabaseModule } from './infrastructure/persistence/database.module';
import { OrdersModule } from './orders/orders.module';
import { BoxesModule } from './boxes/boxes.module';
import { BonusSystemModule } from './bonus-system';
import { PackageModule } from './packages';
import { GarageModule } from './garage/garage.module';

@Module({
  imports: [
    AuthModule,
    UsersModule,
    OrdersModule,
    BoxesModule,
    BonusSystemModule,
    PackageModule,
    GarageModule,
    DatabaseModule.forRoot(),
  ],
})
export class AppModule {}
