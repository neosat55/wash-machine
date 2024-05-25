"use client";

import { useAuthGuard } from "@/shared/lib/useAuthGuard";
import { CurrQueue } from "@/app/components/queue";
import { CreateOrder } from "@/app/components/features";
import { Orders } from "@/app/components/features/orders";

export default function HomePage() {
  useAuthGuard();

  return (
    <div className={"mb-4 w-1/2 h-full flex flex-col"}>
      <CurrQueue />
      <div className={'flex-auto overflow-auto pr-2'} style={{scrollbarWidth: 'thin', scrollMargin: '2px'}}>
        <Orders />
      </div>
      <div className={"flex justify-end"}>
        <CreateOrder />
      </div>
    </div>
  );
}
