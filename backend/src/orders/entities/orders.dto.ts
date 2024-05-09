import { ApiProperty } from '@nestjs/swagger';

export class CreateOrderDto {
  @ApiProperty()
  box_num: number;
  @ApiProperty()
  start_at: Date;
  @ApiProperty()
  packages: number[];
}