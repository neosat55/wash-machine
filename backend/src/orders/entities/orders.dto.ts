import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { OrderStatus } from '../../types';

export class CreateOrderDto {
  @ApiProperty()
  start_at: Date;
  @ApiProperty()
  packages: number[];
  @ApiPropertyOptional()
  use_bonuses: boolean;
  @ApiPropertyOptional()
  car_number: string;
}

export class Filters {
  @ApiPropertyOptional()
  status: OrderStatus[];
  @ApiPropertyOptional()
  packages: number[];
}

export class LoadAllDto {
  @ApiPropertyOptional()
  filters: Filters;
}
