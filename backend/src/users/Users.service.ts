import { Injectable } from '@nestjs/common';
import { UserRepository } from '../repositories/user.repository';
import { UserModel } from './entities/User.model';
import { RolesEnum } from '../types';
import { UpdateUserDto } from './entities/user.dto';

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
}