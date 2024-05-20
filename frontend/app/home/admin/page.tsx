"use client";

import { Tab, Tabs } from "@nextui-org/react";
import { TotalTable } from "@/app/home/admin/components/total-table";
import { MonthTable } from "@/app/home/admin/components/month-table";
import { UsersTable } from "@/app/home/admin/components/users-table";

export default function AdminPage() {
  return (
    <div className={"w-full flex items-center flex-col"}>
      <Tabs>
        <Tab className={"w-full"} title={"Общий отчёт"}>
          <TotalTable />
        </Tab>
        <Tab title={"Отчёт по месяцам"}>
          <MonthTable />
        </Tab>
        <Tab className={'w-full'} title={"Пользователи"}>
          <UsersTable />
        </Tab>
      </Tabs>
    </div>
  );
}
