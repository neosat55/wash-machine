import { Body, Controller, Delete, Param, Put, Query, Req } from '@nestjs/common';
import { UsersService } from './Users.service';
import { IRequest, RolesEnum } from '../types';
import { ApiBearerAuth, ApiQuery, ApiTags } from '@nestjs/swagger';
import { UpdateUserDto } from './entities/user.dto';
import { Roles } from '../infrastructure/auth/roles.decorator';

@ApiTags('Users')
@Controller('user')
@ApiBearerAuth()
export class UsersController {
  constructor(private readonly usersService: UsersService) {
  }

  @Delete('delete-profile')
  @Roles([RolesEnum.USER, RolesEnum.ADMIN])
  async deleteUserProfile(@Req() req: IRequest) {
    return this.usersService.deleteUserProfile(req.user.id);
  }

  @Put('update-profile')
  @Roles([RolesEnum.USER, RolesEnum.ADMIN])
  async updateUserProfile(@Req() req: IRequest, @Body() body: UpdateUserDto) {
    return this.usersService.updateUserProfile(req.user.id, body);
  }

  @Put('/give-role/:id')
  @Roles([RolesEnum.ADMIN])
  @ApiQuery({ enum: RolesEnum, name: 'role', required: true })
  async giveUserRole(@Param('id') userId: number, @Query('role') role: RolesEnum) {
    return this.usersService.giveUserRole(userId, role);
  }

  @Put('/revoke-role/:id')
  @Roles([RolesEnum.ADMIN])
  @ApiQuery({ enum: RolesEnum, name: 'role', required: true })
  async revokeUserRole(@Param('id') userId: number, @Query('role') role: RolesEnum) {
    return this.usersService.revokeUserRole(userId, role);
  }
}