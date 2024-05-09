import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateUserDto {
  @ApiPropertyOptional()
  username: string;
  @ApiPropertyOptional()
  first_name: string;
  @ApiPropertyOptional()
  last_name: string;
  @ApiPropertyOptional()
  email: string;
}