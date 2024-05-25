import { ApiProperty } from '@nestjs/swagger';

export class AddGarageDto {
  @ApiProperty()
  car_number: string;
}

export class UpdateGarageDto {
  @ApiProperty()
  car_number: string;
}
