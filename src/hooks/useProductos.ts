import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { Producto, ApiError } from '@/types/index';

export const useProductos = () => {
  const queryClient = useQueryClient();

  // Obtener lista de productos
  const { data: productos = [], isLoading, error } = useQuery<Producto[], ApiError>({
    queryKey: ['productos'],
    queryFn: async () => {
      const response = await api.get<Producto[]>('/productos');
      return response.data;
    },
  });

  // Obtener un producto por ID
  const getProductoQuery = (id: string) =>
    useQuery<Producto, ApiError>({
      queryKey: ['producto', id],
      queryFn: async () => {
        const response = await api.get<Producto>(`/productos/${id}`);
        return response.data;
      },
      enabled: !!id,
    });

  // Crear producto
  const createMutation = useMutation<Producto, ApiError, Omit<Producto, 'id' | 'createdAt' | 'updatedAt'>>({
    mutationFn: async (data) => {
      const response = await api.post<Producto>('/productos', data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['productos'] });
    },
  });

  // Actualizar producto
  const updateMutation = useMutation<Producto, ApiError, { id: string; data: Partial<Producto> }>({
    mutationFn: async ({ id, data }) => {
      const response = await api.patch<Producto>(`/productos/${id}`, data);
      return response.data;
    },
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['productos'] });
      queryClient.invalidateQueries({ queryKey: ['producto', id] });
    },
  });

  // Eliminar producto
  const deleteMutation = useMutation<void, ApiError, string>({
    mutationFn: async (id) => {
      await api.delete(`/productos/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['productos'] });
    },
  });

  return {
    productos,
    isLoading,
    error,
    getProductoQuery,
    createProducto: createMutation.mutate,
    isCreating: createMutation.isPending,
    createError: createMutation.error,
    updateProducto: updateMutation.mutate,
    isUpdating: updateMutation.isPending,
    updateError: updateMutation.error,
    deleteProducto: deleteMutation.mutate,
    isDeleting: deleteMutation.isPending,
    deleteError: deleteMutation.error,
  };
};
