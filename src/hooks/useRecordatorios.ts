import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { Recordatorio, ApiError } from '@/types/index';

export const useRecordatorios = () => {
  const queryClient = useQueryClient();

  // Obtener lista de recordatorios próximos
  const { data: recordatorios = [], isLoading, error } = useQuery<Recordatorio[], ApiError>({
    queryKey: ['recordatorios'],
    queryFn: async () => {
      const response = await api.get<Recordatorio[]>('/recordatorios');
      return response.data;
    },
  });

  // Enviar recordatorio por WhatsApp
  const sendWhatsAppMutation = useMutation<void, ApiError, { recordatorioId: string; clienteId: string }>({
    mutationFn: async ({ recordatorioId, clienteId }) => {
      await api.post(`/recordatorios/${recordatorioId}/send-whatsapp`, { clienteId });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['recordatorios'] });
    },
  });

  return {
    recordatorios,
    isLoading,
    error,
    sendWhatsApp: sendWhatsAppMutation.mutate,
    isSendingWhatsApp: sendWhatsAppMutation.isPending,
    sendWhatsAppError: sendWhatsAppMutation.error,
  };
};
