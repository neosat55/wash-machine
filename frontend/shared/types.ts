export interface Profile {
  id: number;
  username: string;
  phone: string;
  email: string;
  last_name: string;
  first_name: string;
  created_at: string;
  discount: any;
  roles: UserRole[];
}

export interface UserRole {
  id: number;
  name: "admin" | "worker" | "guest" | "user";
}

export interface Role {
  id: number;
  name: string;
  label: string;
}

export interface RegisterBody {
  password: string;
  login: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
}

export interface AuthBody {
  login: string;
  password: string;
}

export interface ProfileResponse extends Profile {}

export interface Result<T> {
  success: boolean;
  data: T;
}

export interface PackageDto {
  id: number;
  name: string;
  duration: number;
  price: number;
  deleted: true | null;
}

export interface CreateOrder {
  start_at: string;
  packages: number[];
  use_bonuses?: boolean;
}

export interface OrderDto {
  id: number;
  user_id: number;
  start_at: string;
  payment_status: any;
  payment_info: any;
  payment_type: any;
  box_num: number;
  status: string;
  package_ids: number[];
  order_id: number;
  total_time: number;
  total_price: number;
}

export interface UserListDto {
  roles: Role[];
  id: number;
  username: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: any;
  discount: any;
  created_at: string;
}

export interface CarDto {
  id: number;
  user_id: number;
  car_number: string;
}
