"use client";

import { Button, Input } from "@nextui-org/react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/shared/model/user";
import Link from 'next/link';
import Image from 'next/image';

export default function AuthPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();
  const auth = useAuth();

  const handleLogin = () => {
    auth.mutate(
      { login: username, password },
      {
        onSuccess: () => {
          console.log("success");
          router.push("/home");
        },
      },
    );
  };

  return (
    <div className={"flex flex-col w-full h-full items-center justify-center"}>
      <Image src={'/logo.png'} alt={'Logo'} width={150} height={150} />

      <div className={"flex flex-col sm:w-2/3 lg:w-1/3 md:w-2/4 gap-2"}>
        {auth.isError && (
          <span className={"text-red-600"}>Неверный логин или пароль</span>
        )}
        <Input
          variant={"bordered"}
          label={"Логин"}
          placeholder={"Введите логин"}
          value={username}
          onValueChange={setUsername}
        />
        <Input
          variant={"bordered"}
          type={"password"}
          label={"Пароль"}
          placeholder={"Введите пароль"}
          value={password}
          onValueChange={setPassword}
        />
        <div className={'w-full flex gap-4'}>
          <Button
            as={Link}
            className={'flex-1'}
            variant={'flat'}
            color={"secondary"}
            href={'/register'}
          >
            {"Зарегистрироваться"}
          </Button>
          <Button
            className={'flex-1'}
            isLoading={auth.isPending}
            color={"primary"}
            onPress={handleLogin}
          >
            {"Войти"}
          </Button>
        </div>
      </div>
    </div>
  );
}
