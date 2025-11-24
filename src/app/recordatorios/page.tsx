'use client';

import React from 'react';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { useRecordatorios } from '@/hooks/useRecordatorios';
import { useVehiculos } from '@/hooks/useVehiculos';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Bell, Send } from 'lucide-react';
import { formatDate } from '@/lib/utils';

export default function RecordatoriosPage() {
  const { recordatorios, sendWhatsApp, isSendingWhatsApp } = useRecordatorios();
  const { vehiculos } = useVehiculos();

  const getVehicleInfo = (vehiculoId: string) => {
    const vehicle = vehiculos.find((v) => v.id === vehiculoId);
    return vehicle ? `${vehicle.marca} ${vehicle.modelo} (${vehicle.placa})` : 'Desconocido';
  };

  // Filtrar recordatorios próximos (ordenados por fecha)
  const proximosRecordatorios = recordatorios
    .sort((a, b) => new Date(a.proximaFecha).getTime() - new Date(b.proximaFecha).getTime())
    .filter((r) => new Date(r.proximaFecha) > new Date());

  return (
    <ProtectedRoute>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-tesla-text">Recordatorios</h1>
          <p className="mt-2 text-gray-400">
            Próximos cambios de aceite, filtros y mantenimientos
          </p>
        </div>

        <div className="grid gap-4">
          {proximosRecordatorios.length === 0 ? (
            <Card>
              <CardContent className="p-6 text-center">
                <Bell size={32} className="mx-auto mb-4 text-gray-400" />
                <p className="text-gray-400">No hay recordatorios pendientes</p>
              </CardContent>
            </Card>
          ) : (
            proximosRecordatorios.map((recordatorio) => {
              const diasRestantes = Math.ceil(
                (new Date(recordatorio.proximaFecha).getTime() - new Date().getTime()) /
                  (1000 * 60 * 60 * 24)
              );
              const isUrgente = diasRestantes <= 7;

              return (
                <Card key={recordatorio.id} className={isUrgente ? 'border-tesla-accent' : ''}>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-lg font-semibold text-tesla-text">
                          {recordatorio.tipo}
                        </h3>
                        <p className="text-sm text-gray-400">
                          {getVehicleInfo(recordatorio.vehiculoId)}
                        </p>
                        <p className="mt-2 text-sm text-gray-400">
                          {recordatorio.descripcion}
                        </p>
                        <div className="mt-3 flex gap-4">
                          <p className="text-sm">
                            <span className="text-gray-400">Próxima fecha:</span>{' '}
                            {formatDate(recordatorio.proximaFecha)}
                          </p>
                          <p className={`text-sm font-medium ${
                            isUrgente ? 'text-tesla-accent' : 'text-gray-400'
                          }`}>
                            {diasRestantes === 1
                              ? 'Hoy'
                              : diasRestantes === 2
                              ? 'Mañana'
                              : `En ${diasRestantes} días`}
                          </p>
                        </div>
                      </div>
                      <Button
                        variant={isUrgente ? 'default' : 'outline'}
                        size="sm"
                        className="gap-2"
                        onClick={() =>
                          sendWhatsApp({
                            recordatorioId: recordatorio.id,
                            clienteId: vehiculos.find(
                              (v) => v.id === recordatorio.vehiculoId
                            )?.clienteId || '',
                          })
                        }
                        disabled={isSendingWhatsApp}
                      >
                        <Send size={16} />
                        {isSendingWhatsApp ? 'Enviando...' : 'WhatsApp'}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })
          )}
        </div>

        {recordatorios.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Historial de Recordatorios</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-sm text-gray-400">
                Total: {recordatorios.length} recordatorios
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </ProtectedRoute>
  );
}

