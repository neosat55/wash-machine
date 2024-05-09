import { ApiProperty } from '@nestjs/swagger';

export class RegisterDTO {
  @ApiProperty()
  password: string;
  @ApiProperty()
  login: string;
  @ApiProperty()
  email: string;
  @ApiProperty()
  firstName: string;
  @ApiProperty()
  lastName: string;
  @ApiProperty()
  phone: string;
}

export class AuthDTO {
  @ApiProperty()
  password: string;
  @ApiProperty()
  login: string;
}