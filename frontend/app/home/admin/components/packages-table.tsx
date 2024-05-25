import {
  useCreatePackage,
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
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  useDisclosure,
} from "@nextui-org/react";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { PackageDto } from "@/shared/types";
import { humanTime } from "@/shared/lib/dates";
import { useMap } from "usehooks-ts";
import { useForm } from "@/shared/lib/useForm";

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

const Actions = ({ item }: { item: PackageDto }) => {
  const deletePackage = useDeletePackage();
  const updatePackage = useUpdatePackage();
  const [currKey, setCurrKey] = useState<keyof typeof modals>();

  const handleDropDown = (k: string) => {
    switch (k) {
      case "delete": {
        deletePackage.mutate({ id: item.id });
        break;
      }
      case "restore": {
        updatePackage.mutate({ id: item.id, updatee: { deleted: null } });
        break;
      }
      case "edit": {
        onOpen()
        setCurrKey("edit");
        break;
      }
      default: {
      }
    }
  };

  const { isOpen, onClose, onOpenChange, onOpen } = useDisclosure();
  const modals = {
    edit: () => (
      <EditPackage
        pack={item}
        isOpen={isOpen}
        onClose={onClose}
        onOpenChange={onOpenChange}
      />
    ),
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
      {currKey ? modals[currKey]() : null}
    </div>
  );
};

const AddPackage = () => {
  const { isOpen, onClose, onOpenChange, onOpen } = useDisclosure();
  const createPackage = useCreatePackage();
  const { getValue, setValue, values } = useForm<PackageDto>();

  const handleCreatePackage = () => {
    createPackage.mutate(values, {
      onSuccess: () => {
        onClose();
      },
    });
  };

  return (
    <>
      <Button onPress={onOpen}>Добавить услугу</Button>
      <Modal onOpenChange={onOpenChange} isOpen={isOpen}>
        <ModalContent>
          <ModalHeader>Новая услуга</ModalHeader>
          <ModalBody>
            <Input
              value={getValue("name")}
              onValueChange={setValue("name")}
              label={"Название услуги"}
            />
            <Input
              value={getValue("price")}
              onValueChange={setValue("price")}
              label={"Цена"}
            />
            <Input
              value={getValue("duration")}
              onValueChange={setValue("duration")}
              label={"Время"}
            />
          </ModalBody>
          <ModalFooter>
            <Button
              isLoading={createPackage.isPending}
              onPress={handleCreatePackage}
              color={'primary'}
            >
              Добавить
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

const EditPackage = ({ pack, ...other }: any) => {
  const updatePackage = useUpdatePackage();
  const { getValue, setValue, values } = useForm<PackageDto>(pack);
  const { onClose, onOpenChange, isOpen } = other as any;

  const handleFormSubmit = () => {
    delete values.id;

    updatePackage.mutate(
      { id: pack.id, updatee: values },
      {
        onSuccess: () => {
          onClose();
        },
      },
    );
  };

  return (
    <Modal onOpenChange={onOpenChange} isOpen={isOpen}>
      <ModalContent>
        <ModalHeader>{pack.name}</ModalHeader>
        <ModalBody>
          <Input
            value={getValue("name")}
            onValueChange={setValue("name")}
            label={"Название услуги"}
          />
          <Input
            value={getValue("price")}
            onValueChange={setValue("price")}
            label={"Цена"}
          />
          <Input
            value={getValue("duration")}
            onValueChange={setValue("duration")}
            label={"Время"}
          />
        </ModalBody>
        <ModalFooter>
          <Button
            isLoading={updatePackage.isPending}
            onPress={handleFormSubmit}
            color={'primary'}
          >
            Редактировать
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
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

  const topContent = (
    <div>
      <AddPackage />
    </div>
  );

  return (
    <Table topContent={topContent}>
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
