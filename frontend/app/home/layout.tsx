"use client";

import { WashMachineNavbar } from "@/app/components/navbar";
import { ReactNode, useEffect, useState } from "react";

export default function HomeLayout({ children }: { children: ReactNode }) {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return null;
  }

  return (
    <>
      <WashMachineNavbar />
      <main
        className="flex flex-col items-center justify-between px-24"
        style={{ height: "calc(100vh - 64px)" }}
      >
        {children}
      </main>
    </>
  );
}
