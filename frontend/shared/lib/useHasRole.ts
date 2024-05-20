import { useGetProfile } from "@/shared/model/user";
import { UserRole } from "@/shared/types";

export const useHasRole = () => {
  const { data: profile } = useGetProfile();
  const roles = profile?.roles;

  if (!roles?.length) {
    return () => false;
  }

  const rolesSet = new Set([...roles.map((r) => r.name)]);

  return (check: UserRole["name"][]) =>
    check.filter((r) => rolesSet.has(r)).length > 0;
};
