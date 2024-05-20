"use client";

import { useToken } from "@/shared/model/user";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export const useAuthGuard = () => {
  const { isLoggedIn } = useToken();
  const router = useRouter();

  useEffect(() => {
    if (!isLoggedIn()) {
      router.replace("/auth");
    }
  });
};
