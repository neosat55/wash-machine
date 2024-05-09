import { UserModel } from '../../users/entities/User.model';

export class BoxModel {
  id: number;
  name: string;
  masters: UserModel[];

  constructor(data: Partial<BoxModel>) {
    Object.assign(this, data);
  }
}