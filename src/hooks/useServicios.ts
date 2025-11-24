import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { Servicio, ApiError } from '@/types/index';

export interface CreateServicioRequest {
  vehiculoId: string;
  clienteId: string;
  kmRegistrado: number;
  descripcion: string;
  piezasUsadas: Array<{
    productoId: string;
    cantidad: number;
  }>;
}

export const useServicios = (vehiculoId?: string) => {
  const queryClient = useQueryClient();

  // Obtener lista de servicios
  const { data: servicios = [], isLoading, error } = useQuery<Servicio[], ApiError>({
    queryKey: ['servicios', vehiculoId],
    queryFn: async () => {
      const url = vehiculoId ? `/servicios?vehiculoId=${vehiculoId}` : '/servicios';
      const response = await api.get<Servicio[]>(url);
      return response.data;
    },
  });

  // Obtener un servicio por ID
  const getServicioQuery = (id: string) =>
    useQuery<Servicio, ApiError>({
      queryKey: ['servicio', id],
      queryFn: async () => {
        const response = await api.get<Servicio>(`/servicios/${id}`);
        return response.data;
      },
      enabled: !!id,
    });

  // Crear servicio
  const createMutation = useMutation<Servicio, ApiError, CreateServicioRequest>({
    mutationFn: async (data) => {
      const response = await api.post<Servicio>('/servicios', data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['servicios'] });
    },
  });

  // Actualizar servicio
  const updateMutation = useMutation<Servicio, ApiError, { id: string; data: Partial<Servicio> }>({
    mutationFn: async ({ id, data }) => {
      const response = await api.patch<Servicio>(`/servicios/${id}`, data);
      return response.data;
    },
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['servicios'] });
      queryClient.invalidateQueries({ queryKey: ['servicio', id] });
    },
  });

  // Eliminar servicio
  const deleteMutation = useMutation<void, ApiError, string>({
    mutationFn: async (id) => {
      await api.delete(`/servicios/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['servicios'] });
    },
  });

  return {
    servicios,
    isLoading,
    error,
    getServicioQuery,
    createServicio: createMutation.mutate,
    isCreating: createMutation.isPending,
    createError: createMutation.error,
    updateServicio: updateMutation.mutate,
    isUpdating: updateMutation.isPending,
    updateError: updateMutation.error,
    deleteServicio: deleteMutation.mutate,
    isDeleting: deleteMutation.isPending,
    deleteError: deleteMutation.error,
  };
};
