"use client";

import {
  useChangeOrderStatus,
  useLoadInProgressOrders, useLoadOrders,
} from '@/shared/model/orders';
import {
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  Pagination
} from "@nextui-org/react";
import { OrderDto } from "@/shared/types";
import { useCallback, useMemo, useState } from "react";
import { Chip } from "@nextui-org/chip";
import { format } from "date-fns";

import { humanTime, toLocalTime } from '@/shared/lib/dates';
import { PackagesList } from "@/app/components/entities/packages-list";
import { statusMap } from '@/shared/lib/statusMap';


export default function UserPage() {
  const { data: orders, isLoading } = useLoadOrders();

  const renderCell = useCallback(
    (item: OrderDto, columnKey: any) => {
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
        case "status": {
          return (
            <Chip color={statusMap[cellValue][1]}>
              {statusMap[cellValue][0]}
            </Chip>
          );
        }
        case 'total_time': {
          return humanTime(cellValue)
        }
        case 'total_price': {
          return <span>{cellValue}Р</span>
        }
        default:
          return cellValue;
      }
    }, []
  );

  const [page, setPage] = useState(1);
  const rowsPerPage = 5;

  const pages = Math.ceil((orders?.data || []).length / rowsPerPage);

  const items = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;

    return (orders?.data || []).slice(start, end);
  }, [page, orders?.data]);

  return (
    <Table
      className={"w-2/3"}
      bottomContent={
        <div className="flex w-full justify-center">
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
      }
    >
      <TableHeader>
        <TableColumn key={"id"}>ID</TableColumn>
        <TableColumn key={"start_at"}>Время</TableColumn>
        <TableColumn key={"package_ids"}>Услуги</TableColumn>
        <TableColumn align={"end"} key={"status"}>
          Статус
        </TableColumn>
        <TableColumn key={'total_price'}>Цена</TableColumn>
        <TableColumn key={'total_time'}>Время</TableColumn>
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
}
