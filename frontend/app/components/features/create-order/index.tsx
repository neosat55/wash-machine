import {
  Button,
  DateInput,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Select,
  SelectItem,
  useDisclosure,
} from "@nextui-org/react";
import { useState } from "react";
import { useGetPackages, useGetPackagesInfo } from "@/shared/model/packages";
import { formatDuration, minutesToHours } from "date-fns";
import { ru } from "date-fns/locale";
import { useMap } from "usehooks-ts";
import { useCreateOrder } from "@/shared/model/orders";
import { humanTime } from '@/shared/lib/dates';

const toNumberArray = (set: Set<any>) => {
  return [...set.entries()].map((e) => Number(e[0]));
};

const OrderForm = ({ form, actions }: any) => {
  const { data: packages, isLoading } = useGetPackages();
  const { data: total } = useGetPackagesInfo(
    toNumberArray(form.get("packages") || new Set([])),
  );

  return (
    <>
      <Input
        value={form.get("car_number")}
        onValueChange={(v) => actions.set("car_number", v)}
        isRequired={true}
        label={"Номер машины"}
      />
      <DateInput
        value={form.get("start_at")}
        onChange={(v) => actions.set("start_at", v)}
        isRequired={true}
        label={"Дата записи"}
        hourCycle={24}
        granularity={"minute"}
      />
      <Select
        isLoading={isLoading}
        items={packages?.data || []}
        isRequired={true}
        selectionMode={"multiple"}
        label={"Услуги"}
        selectedKeys={form.get("packages")}
        onSelectionChange={(k) => actions.set("packages", k)}
      >
        {(item) => (
          <SelectItem
            key={item.id}
            value={item.id}
            description={`Время - ${humanTime(item.duration)}, Цена - ${item.price}Р`}
          >
            {item.name}
          </SelectItem>
        )}
      </Select>
      {form.get("packages")?.size > 0 && (
        <div className={"flex flex-col gap-2"}>
          <span>Цена - {total?.data.total_price}Р</span>
          <span>Общее время - {humanTime(Number(total?.data.total_time))}</span>
        </div>
      )}
    </>
  );
};

export const CreateOrder = () => {
  const { onClose, isOpen, onOpen, onOpenChange } = useDisclosure();
  const [form, actions] = useMap<string, any>();
  const createOrder = useCreateOrder();

  const handleCreate = () => {
    const body = {
      car_number: form.get("car_number"),
      start_at: form.get("start_at").toDate(),
      packages: toNumberArray(form.get("packages")),
    };

    createOrder.mutate(
      {
        packages: body.packages,
        start_at: body.start_at,
      },
      {
        onSuccess: onClose,
      },
    );
  };

  return (
    <div className={'p-2'}>
      <Button color={"primary"} onPress={onOpen} isIconOnly={true}>
        +
      </Button>
      <Modal onOpenChange={onOpenChange} isOpen={isOpen}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader>Записаться</ModalHeader>
              <ModalBody>
                <OrderForm form={form} actions={actions} />
              </ModalBody>
              <ModalFooter>
                <Button
                  isLoading={createOrder.isPending}
                  onPress={handleCreate}
                >
                  Отправить
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
};
