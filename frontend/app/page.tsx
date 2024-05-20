"use client";

import { useToken } from "@/shared/model/user";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Home() {
  const { isLoggedIn } = useToken();
  const router = useRouter();

  useEffect(() => {
    if (!isLoggedIn()) {
      router.replace("/auth");
    } else {
      router.replace("/home");
    }
  });
}
