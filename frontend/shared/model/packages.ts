import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createPackage,
  deletePackage,
  getPackages,
  getPackagesForCreateOrder,
  getPackagesTotal,
  updatePackage,
} from "@/shared/api";
import { PackageDto } from "@/shared/types";

export const useGetPackages = () => {
  return useQuery({
    queryFn: () => getPackages(),
    queryKey: ["packages"],
  });
};

export const useGetPackagesForCreateOrder = () => {
  return useQuery({
    queryFn: () => getPackagesForCreateOrder(),
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

export const useCreatePackage = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (vars: object) => createPackage({ body: vars }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["packages"],
      });
    },
  });
};

export const useDeletePackage = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id }: { id: number }) => deletePackage({ params: { id } }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["packages"],
      });
    },
  });
};

export const useUpdatePackage = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      updatee,
    }: {
      id: number;
      updatee: Partial<PackageDto>;
    }) => updatePackage({ params: { id }, body: updatee }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["packages"],
      });
    },
  });
};
