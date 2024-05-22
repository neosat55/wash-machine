import {
  Button,
  Checkbox,
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
import { useGetPackages, useGetPackagesInfo } from "@/shared/model/packages";
import { useMap } from "usehooks-ts";
import { useCreateOrder } from "@/shared/model/orders";
import { humanTime } from "@/shared/lib/dates";
import { useGetBonuses } from "@/shared/model/user";

const toNumberArray = (set: Set<any>) => {
  return [...set.entries()].map((e) => Number(e[0]));
};

const Price = ({ useBonuses, bonusAmount, price }: any) => {
  if (useBonuses) {
    let newPrice = price - bonusAmount

    if (newPrice < 0) {
      newPrice = 0;
    }

    return (
      <span>
        Цена - <span className={"line-through"}>{price}Р</span>
        <span> {newPrice}Р</span>
      </span>
    );
  }

  return <span>Цена - {price}Р</span>;
};

const OrderForm = ({ form, actions }: any) => {
  const { data: packages, isLoading } = useGetPackages();
  const { data: bonuses } = useGetBonuses();
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
      {bonuses?.data?.amount ? (
        <Checkbox
          isSelected={form.get("use_bonuses")}
          onValueChange={(v) => actions.set("use_bonuses", v)}
          title={`У вас есть {bonuses.data.amount} бонусов. Хотите использовать?`}
        >
          У вас есть {bonuses.data.amount} бонусов. Хотите использовать?
        </Checkbox>
      ) : null}
      {form.get("packages")?.size > 0 && (
        <div className={"flex flex-col gap-2"}>
          <Price
            useBonuses={form.get("use_bonuses")}
            bonusAmount={bonuses?.data?.amount || 0}
            price={total?.data.total_price}
          />
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
      use_bonuses: form.get("use_bonuses"),
    };

    createOrder.mutate(
      {
        packages: body.packages,
        start_at: body.start_at,
        use_bonuses: body.use_bonuses,
      },
      {
        onSuccess: onClose,
      },
    );
  };

  return (
    <div className={"p-2"}>
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
