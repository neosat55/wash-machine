import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class AddBoxDto {
  @ApiProperty()
  name: string;
}

export class UpdateBoxDto {
  @ApiPropertyOptional()
  name: string;
}

export class AddBoxMasterDto {
  @ApiProperty()
  user_id: number;
  @ApiProperty()
  box_id: number;
}