import { Body, Controller, Get, HttpCode, HttpStatus, Post, Request, Res } from '@nestjs/common';
import { AuthDTO, RegisterDTO } from './entities';
import { AuthService } from './Auth.service';
import { Public } from '../infrastructure/auth/public.decorator';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { IRequest } from '../types';
import { UsersService } from '../users/Users.service';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService, private usersService: UsersService) {
  }

  @Public()
  @HttpCode(HttpStatus.OK)
  @Post('login')
  login(@Body() body: AuthDTO) {
    return this.authService.login(body);
  }

  @Public()
  @HttpCode(HttpStatus.OK)
  @Post('register')
  register(@Body() body: RegisterDTO) {
    return this.authService.register(body);
  }

  @ApiBearerAuth()
  @Get('profile')
  async getProfile(@Request() req: IRequest) {
    return this.usersService.getProfile(req.user.id);
  }
}
