import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  cancelOrder,
  completeOrder,
  createOrder, loadAllOrders,
  loadInProgressOrders,
  loadUserOrders,
  startWorkOnOrder,
} from '@/shared/api';
import { CreateOrder } from "@/shared/types";

export const useCreateOrder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (vars: CreateOrder) => createOrder({ body: vars }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [{ key: "orders" }],
      });

      queryClient.invalidateQueries({
        queryKey: [{ key: "orders_in_progress" }],
      });

      queryClient.invalidateQueries({
        queryKey: [{ key: "queue" }],
      });
    },
  });
};

export const useLoadOrders = () => {
  return useQuery({
    queryFn: () => loadUserOrders(),
    queryKey: [{ key: "orders" }],
  });
};

export const useLoadInProgressOrders = () => {
  return useQuery({
    queryFn: () => loadInProgressOrders(),
    queryKey: [{ key: "orders_in_progress" }],
  });
};

export const useAllOrders = (filters: any) => {
  return useQuery({
    queryFn: ({ queryKey }) =>
      loadAllOrders({ body: { filters: queryKey[0].filters } }),
    queryKey: [{ key: "orders", filters }],
  });
};

export const useChangeOrderStatus = () => {
  const fns = {
    cancel: cancelOrder,
    // delete: deleteOrder,
    start_work: startWorkOnOrder,
    complete: completeOrder,
  };

  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ key, id }: { key: keyof typeof fns; id: number }) =>
      fns[key]({ params: { id } }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [{ key: "orders" }],
      });

      queryClient.invalidateQueries({
        queryKey: [{ key: "orders_in_progress" }],
      });
    },
  });
};
