import { Reflector } from '@nestjs/core';
import { RolesEnum } from '../../types';

export const Roles = Reflector.createDecorator<RolesEnum[]>();