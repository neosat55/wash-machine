import { useQuery } from "@tanstack/react-query";
import { getPackages, getPackagesTotal } from "@/shared/api";

export const useGetPackages = () => {
  return useQuery({
    queryFn: () => getPackages(),
    queryKey: ["packages"],
  });
};

export const useGetPackagesInfo = (ids: number[]) => {
  return useQuery({
    queryFn: ({ queryKey }) => getPackagesTotal({ body: queryKey[0].ids }),
    queryKey: [{ key: "packages_total", ids }],
    enabled: ids.length > 0,
  });
};
