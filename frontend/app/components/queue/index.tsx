import { useGetBoxesQueue } from "@/shared/model/boxes";
import clsx from 'clsx';

export const CurrQueue = () => {
  const { data: queue } = useGetBoxesQueue();

  let level: string = '';
  const queueNum = queue?.data || 0;

  if (queueNum <= 5) {
    level = 'success';
  } else if (queueNum <= 10) {
    level = 'warning';
  } else {
    level = 'danger';
  }

  return (
    <div className={clsx('border rounded-md p-2 mb-3', {[`text-${level}`]: level !== ''})}>
      Текущая очередь: <span className={"font-bold"}>{queue?.data}</span>
    </div>
  );
};
