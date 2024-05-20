import { createInternalRequest } from "@/shared/request";
import {
  AuthBody,
  CreateOrder,
  OrderDto,
  Package,
  ProfileResponse,
  RegisterBody,
  Result, Role, UserListDto, UserRole,
} from '@/shared/types';

export const auth = createInternalRequest<
  { body: AuthBody },
  { access_token: string }
>((p) => ({
  url: "/auth/login",
  method: "POST",
  body: p.body,
}));

export const profile = createInternalRequest<void, ProfileResponse>((p) => ({
  url: "/auth/profile",
  method: "GET",
}));

export const register = createInternalRequest<{ body: RegisterBody }>((p) => ({
  url: "/auth/register",
  method: "POST",
  body: p.body,
}));

export const getBoxesQueue = createInternalRequest<void, Result<number>>({
  url: "/boxes/queue",
});

export const createOrder = createInternalRequest<{ body: CreateOrder }, void>(
  (p) => ({
    url: "/order/place",
    method: "POST",
    body: p.body,
  }),
);

export const loadUserOrders = createInternalRequest<void, Result<OrderDto[]>>({
  url: "/order/load-current",
});

export const loadInProgressOrders = createInternalRequest<
  void,
  Result<OrderDto[]>
>({
  url: "/order/in-progress",
});

export const loadAllOrders = createInternalRequest<{ body: object }, Result<OrderDto[]>>((p) => ({
  url: "/order/load-all",
  method: "POST",
  body: p.body,
}));

export const cancelOrder = createInternalRequest<
  { params: { id: number } },
  void
>((p) => ({
  url: `/order/cancel/${p.params.id}`,
  method: "PUT",
}));

export const completeOrder = createInternalRequest<{ params: { id: number } }>(
  (p) => ({
    url: `/order/complete/${p.params.id}`,
    method: "PUT",
  }),
);

export const startWorkOnOrder = createInternalRequest<{
  params: { id: number };
}>((p) => ({
  url: `/order/to-in-progress/${p.params.id}`,
  method: "PUT",
}));

export const getPackages = createInternalRequest<void, Result<Package[]>>({
  url: "/packages",
});

export const getPackagesTotal = createInternalRequest<
  { body: number[] },
  Result<{ total_time: string; total_price: string }>
>((p) => ({
  url: "/packages/info",
  method: "POST",
  body: p.body,
}));

export const getRoles = createInternalRequest<void, Result<Role[]>>({
  url: '/user/roles'
});

export const getUsersList = createInternalRequest<{ body: any }, Result<UserListDto[]>>((p) => ({
  url: '/user/users-list',
  method: 'POST',
  body: p.body,
}));