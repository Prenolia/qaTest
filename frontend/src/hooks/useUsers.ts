import {
  api,
  type CreateUserDTO,
  type UpdateUserDTO,
  type UsersParams,
} from "@/lib/api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

const QUERY_KEYS = {
  USERS: "users",
  USER: "user",
};

export function useUsers(params: UsersParams = {}) {
  return useQuery({
    queryKey: [QUERY_KEYS.USERS, params],
    queryFn: () => api.getUsers(params),
  });
}

export function useUser(id: string) {
  return useQuery({
    queryKey: [QUERY_KEYS.USER, id],
    queryFn: () => api.getUser(id),
    enabled: !!id,
  });
}

export function useCreateUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateUserDTO) => api.createUser(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.USERS] });
    },
  });
}

export function useUpdateUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateUserDTO }) =>
      api.updateUser(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.USERS] });
    },
  });
}

export function useDeleteUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => api.deleteUser(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.USERS] });
    },
  });
}

export function useResetData() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => api.resetData(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.USERS] });
    },
  });
}
