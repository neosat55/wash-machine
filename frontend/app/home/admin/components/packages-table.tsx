import {
  useDeletePackage,
  useGetPackages,
  useUpdatePackage,
} from "@/shared/model/packages";
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
} from "@nextui-org/react";
import React, { useCallback } from "react";
import { PackageDto } from "@/shared/types";
import { humanTime } from "@/shared/lib/dates";

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

const EditModal = () => {};

const Actions = ({ item }: { item: PackageDto }) => {
  const deletePackage = useDeletePackage();
  const updatePackage = useUpdatePackage();

  const handleDropDown = (k: string) => {
    if (k === "delete") {
      deletePackage.mutate({ id: item.id });
    }

    if (k === "restore") {
      updatePackage.mutate({ id: item.id, updatee: { deleted: null } });
    }
  };

  return (
    <div className="relative flex justify-end items-center gap-2">
      <Dropdown>
        <DropdownTrigger>
          <Button isIconOnly size="sm" variant="light">
            <VerticalDotsIcon className="text-default-300" />
          </Button>
        </DropdownTrigger>
        <DropdownMenu onAction={(k) => handleDropDown(k as string)}>
          <DropdownItem
            isReadOnly={item.deleted !== true}
            key={"restore"}
            color={"success"}
          >
            Восстановить
          </DropdownItem>
          <DropdownItem key={"edit"} color={"warning"}>
            Редактировать
          </DropdownItem>
          <DropdownItem key={"delete"} color={"danger"}>
            Удалить
          </DropdownItem>
        </DropdownMenu>
      </Dropdown>
    </div>
  );
};

export const PackagesTable = () => {
  const { data: packages, isLoading } = useGetPackages();

  const renderCell = useCallback((item: PackageDto, columnKey: any) => {
    // @ts-ignore
    const cellValue = item[columnKey] as any;

    switch (columnKey) {
      case "duration": {
        return humanTime(cellValue);
      }
      case "actions": {
        return <Actions item={item} />;
      }
      case "deleted": {
        return cellValue === true ? "Да" : "Нет";
      }
      default:
        return cellValue;
    }
  }, []);

  return (
    <Table>
      <TableHeader>
        <TableColumn key={"id"}>ID</TableColumn>
        <TableColumn key={"name"}>Наименование</TableColumn>
        <TableColumn key={"price"}>Цена</TableColumn>
        <TableColumn key={"duration"}>Время</TableColumn>
        <TableColumn key={"deleted"}>Удалён</TableColumn>
        <TableColumn key={"actions"}>{""}</TableColumn>
      </TableHeader>
      <TableBody
        isLoading={isLoading}
        emptyContent={"Услуг нет"}
        items={packages?.data || []}
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
