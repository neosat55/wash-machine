"use client";

import { useState } from "react";
import { Button, Input } from "@nextui-org/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth, useRegister } from "@/shared/model/user";

export default function RegisterPage() {
  const register = useRegister();
  const auth = useAuth();
  const router = useRouter();

  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [login, setLogin] = useState<string>("");
  const [firstName, setFirstName] = useState<string>("");
  const [lastName, setLastName] = useState<string>("");

  const handleRegister = () => {
    register.mutate(
      {
        password,
        email,
        firstName,
        lastName,
        login,
      },
      {
        onSuccess: (d, vars) => {
          auth.mutate(
            { login: vars.login, password: vars.password },
            {
              onSuccess: () => {
                router.push("/");
              },
            },
          );
        },
      },
    );
  };

  return (
    <div className={"flex flex-col w-full h-full items-center justify-center"}>
      <h1 className={""}>Wash Machine</h1>

      <div className={"flex flex-col sm:w-2/3 lg:w-1/3 md:w-2/4 gap-2"}>
        <Input
          isRequired
          variant={"bordered"}
          label={"Имя"}
          value={firstName}
          validate={(v) => (v.length ? null : "Имя не может быть пустым")}
          onValueChange={setFirstName}
        />
        <Input
          variant={"bordered"}
          isRequired
          label={"Фамилия"}
          value={lastName}
          validate={(v) => (v.length ? null : "Фамилия не может быть пустой")}
          onValueChange={setLastName}
        />
        <Input
          isRequired
          variant={"bordered"}
          validate={(v) => {
            if (v.includes("@") && v.includes(".")) {
              return null;
            }

            return "Введён неправильный e-mail";
          }}
          label={"Email"}
          value={email}
          onValueChange={setEmail}
        />
        <Input
          isRequired
          variant={"bordered"}
          label={"Логин"}
          validate={(v) =>
            v.length === 0 ? "Логин не может быть пустым" : null
          }
          value={login}
          onValueChange={setLogin}
        />
        <Input
          isRequired
          variant={"bordered"}
          validate={(v) => {
            if (v.length > 6) {
              return null;
            }

            return "Пароль должен содержать больше 6 символов";
          }}
          type={"password"}
          label={"Пароль"}
          value={password}
          onValueChange={setPassword}
        />
        <Input
          isRequired
          variant={"bordered"}
          validate={(v) => {
            if (v === password) {
              return null;
            }

            return "Пароли не совпадают";
          }}
          type={"password"}
          label={"Повторите пароль"}
          value={confirmPassword}
          onValueChange={setConfirmPassword}
        />
        <div className={"flex w-full gap-3"}>
          <Button
            as={Link}
            className={"w-full"}
            color={"primary"}
            type={"submit"}
            variant={"bordered"}
            href={"/auth"}
          >
            Войти
          </Button>
          <Button
            className={"w-full"}
            color={"primary"}
            type={"submit"}
            variant={"flat"}
            onPress={handleRegister}
          >
            Зарегистрироваться
          </Button>
        </div>
      </div>
    </div>
  );
}
