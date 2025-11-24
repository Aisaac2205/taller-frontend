import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { Cliente, ApiError } from '@/types/index';

export const useClientes = () => {
  const queryClient = useQueryClient();

  // Agregar funciones de mapeo
  const mapClienteToBackend = (cliente: Partial<Cliente>) => ({
    nombre: cliente.name,
    email: cliente.email,
    telefono: cliente.phone,
    direccion: cliente.address,
  });

  const mapClienteFromBackend = (cliente: any): Cliente => ({
    id: cliente.id,
    name: cliente.nombre,
    email: cliente.email || '',
    phone: cliente.telefono,
    address: cliente.direccion,
    createdAt: cliente.creadoEn || cliente.createdAt,
    updatedAt: cliente.actualizadoEn || cliente.updatedAt,
  });

  // Obtener lista de clientes
  const { data: clientes = [], isLoading, error } = useQuery<Cliente[], ApiError>({
    queryKey: ['clientes'],
    queryFn: async () => {
      const response = await api.get<any[]>('/clientes');
      return response.data.map(mapClienteFromBackend);
    },
  });

  // Obtener un cliente por ID
  const getClienteQuery = (id: string) => 
    useQuery<Cliente, ApiError>({
      queryKey: ['cliente', id],
      queryFn: async () => {
        const response = await api.get<Cliente>(`/clientes/${id}`);
        return response.data;
      },
      enabled: !!id,
    });

  // Crear cliente
  const createMutation = useMutation<Cliente, ApiError, Omit<Cliente, 'id' | 'createdAt' | 'updatedAt'>>({
    mutationFn: async (data) => {
      const backendData = mapClienteToBackend(data);
      const response = await api.post<any>('/clientes', backendData);
      return mapClienteFromBackend(response.data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clientes'] });
    },
  });

  // Actualizar cliente
  const updateMutation = useMutation<Cliente, ApiError, { id: string; data: Partial<Cliente> }>({
    mutationFn: async ({ id, data }) => {
      const response = await api.patch<Cliente>(`/clientes/${id}`, data);
      return response.data;
    },
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['clientes'] });
      queryClient.invalidateQueries({ queryKey: ['cliente', id] });
    },
  });

  // Eliminar cliente
  const deleteMutation = useMutation<void, ApiError, string>({
    mutationFn: async (id) => {
      await api.delete(`/clientes/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clientes'] });
    },
  });

  return {
    clientes,
    isLoading,
    error,
    getClienteQuery,
    createCliente: createMutation.mutate,
    isCreating: createMutation.isPending,
    createError: createMutation.error,
    updateCliente: updateMutation.mutate,
    isUpdating: updateMutation.isPending,
    updateError: updateMutation.error,
    deleteCliente: deleteMutation.mutate,
    isDeleting: deleteMutation.isPending,
    deleteError: deleteMutation.error,
  };
};
