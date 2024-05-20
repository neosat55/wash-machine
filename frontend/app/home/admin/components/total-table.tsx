"use client";

import {
  useAllOrders,
} from "@/shared/model/orders";
import {
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  Pagination,
  Select,
  SelectItem,
} from "@nextui-org/react";
import { OrderDto } from "@/shared/types";
import { useCallback, useMemo, useState } from "react";
import { Chip } from "@nextui-org/chip";
import { format } from "date-fns";

import { humanTime, toLocalTime } from "@/shared/lib/dates";
import { PackagesList } from "@/app/components/entities/packages-list";
import { statusMap } from "@/shared/lib/statusMap";
import { useGetPackages } from "@/shared/model/packages";
import { useMap } from "usehooks-ts";
import { setToArray } from '@/shared/lib/sets';

export const VerticalDotsIcon = ({
  size = 24,
  width,
  height,
  ...props
}: any) => (
  <svg
    aria-hidden="true"
    fill="none"
    focusable="false"
    height={size || height}
    role="presentation"
    viewBox="0 0 24 24"
    width={size || width}
    {...props}
  >
    <path
      d="M12 10c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0-6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 12c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"
      fill="currentColor"
    />
  </svg>
);

const filterHandler = {
  status: (v: Set<string>) => setToArray(v),
  packages: (s: Set<string>) => setToArray(s, (v) => Number(v)),
}

export const TotalTable = () => {
  const [filters, filtersActions] = useMap();
  const { data: orders, isLoading } = useAllOrders(
    [...filters.entries()].reduce((a, b) => {
      // @ts-ignore
      a[b[0] as string] = filterHandler[b[0]](b[1]);

      return a;
    }, {}),
  );

  const renderCell = useCallback((item: OrderDto, columnKey: any) => {
    // @ts-ignore
    const cellValue = item[columnKey] as any;

    switch (columnKey) {
      case "package_ids": {
        return <PackagesList ids={cellValue as any} />;
      }
      case "start_at": {
        return (
          <span className={""}>
            {format(toLocalTime(cellValue), "HH:mm yyyy-MM-dd")}
          </span>
        );
      }
      case "total_time": {
        return humanTime(cellValue);
      }
      case "total_price": {
        return <span>{cellValue}Р</span>;
      }
      case "status": {
        return (
          <Chip color={statusMap[cellValue][1]}>{statusMap[cellValue][0]}</Chip>
        );
      }
      default:
        return cellValue;
    }
  }, []);

  const [page, setPage] = useState(1);
  const rowsPerPage = 8;

  const pages = Math.ceil((orders?.data || []).length / rowsPerPage);

  const items = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;

    return (orders?.data || []).slice(start, end);
  }, [page, orders?.data]);

  const { data: packages } = useGetPackages();

  const topContent = useMemo(() => {
    return (
      <div className={"flex flex-col gap-2"}>
        <div className={"flex gap-2"}>
          <Select
            className={"min-w-36 w-fit"}
            selectionMode={"multiple"}
            label={"Статус"}
            defaultSelectedKeys={[
              "created",
              "in-progress",
              "cancelled",
              "completed",
            ]}
            selectedKeys={filters.get("status") as Set<string>}
            onSelectionChange={(v: any) => filtersActions.set("status", v)}
          >
            <SelectItem key={"created"}>{"Создано"}</SelectItem>
            <SelectItem key={"in-progress"}>{"В работе"}</SelectItem>
            <SelectItem key={"cancelled"}>{"Отменено"}</SelectItem>
            <SelectItem key={"completed"}>{"Завершено"}</SelectItem>
          </Select>
          <Select
            className={"min-w-36 w-fit"}
            selectionMode={"multiple"}
            label={"Услуги"}
            items={packages?.data || []}
            selectedKeys={filters.get("packages") as Set<string>}
            onSelectionChange={(v: any) => filtersActions.set("packages", v)}
          >
            {(item) => <SelectItem key={item.id}>{item.name}</SelectItem>}
          </Select>
        </div>
        <div>
          <span className={"text-sm font-light"}>
            Заказов - {orders?.data.length}
          </span>
        </div>
      </div>
    );
  }, [orders?.data.length, packages?.data, filters, filtersActions]);

  const bottomContent = useMemo(() => {
    return (
      <div className="flex w-full justify-between">
        <div
          className={
            "flex flex-col gap-2 font-light text-sm leading-5 tracking-wide"
          }
        >
          <span>
            Итоговая сумма -{" "}
            {orders?.data.reduce((a, b) => a + Number(b.total_price), 0) || 0}Р
          </span>
          <span>
            Общее время работы -{" "}
            {humanTime(
              orders?.data.reduce((a, b) => a + Number(b.total_time), 0) || 0,
            )}
          </span>
        </div>
        <Pagination
          isCompact
          showControls
          showShadow
          color="secondary"
          page={page}
          total={pages}
          onChange={(page) => setPage(page)}
        />
      </div>
    );
  }, [page, pages, orders?.data]);

  return (
    <Table
      fullWidth={true}
      topContent={topContent}
      topContentPlacement={"outside"}
      bottomContent={bottomContent}
    >
      <TableHeader>
        <TableColumn key={"id"}>ID</TableColumn>
        <TableColumn key={"start_at"}>Время</TableColumn>
        <TableColumn key={"package_ids"}>Услуги</TableColumn>
        <TableColumn key={"status"}>Статус</TableColumn>
        <TableColumn key={"total_price"}>Цена</TableColumn>
        <TableColumn key={"total_time"}>Время</TableColumn>
      </TableHeader>
      <TableBody
        isLoading={isLoading}
        emptyContent={"Заказов нет"}
        items={items}
      >
        {(item) => (
          <TableRow key={item.id}>
            {(columnKey) => (
              <TableCell>{renderCell(item, columnKey)}</TableCell>
            )}
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
};
