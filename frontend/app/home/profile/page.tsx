"use client";

import { Button, Input, Tab, Tabs } from "@nextui-org/react";
import {
  useCreateCar,
  useDeleteCar,
  useGetCars,
  useGetProfile,
  useUpdateCar, useUpdateProfile,
} from '@/shared/model/user';
import { useEffect, useState } from 'react';
import { CarDto, ProfileResponse } from "@/shared/types";
import { useMap } from "usehooks-ts";

const CarInput = ({ car }: { car: CarDto }) => {
  const updateCar = useUpdateCar();
  const deleteCar = useDeleteCar();
  const [carNumber, setCarNumber] = useState(car.car_number);

  if (!carNumber.length) {
  }

  return (
    <Input
      variant={"faded"}
      color={"secondary"}
      value={carNumber}
      onValueChange={setCarNumber}
      onBlur={() => {
        if (!carNumber.length) {
          deleteCar.mutate({ id: car.id });
        } else {
          updateCar.mutate({ id: car.id, body: { car_number: carNumber } });
        }
      }}
    />
  );
};

const Garage = () => {
  const createCar = useCreateCar();

  const { data: cars } = useGetCars();
  const [carNumber, setCarNumber] = useState("");

  return (
    <div className={"flex flex-col gap-2"}>
      <div className={"flex flex-col gap-2"}>
        {cars?.data.map((car) => <CarInput key={car.id} car={car} />)}
      </div>

      <Input
        placeholder={"Введите номер машины"}
        value={carNumber}
        onValueChange={setCarNumber}
      />
      <Button
        color={"primary"}
        variant={"bordered"}
        onPress={() => {
          createCar.mutate(
            { body: { car_number: carNumber } },
            {
              onSuccess: () => {
                setCarNumber("");
              },
            },
          );
        }}
      >
        Добавить машину
      </Button>
    </div>
  );
};

const useForm = <T = object>(data: T) => {
  const [form, formActions] = useMap<keyof T, any>();

  const [touched, setTouched] = useState<Record<keyof T, any>>(
    // @ts-ignore
    {},
  );

  useEffect(() => {
    formActions.setAll(Object.entries(data || {}) as any)
  }, [data])

  const setValue = (k: keyof T) => (v: any) => {
    formActions.set(k, v);
    touched[k] = true;
  };

  const getValue = (k: keyof T) => {
    return form.get(k);
  };

  return {
    getValue,
    setValue,
    values: Object.fromEntries(form.entries()),
    isTouched: Object.keys(touched).length > 0,
  };
};

const Profile = () => {
  const {data: profile} = useGetProfile();
  // @ts-ignore
  const { getValue, setValue, isTouched, values } = useForm<ProfileResponse>(profile);
  const updateProfile = useUpdateProfile();

  return (
    <div className={"flex flex-col gap-2"}>
      <Input
        label={"E-mail"}
        value={getValue("email")}
        onValueChange={setValue("email")}
      />
      <Input
        label={"Имя"}
        value={getValue("first_name")}
        onValueChange={setValue("first_name")}
      />
      <Input
        label={"Фамилия"}
        value={getValue("last_name")}
        onValueChange={setValue("last_name")}
      />
      <Input
        label={"Телефон"}
        value={getValue("phone")}
        onValueChange={setValue("phone")}
      />
      <Button
        isDisabled={!isTouched}
        fullWidth={true}
        color={"primary"}
        variant={"faded"}
        onPress={() => {
          updateProfile.mutate(values)
        }}
      >
        Сохранить изменения
      </Button>
    </div>
  );
};

export default function ProfilePage() {
  return (
    <div className={"w-full flex items-center flex-col"}>
      <Tabs>
        <Tab title={"Профиль"}>
          <Profile />
        </Tab>
        <Tab title={"Гараж"}>
          <Garage />
        </Tab>
      </Tabs>
    </div>
  );
}
