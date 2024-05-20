"use client";

import React from "react";
import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  NavbarMenuToggle,
  NavbarMenu,
  NavbarMenuItem,
  Dropdown,
  DropdownTrigger,
  Avatar,
  DropdownMenu,
  DropdownItem,
} from "@nextui-org/react";
import Link from "next/link";
import { useGetProfile, useToken } from "@/shared/model/user";
import { useHasRole } from "@/shared/lib/useHasRole";
import { UserRole } from "@/shared/types";
import { usePathname } from 'next/navigation';

const Profile = () => {
  const { data } = useGetProfile();
  const { logout } = useToken();

  const handleLogout = () => {
    logout();
  };

  return (
    <NavbarContent as={"div"} justify="end">
      <Dropdown placement="bottom-end">
        <DropdownTrigger>
          <Avatar
            isBordered
            as="button"
            className="transition-transform"
            color="secondary"
            // name={data?.first_name + data?.last_name}
            size="sm"
            src="https://i.pravatar.cc/150?u=a042581f4e29026704d"
          />
        </DropdownTrigger>
        <DropdownMenu aria-label="Profile Actions" variant="flat">
          <DropdownItem key="profile" className="h-14 gap-2">
            <p className="font-semibold">Вошли как</p>
            <p className="font-semibold">{data?.email}</p>
          </DropdownItem>
          <DropdownItem key="settings" href={"/home/profile"}>
            Мой профиль
          </DropdownItem>
          <DropdownItem onPress={handleLogout} key="logout" color="danger">
            Выйти
          </DropdownItem>
        </DropdownMenu>
      </Dropdown>
    </NavbarContent>
  );
};

export const WashMachineNavbar = () => {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const { isLoggedIn } = useToken();
  const hasRole = useHasRole();
  const pathname = usePathname();

  const menuItems: { href: string; title: string; role: UserRole["name"][] }[] = [
    { href: "/home/admin", title: "Админ панель", role: ["admin"] },
    {
      href: "/home/worker",
      title: "Текущие Заказы",
      role: ["admin", "worker"],
    },
    {
      href: "/home/user",
      title: "Мои заказы",
      role: ["admin", "worker", "user"],
    },
  ];

  return (
    <Navbar onMenuOpenChange={setIsMenuOpen}>
      <NavbarContent>
        <NavbarMenuToggle
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          className="sm:hidden"
        />
        <NavbarBrand as={Link} href="/home">
          <p className="font-bold text-inherit">WashMachine</p>
        </NavbarBrand>
      </NavbarContent>

      <NavbarContent className="hidden sm:flex gap-4" justify="center">
        {menuItems
          .filter((it) => hasRole(it.role))
          .map((item, index) => (
            <NavbarMenuItem key={`${item}-${index}`} isActive={pathname === item.href}>
              <Link
                color={
                  index === 2
                    ? "primary"
                    : index === menuItems.length - 1
                      ? "danger"
                      : "foreground"
                }
                className="w-full"
                href={item.href}
              >
                {item.title}
              </Link>
            </NavbarMenuItem>
          ))}
      </NavbarContent>
      {!isLoggedIn() ? (
        <NavbarContent justify="end">
          <NavbarItem className="hidden lg:flex">
            <Link href="/register">Зарегистрироваться</Link>
          </NavbarItem>
          <NavbarItem>
            <Link href="/auth">Войти</Link>
          </NavbarItem>
        </NavbarContent>
      ) : (
        <Profile />
      )}
      <NavbarMenu>
        {menuItems
          .filter((it) => hasRole(it.role))
          .map((item, index) => (
            <NavbarMenuItem key={`${item}-${index}`}>
              <Link
                color={
                  index === 2
                    ? "primary"
                    : index === menuItems.length - 1
                      ? "danger"
                      : "foreground"
                }
                className="w-full"
                href={item.href}
              >
                {item.title}
              </Link>
            </NavbarMenuItem>
          ))}
      </NavbarMenu>
    </Navbar>
  );
};
