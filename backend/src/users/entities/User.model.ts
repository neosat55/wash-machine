import { RolesEnum } from '../../types';

export class UserModel {
  created_at: Date;
  discount: number;
  email: string;
  first_name: string;
  id: number;
  last_name: string;
  password: string;
  phone: string;
  username: string;
  roles: {id: number, name: RolesEnum}[];

  constructor(user: Partial<UserModel>) {
    Object.assign(this, user);
  }
}