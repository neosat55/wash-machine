import { Card, CardBody, CardHeader } from "@nextui-org/card";
import { OrderDto } from "@/shared/types";
import { PackagesList } from '@/app/components/entities/packages-list';
import { fmtDate, fmtTime } from '@/shared/lib/dates';
import { statusMap } from '@/shared/lib/statusMap';

export const Order = ({ order }: { order: OrderDto }) => {
  return (
    <Card fullWidth={true}>
      <CardHeader>{fmtTime(order.start_at)}, {fmtDate(order.start_at)}</CardHeader>
      <CardBody className={'flex gap-2'}>
        <span>
          Статус: <span className={`text-${statusMap[order.status][1]}`}>{statusMap[order.status][0]}</span>
        </span>
        <PackagesList ids={order.package_ids}/>
      </CardBody>
    </Card>
  );
};
