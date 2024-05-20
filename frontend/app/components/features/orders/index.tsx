import { useLoadOrders } from "@/shared/model/orders";
import { Order } from "@/app/components/entities/order";

export const Orders = () => {
  const { data: orders } = useLoadOrders();

  if (!orders?.data.length) {
    return <div>Пусто</div>;
  }

  return (
    <div className={"w-full flex flex-wrap gap-3"}>
      {orders?.data.map((o) => <Order order={o} />)}
    </div>
  );
};
