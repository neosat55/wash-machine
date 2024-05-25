import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreatePackageDto {
  @ApiProperty()
  name: string;
  @ApiProperty()
  price: number;
  @ApiProperty()
  duration: number;
}

export class UpdatePackageDto {
  @ApiPropertyOptional()
  name: string;
  @ApiPropertyOptional()
  price: number;
  @ApiPropertyOptional()
  duration: number;
  @ApiPropertyOptional()
  deleted: true | null;
}
