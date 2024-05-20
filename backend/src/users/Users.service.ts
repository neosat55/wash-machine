import { Injectable } from '@nestjs/common';
import { UserRepository } from '../repositories/user.repository';
import { UserModel } from './entities/User.model';
import { RolesEnum } from '../types';
import { GetUsersListDto, UpdateUserDto } from './entities/user.dto';
import * as _ from 'lodash';

@Injectable()
export class UsersService {
  constructor(private userRepository: UserRepository) {
  }

  async getProfile(id: number) {
    const user = await this.userRepository.findById(id);
    const roles = await this.userRepository.getUserRoles(id);

    return new UserModel({ ...user, roles: roles as any });
  }

  deleteUserProfile(id: number) {
    return this.userRepository.deleteUserById(id);
  }

  updateUserProfile(id: number, body: UpdateUserDto) {
    return this.userRepository.updateUserById(id, body);
  }

  giveUserRole(userId: number, role: RolesEnum) {
    return this.userRepository.giveRoleToUser(userId, role);
  }

  revokeUserRole(userId: number, role: RolesEnum) {
    return this.userRepository.revokeRoleFromUser(userId, role);
  }

  async getUsersList(body: GetUsersListDto) {
    const usersList = await this.userRepository.getUsersList(body.filters);

    return usersList.map(u => _.omit(u, 'password'))
  }

  async roles() {
    return this.userRepository.getRoles();
  }
}