"use client";

import { PropsWithChildren } from "react";
import { NextUIProvider } from "@nextui-org/react";
import { useRouter } from "next/navigation";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const client = new QueryClient();

export const BaseLayout = ({ children }: PropsWithChildren) => {
  const router = useRouter();

  return (
    <QueryClientProvider client={client}>
      <NextUIProvider
        locale={"ru-RU"}
        className={"h-full w-full"}
        navigate={router.push}
      >
        {children}
      </NextUIProvider>
    </QueryClientProvider>
  );
};
