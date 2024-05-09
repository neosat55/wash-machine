import { Module } from '@nestjs/common';
import { UsersService } from './Users.service';
import { UsersController } from './Users.controller';
import { UserRepository } from '../repositories/user.repository';

@Module({
  providers: [UsersService, UserRepository],
  controllers: [UsersController],
  exports: [UsersService, UserRepository],
})
export class UsersModule {}