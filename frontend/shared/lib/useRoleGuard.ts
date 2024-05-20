"use client";

import { UserRole } from "@/shared/types";
import { notFound } from "next/navigation";
import { useHasRole } from "@/shared/lib/useHasRole";
import { useEffect } from "react";

export const useRoleGuard = (check: UserRole["name"][]) => {
  const hasRole = useHasRole();

  useEffect(() => {
    if (!hasRole(check)) {
      return notFound();
    }
  });
};
