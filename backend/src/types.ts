import { Request } from 'express';

export interface AuthUser {
  id: number;
  username: string;
  roles: { id: number; name: RolesEnum }[];
}

export interface IRequest extends Request {
  user: AuthUser;
}

export enum RolesEnum {
  ADMIN = 'admin',
  USER = 'user',
  GUEST = 'guest',
  WORKER = 'worker',
}

export const enum OrderStatus {
  CREATED = 'created',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
  FAIL_PAYMENT = 'fail-payment',
  IN_PROGRESS = 'in-progress',
}

export class Result {
  constructor(data: object) {
    Object.assign(this, data);
  }

  static Ok(data: any) {
    return new Result({ success: true, data });
  }

  static Error(data: any, error: Error) {
    return new Result({ success: false, data, error });
  }
}
