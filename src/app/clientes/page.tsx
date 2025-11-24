'use client';

import React, { useState } from 'react';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { useAuth } from '@/hooks/useAuth';
import { useClientes } from '@/hooks/useClientes';
import { ClienteForm } from '@/components/ClienteForm';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Plus, Trash2, Edit } from 'lucide-react';

export default function ClientesPage() {
  const { user } = useAuth();
  const { clientes, createCliente, updateCliente, deleteCliente, isCreating, isUpdating } =
    useClientes();
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const editingCliente = editingId ? clientes.find((c) => c.id === editingId) : undefined;

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
      updateCliente(
        { id: editingId, data },
        {
          onSuccess: () => {
            setEditingId(null);
            setShowForm(false);
          },
        }
      );
    } else {
      createCliente(data, {
        onSuccess: () => setShowForm(false),
      });
    }
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
          <h1 className="text-3xl font-bold text-tesla-text">Clientes</h1>
          {canCreate && (
            <Button
              onClick={() => {
                setEditingId(null);
                setShowForm(!showForm);
              }}
              className="gap-2"
            >
              <Plus size={20} />
              Nuevo Cliente
            </Button>
          )}
        </div>

        {showForm && (
          <Card>
            <CardHeader>
              <CardTitle>{editingCliente ? 'Editar Cliente' : 'Nuevo Cliente'}</CardTitle>
            </CardHeader>
            <CardContent>
              <ClienteForm
                cliente={editingCliente}
                onSubmit={handleSubmit}
                isSubmitting={isCreating || isUpdating}
              />
            </CardContent>
          </Card>
        )}

        <div className="grid gap-4">
          {clientes.length === 0 ? (
            <Card>
              <CardContent className="p-6 text-center">
                <p className="text-gray-400">No hay clientes registrados</p>
              </CardContent>
            </Card>
          ) : (
            clientes.map((cliente) => (
              <Card key={cliente.id}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-semibold text-tesla-text">
                        {cliente.name}
                      </h3>
                      <p className="text-sm text-gray-400">{cliente.email}</p>
                      <p className="text-sm text-gray-400">{cliente.phone}</p>
                    </div>
                    <div className="flex gap-2">
                      {canEdit && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setEditingId(cliente.id);
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
                          onClick={() => deleteCliente(cliente.id)}
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

