'use client';

import React, { useState } from 'react';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { useAuth } from '@/hooks/useAuth';
import { useVehiculos } from '@/hooks/useVehiculos';
import { useClientes } from '@/hooks/useClientes';
import { VehiculoForm } from '@/components/VehiculoForm';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Plus, Trash2, Edit } from 'lucide-react';

export default function VehiculosPage() {
  const { user } = useAuth();
  const { vehiculos, createVehiculo, updateVehiculo, deleteVehiculo, isCreating, isUpdating } =
    useVehiculos();
  const { clientes } = useClientes();
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const editingVehiculo = editingId ? vehiculos.find((v) => v.id === editingId) : undefined;

  // Permisos basados en roles
  const canCreate = user?.role === 'admin' || user?.role === 'recepcion';
  const canEdit = user?.role === 'admin' || user?.role === 'recepcion';
  const canDelete = user?.role === 'admin';
  const canView = 
    user?.role === 'admin' || 
    user?.role === 'owner' || 
    user?.role === 'recepcion';

  const handleSubmit = (data: any) => {
    if (editingId) {
      updateVehiculo(
        { id: editingId, data },
        {
          onSuccess: () => {
            setEditingId(null);
            setShowForm(false);
          },
        }
      );
    } else {
      createVehiculo(data, {
        onSuccess: () => setShowForm(false),
      });
    }
  };

  const getClienteName = (clienteId: string) => {
    return clientes.find((c) => c.id === clienteId)?.name || 'Desconocido';
  };

  if (!canView) {
    return (
      <ProtectedRoute>
        <div className="flex h-96 items-center justify-center">
          <Card>
            <CardContent className="p-6 text-center">
              <p className="text-gray-400">
                No tienes permisos para acceder a esta página
              </p>
            </CardContent>
          </Card>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-tesla-text">Vehículos</h1>
          {canCreate && (
            <Button
              onClick={() => {
                setEditingId(null);
                setShowForm(!showForm);
              }}
              className="gap-2"
            >
              <Plus size={20} />
              Nuevo Vehículo
            </Button>
          )}
        </div>

        {showForm && (
          <Card>
            <CardHeader>
              <CardTitle>{editingVehiculo ? 'Editar Vehículo' : 'Nuevo Vehículo'}</CardTitle>
            </CardHeader>
            <CardContent>
              <VehiculoForm
                vehiculo={editingVehiculo}
                onSubmit={handleSubmit}
                isSubmitting={isCreating || isUpdating}
              />
            </CardContent>
          </Card>
        )}

        <div className="grid gap-4">
          {vehiculos.length === 0 ? (
            <Card>
              <CardContent className="p-6 text-center">
                <p className="text-gray-400">No hay vehículos registrados</p>
              </CardContent>
            </Card>
          ) : (
            vehiculos.map((vehiculo) => (
              <Card key={vehiculo.id}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-semibold text-tesla-text">
                        {vehiculo.marca} {vehiculo.modelo} ({vehiculo.anio})
                      </h3>
                      <p className="text-sm text-gray-400">
                        Placa: {vehiculo.placa} | VIN: {vehiculo.vin}
                      </p>
                      <p className="text-sm text-gray-400">
                        Cliente: {getClienteName(vehiculo.clienteId)}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      {canEdit && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setEditingId(vehiculo.id);
                            setShowForm(true);
                          }}
                        >
                          <Edit size={16} />
                        </Button>
                      )}
                      {canDelete && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => deleteVehiculo(vehiculo.id)}
                        >
                          <Trash2 size={16} className="text-tesla-accent" />
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
}

