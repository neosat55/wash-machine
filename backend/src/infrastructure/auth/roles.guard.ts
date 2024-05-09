import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Roles } from './roles.decorator';
import { UserModel } from '../../users/entities/User.model';
import { RolesEnum } from '../../types';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const roles = this.reflector.get(Roles, context.getHandler());

    if (!roles) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    return this.matchRoles(roles, user.roles);
  }

  matchRoles(roles: RolesEnum[], userRoles: UserModel['roles']): boolean {
    const rolesSet = new Set([...roles]);

    return userRoles.filter(r => rolesSet.has(r.name)).length > 0;
  }
}