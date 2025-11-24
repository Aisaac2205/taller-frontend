import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { authStore } from '@/lib/authStore';
import { User, LoginRequest, AuthResponse, ApiError } from '@/types/index';
import { useRouter } from 'next/navigation';

export const useAuth = () => {
  const router = useRouter();
  const queryClient = useQueryClient();

  // Obtener datos del usuario actual
  const { data: user, isLoading, error } = useQuery<User, ApiError>({
    queryKey: ['user'],
    queryFn: async () => {
      const response = await api.get<User>('/auth/me');
      return response.data;
    },
    retry: 1,
    enabled: authStore.hasToken(),
  });

  // Login
  const loginMutation = useMutation<AuthResponse, ApiError, LoginRequest>({
    mutationFn: async (credentials) => {
      const response = await api.post<AuthResponse>('/auth/login', credentials);
      return response.data;
    },
    onSuccess: (data) => {
      authStore.setToken(data.token);
      queryClient.setQueryData(['user'], data.user);
      router.push('/dashboard');
    },
  });

  // Logout
  const logoutMutation = useMutation({
    mutationFn: async () => {
      await api.post('/auth/logout');
    },
    onSuccess: () => {
      authStore.clearToken();
      queryClient.clear();
      router.push('/login');
    },
  });

  return {
    user,
    isLoading,
    error,
    login: loginMutation.mutate,
    isLoggingIn: loginMutation.isPending,
    loginError: loginMutation.error,
    logout: logoutMutation.mutate,
    isLoggingOut: logoutMutation.isPending,
  };
};
