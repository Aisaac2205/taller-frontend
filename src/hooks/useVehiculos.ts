import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { Vehiculo, ApiError } from '@/types/index';

export const useVehiculos = (clienteId?: string) => {
  const queryClient = useQueryClient();

  // Obtener lista de vehículos
  const { data: vehiculos = [], isLoading, error } = useQuery<Vehiculo[], ApiError>({
    queryKey: ['vehiculos', clienteId],
    queryFn: async () => {
      const url = clienteId ? `/vehiculos?clienteId=${clienteId}` : '/vehiculos';
      const response = await api.get<Vehiculo[]>(url);
      return response.data;
    },
  });

  // Obtener un vehículo por ID
  const getVehiculoQuery = (id: string) =>
    useQuery<Vehiculo, ApiError>({
      queryKey: ['vehiculo', id],
      queryFn: async () => {
        const response = await api.get<Vehiculo>(`/vehiculos/${id}`);
        return response.data;
      },
      enabled: !!id,
    });

  // Crear vehículo
  const createMutation = useMutation<Vehiculo, ApiError, Omit<Vehiculo, 'id' | 'createdAt' | 'updatedAt'>>({
    mutationFn: async (data) => {
      const response = await api.post<Vehiculo>('/vehiculos', data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vehiculos'] });
    },
  });

  // Actualizar vehículo
  const updateMutation = useMutation<Vehiculo, ApiError, { id: string; data: Partial<Vehiculo> }>({
    mutationFn: async ({ id, data }) => {
      const response = await api.patch<Vehiculo>(`/vehiculos/${id}`, data);
      return response.data;
    },
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['vehiculos'] });
      queryClient.invalidateQueries({ queryKey: ['vehiculo', id] });
    },
  });

  // Eliminar vehículo
  const deleteMutation = useMutation<void, ApiError, string>({
    mutationFn: async (id) => {
      await api.delete(`/vehiculos/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vehiculos'] });
    },
  });

  return {
    vehiculos,
    isLoading,
    error,
    getVehiculoQuery,
    createVehiculo: createMutation.mutate,
    isCreating: createMutation.isPending,
    createError: createMutation.error,
    updateVehiculo: updateMutation.mutate,
    isUpdating: updateMutation.isPending,
    updateError: updateMutation.error,
    deleteVehiculo: deleteMutation.mutate,
    isDeleting: deleteMutation.isPending,
    deleteError: deleteMutation.error,
  };
};
