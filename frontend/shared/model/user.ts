import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  auth,
  createCar,
  deleteCar,
  getCars,
  getRoles,
  getUserBonuses,
  getUsersList,
  profile,
  register,
  updateCar,
  updateProfile,
} from "@/shared/api";
import { AuthBody, RegisterBody } from "@/shared/types";
import { useLocalStorage } from "usehooks-ts";

export const useToken = () => {
  const [token, setToken, removeToken] = useLocalStorage<string | null>(
    "access_token",
    null,
  );

  return {
    token,
    setToken,
    removeToken,
    isLoggedIn: () => token !== null,
    logout: () => setToken(null),
  };
};

export const useGetProfile = () => {
  const { isLoggedIn } = useToken();

  return useQuery({
    queryFn: () => profile(),
    queryKey: [{ key: "profile" }],
    enabled: isLoggedIn(),
  });
};

export const useRegister = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (variables: RegisterBody) => register({ body: variables }),
    onSuccess: () => {
      return queryClient.invalidateQueries({
        queryKey: [{ key: "users-list" }],
      });
    },
  });
};

export const useAuth = () => {
  const { setToken } = useToken();

  return useMutation({
    mutationFn: (variables: AuthBody) => auth({ body: variables }),
    onSuccess: (data) => {
      setToken(data.access_token);
    },
  });
};

export const useGetUsersList = (filters: any) => {
  return useQuery({
    queryKey: [{ key: "users-list", filters }],
    queryFn: () => getUsersList({ body: filters }),
  });
};

export const useGetRoles = () => {
  return useQuery({
    queryKey: [{ key: "users-roles" }],
    queryFn: () => getRoles(),
  });
};

export const useGetBonuses = () => {
  return useQuery({
    queryFn: () => getUserBonuses(),
    queryKey: [{ key: "user-bonuses" }],
  });
};

export const useGetCars = () => {
  return useQuery({
    queryFn: () => getCars(),
    queryKey: [{ key: "cars" }],
  });
};

export const useUpdateCar = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, body }: { id: number; body: object }) =>
      updateCar({ body, params: { id } }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [{ key: "cars" }],
      });
    },
  });
};

export const useDeleteCar = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id }: { id: number }) => deleteCar({ params: { id } }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [{ key: "cars" }],
      });
    },
  });
};

export const useCreateCar = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ body }: { body: object }) => createCar({ body }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [{ key: "cars" }],
      });
    },
  });
};

export const useUpdateProfile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (body: object) => updateProfile({ body }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [{ key: "profile" }],
      });
    },
  });
};
