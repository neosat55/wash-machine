import type { ColumnType } from "kysely";

export type Generated<T> = T extends ColumnType<infer S, infer I, infer U>
  ? ColumnType<S, I | undefined, U>
  : ColumnType<T, T | undefined, T>;

export type Json = JsonValue;

export type JsonArray = JsonValue[];

export type JsonObject = {
  [K in string]?: JsonValue;
};

export type JsonPrimitive = boolean | number | string | null;

export type JsonValue = JsonArray | JsonObject | JsonPrimitive;

export type Timestamp = ColumnType<Date, Date | string, Date | string>;

export interface Boxes {
  id: Generated<number>;
  name: string | null;
}

export interface BoxesMasters {
  box_id: number | null;
  id: Generated<number>;
  user_id: number | null;
}

export interface BoxesQueue {
  box_num: number | null;
  curr_queue: number | null;
  status: string | null;
}

export interface Orders {
  box_num: number | null;
  id: Generated<number>;
  payment_info: Json | null;
  payment_status: string | null;
  payment_type: string | null;
  start_at: Timestamp | null;
  status: string | null;
  user_id: number | null;
}

export interface OrdersPackages {
  id: number;
  order_id: number | null;
  package_ids: number[] | null;
  total_price: number | null;
  total_time: number | null;
}

export interface Packages {
  duration: number | null;
  id: Generated<number>;
  name: string | null;
  price: number | null;
}

export interface Roles {
  id: Generated<number>;
  label: string | null;
  name: string | null;
}

export interface Users {
  created_at: Timestamp | null;
  discount: number | null;
  email: string | null;
  first_name: string | null;
  id: Generated<number>;
  last_name: string | null;
  password: string | null;
  phone: string | null;
  username: string | null;
}

export interface UsersRoles {
  id: Generated<number>;
  role_id: number | null;
  user_id: number | null;
}

export interface DB {
  boxes: Boxes;
  boxes_masters: BoxesMasters;
  boxes_queue: BoxesQueue;
  orders: Orders;
  orders_packages: OrdersPackages;
  packages: Packages;
  roles: Roles;
  users: Users;
  users_roles: UsersRoles;
}
