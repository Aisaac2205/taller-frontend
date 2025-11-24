import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { Venta, ApiError, ProductoVenta } from '@/types/index';

export interface CreateVentaRequest {
  clienteId: string;
  productos: ProductoVenta[];
}

export const useVentas = () => {
  const queryClient = useQueryClient();

  // Obtener lista de ventas
  const { data: ventas = [], isLoading, error } = useQuery<Venta[], ApiError>({
    queryKey: ['ventas'],
    queryFn: async () => {
      const response = await api.get<Venta[]>('/ventas');
      return response.data;
    },
  });

  // Obtener una venta por ID
  const getVentaQuery = (id: string) =>
    useQuery<Venta, ApiError>({
      queryKey: ['venta', id],
      queryFn: async () => {
        const response = await api.get<Venta>(`/ventas/${id}`);
        return response.data;
      },
      enabled: !!id,
    });

  // Crear venta
  const createMutation = useMutation<Venta, ApiError, CreateVentaRequest>({
    mutationFn: async (data) => {
      const response = await api.post<Venta>('/ventas', data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ventas'] });
    },
  });

  // Actualizar venta
  const updateMutation = useMutation<Venta, ApiError, { id: string; data: Partial<Venta> }>({
    mutationFn: async ({ id, data }) => {
      const response = await api.patch<Venta>(`/ventas/${id}`, data);
      return response.data;
    },
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['ventas'] });
      queryClient.invalidateQueries({ queryKey: ['venta', id] });
    },
  });

  // Eliminar venta
  const deleteMutation = useMutation<void, ApiError, string>({
    mutationFn: async (id) => {
      await api.delete(`/ventas/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ventas'] });
    },
  });

  return {
    ventas,
    isLoading,
    error,
    getVentaQuery,
    createVenta: createMutation.mutate,
    isCreating: createMutation.isPending,
    createError: createMutation.error,
    updateVenta: updateMutation.mutate,
    isUpdating: updateMutation.isPending,
    updateError: updateMutation.error,
    deleteVenta: deleteMutation.mutate,
    isDeleting: deleteMutation.isPending,
    deleteError: deleteMutation.error,
  };
};
