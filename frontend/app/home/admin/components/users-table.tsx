"use client";

import { useAllOrders } from "@/shared/model/orders";
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
  Tab,
  Button,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from "@nextui-org/react";
import { UserListDto } from "@/shared/types";
import React, { useCallback, useMemo, useState } from "react";

import { useGetPackages } from "@/shared/model/packages";
import { setToArray } from "@/shared/lib/sets";
import { useGetUsersList } from "@/shared/model/user";
import { RolesList } from "@/app/components/entities/roles-list";

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

const filterHandler = {
  status: (v: Set<string>) => setToArray(v),
  packages: (s: Set<string>) => setToArray(s, (v) => Number(v)),
};

const Actions = ({ user }: { user: UserListDto }) => {
  return (
    <div className="relative flex justify-end items-center gap-2">
      <Dropdown>
        <DropdownTrigger>
          <Button isIconOnly size="sm" variant="light">
            <VerticalDotsIcon className="text-default-300" />
          </Button>
        </DropdownTrigger>
        <DropdownMenu>
          <DropdownItem
            variant={"bordered"}
            color={"danger"}
            key={"start_work"}
            className={"text-info"}
          >
            Удалить пользователя
          </DropdownItem>
          <DropdownItem key={"complete"} className={"text-success"}>
            Добавить роль
          </DropdownItem>
          <DropdownItem key={"cancel"} className={"text-warning"}>
            Удалить роль
          </DropdownItem>
        </DropdownMenu>
      </Dropdown>
    </div>
  );
};

export const UsersTable = () => {
  const { data: users, isLoading } = useGetUsersList({});

  const renderCell = useCallback(
    (item: UserListDto, columnKey: keyof UserListDto | "actions") => {
      // @ts-ignore
      const cellValue: any = item[columnKey];

      switch (columnKey) {
        case "roles":
          return <RolesList roles={cellValue} />;
        case "actions":
          return <Actions user={item} />;
        default:
          return cellValue;
      }
    },
    [],
  );

  const [page, setPage] = useState(1);
  const rowsPerPage = 8;

  const pages = Math.ceil((users?.data || []).length / rowsPerPage);

  const items = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;

    return (users?.data || []).slice(start, end);
  }, [page, users?.data]);

  const { data: packages } = useGetPackages();

  // const topContent = useMemo(() => {
  //   return (
  //     <div className={"flex flex-col gap-2"}>
  //       <div className={"flex gap-2"}>
  //         <Select
  //           className={"min-w-36 w-fit"}
  //           selectionMode={"multiple"}
  //           label={"Статус"}
  //           defaultSelectedKeys={[
  //             "created",
  //             "in-progress",
  //             "cancelled",
  //             "completed",
  //           ]}
  //           selectedKeys={filters.get("status") as Set<string>}
  //           onSelectionChange={(v: any) => filtersActions.set("status", v)}
  //         >
  //           <SelectItem key={"created"}>{"Создано"}</SelectItem>
  //           <SelectItem key={"in-progress"}>{"В работе"}</SelectItem>
  //           <SelectItem key={"cancelled"}>{"Отменено"}</SelectItem>
  //           <SelectItem key={"completed"}>{"Завершено"}</SelectItem>
  //         </Select>
  //         <Select
  //           className={"min-w-36 w-fit"}
  //           selectionMode={"multiple"}
  //           label={"Услуги"}
  //           items={packages?.data || []}
  //           selectedKeys={filters.get("packages") as Set<string>}
  //           onSelectionChange={(v: any) => filtersActions.set("packages", v)}
  //         >
  //           {(item) => <SelectItem key={item.id}>{item.name}</SelectItem>}
  //         </Select>
  //       </div>
  //       <div>
  //         <span className={"text-sm font-light"}>
  //           Заказов - {orders?.data.length}
  //         </span>
  //       </div>
  //     </div>
  //   );
  // }, [users?.data.length, packages?.data]);

  const bottomContent = useMemo(() => {
    return (
      <div className="flex w-full gap-2">
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
  }, [page, pages]);

  return (
    <Table
      fullWidth={true}
      topContentPlacement={"outside"}
      bottomContent={bottomContent}
      color={"primary"}
      isStriped={true}
    >
      <TableHeader>
        <TableColumn key={"id"}>ID</TableColumn>
        <TableColumn key={"first_name"}>Имя</TableColumn>
        <TableColumn key={"last_name"}>Фамилия</TableColumn>
        <TableColumn key={"phone"}>Телефон</TableColumn>
        <TableColumn key={"roles"}>Роли</TableColumn>
        <TableColumn key={"email"}>E-mail</TableColumn>
        <TableColumn key={"actions"}>{""}</TableColumn>
      </TableHeader>
      <TableBody
        title={"Пользователи"}
        isLoading={isLoading}
        emptyContent={"Список пользователей пуст"}
        items={items}
      >
        {(item) => (
          <TableRow key={item.id}>
            {(columnKey) => (
              <TableCell>
                {renderCell(item, columnKey as keyof UserListDto)}
              </TableCell>
            )}
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
};
