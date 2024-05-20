import { useQuery } from "@tanstack/react-query";
import { getBoxesQueue } from "@/shared/api";

export const useGetBoxesQueue = () => {
  return useQuery({
    queryFn: () => getBoxesQueue(),
    queryKey: [{ key: "queue" }],
    refetchInterval: 5000,
  });
};
