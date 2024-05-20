import { useGetRoles } from "@/shared/model/user";
import { Chip } from "@nextui-org/chip";
import { Role } from '@/shared/types';

export const RolesList = ({ roles }: { roles: Role[] }) => {
  // const { data: roles } = useGetRoles();

  return (
    <div className={"flex flex-col gap-2"}>
      {roles.map((it) => <Chip key={it.name}>{it.label}</Chip>)}
    </div>
  );
};
