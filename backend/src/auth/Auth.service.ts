import { Injectable, UnauthorizedException } from '@nestjs/common';
import { HasherBcrypt } from '../infrastructure/hasher/hasher';
import { JwtService } from '@nestjs/jwt';
import { UserRepository } from '../repositories/user.repository';
import { RegisterDTO } from './entities';

@Injectable()
export class AuthService {
  constructor(
    private usersRepo: UserRepository,
    private hasher: HasherBcrypt,
    private jwtService: JwtService,
  ) {
  }

  async login(body: { login: string; password: string }) {
    const user = await this.usersRepo.getUserByLogin(body.login);

    if (!user) {
      throw new UnauthorizedException();
    }

    const passwordOk = await this.hasher.compare(body.password, user.password);

    if (!passwordOk) {
      throw new UnauthorizedException();
    }

    const userRoles = await this.usersRepo.getUserRoles(user.id);

    console.log(userRoles);

    const payload = { id: user.id, username: user.username, roles: userRoles };

    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }

  async register(body: RegisterDTO) {
    const password = await this.hasher.encrypt(body.password);

    const user = await this.usersRepo.createUser({
      email: body.email,
      password,
      username: body.login,
      first_name: body.firstName,
      last_name: body.lastName,
      phone: body.phone,
      meta: {}
    });

    return user;
  }
}