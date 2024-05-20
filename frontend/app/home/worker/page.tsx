"use client";

import {
  useChangeOrderStatus,
  useLoadInProgressOrders,
} from "@/shared/model/orders";
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
import { addHours, format } from "date-fns";

import { toLocalTime } from "@/shared/lib/dates";
import { PackagesList } from "@/app/components/entities/packages-list";
import { statusMap } from '@/shared/lib/statusMap';

const VerticalDotsIcon = ({
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

export default function WorkerPage() {
  const { data: orders, isLoading } = useLoadInProgressOrders();
  const changeStatus = useChangeOrderStatus();

  const renderCell = useCallback(
    (item: OrderDto, columnKey: any) => {
      // @ts-ignore
      const cellValue = item[columnKey] as any;

      switch (columnKey) {
        case "actions":
          return (
            <div className="relative flex justify-end items-center gap-2">
              <Dropdown>
                <DropdownTrigger>
                  <Button isIconOnly size="sm" variant="light">
                    <VerticalDotsIcon className="text-default-300" />
                  </Button>
                </DropdownTrigger>
                <DropdownMenu
                  onAction={(key: any) =>
                    changeStatus.mutate({ key, id: item.id })
                  }
                >
                  <DropdownItem key={"start_work"} className={"text-info"}>
                    Взять в работу
                  </DropdownItem>
                  <DropdownItem key={"complete"} className={"text-success"}>
                    Выполнено
                  </DropdownItem>
                  <DropdownItem key={"cancel"} className={"text-warning"}>
                    Отменить
                  </DropdownItem>
                  <DropdownItem key={"delete"} className={"text-danger"}>
                    Удалить
                  </DropdownItem>
                </DropdownMenu>
              </Dropdown>
            </div>
          );
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
        default:
          return cellValue;
      }
    },
    [changeStatus],
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
        <TableColumn key={"actions"}>Действия</TableColumn>
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
