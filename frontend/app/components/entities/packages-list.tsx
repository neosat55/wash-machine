import { Chip } from "@nextui-org/chip";
import { useGetPackages } from "@/shared/model/packages";
import { Package } from "@/shared/types";

export const PackagesList = ({ ids }: { ids: number[] }) => {
  const { data: packages } = useGetPackages();

  return (
    <div className={'flex flex-col gap-2'}>
      {packages?.data
        .filter((it: Package) => ids.includes(it.id))
        .map((it: Package) => <Chip key={it.id}>{it.name}</Chip>)}
    </div>
  );
};
