import { Chip } from "@nextui-org/chip";
import { useGetPackages } from "@/shared/model/packages";
import { PackageDto } from "@/shared/types";

export const PackagesList = ({ ids }: { ids: number[] }) => {
  const { data: packages } = useGetPackages();

  return (
    <div className={'flex flex-col gap-2'}>
      {packages?.data
        .filter((it: PackageDto) => ids.includes(it.id))
        .map((it: PackageDto) => <Chip key={it.id}>{it.name}</Chip>)}
    </div>
  );
};
