import { OrderStatus } from '../../types';

export class Order {
  box_num: number;
  id: number;
  payment_info: object;
  payment_status: string;
  payment_type: string;
  start_at: Date;
  status: OrderStatus
  user_id: number;
  packages: number[];
  total_price: number | null;
  total_time: number | null;

  constructor(order: Partial<Order>) {
    Object.assign(this, order);
  }
}