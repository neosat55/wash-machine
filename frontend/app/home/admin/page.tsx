"use client";

import { Tab, Tabs } from "@nextui-org/react";
import { TotalTable } from "@/app/home/admin/components/total-table";
import { MonthTable } from "@/app/home/admin/components/month-table";
import { UsersTable } from "@/app/home/admin/components/users-table";
import { PackagesTable } from "@/app/home/admin/components/packages-table";
import { BoxesTable } from "@/app/home/admin/components/boxes-table";

export default function AdminPage() {
  return (
    <div className={"w-full flex items-center flex-col"}>
      <Tabs>
        <Tab className={"w-full"} title={"Общий отчёт"}>
          <TotalTable />
        </Tab>
        <Tab className={'w-full'} title={"Отчёт по месяцам"}>
          <MonthTable />
        </Tab>
        <Tab className={"w-full"} title={"Пользователи"}>
          <UsersTable />
        </Tab>
        <Tab className={'w-full'} title={"Услуги"}>
          <PackagesTable />
        </Tab>
        <Tab title={"Боксы"}>
          <BoxesTable />
        </Tab>
      </Tabs>
    </div>
  );
}
