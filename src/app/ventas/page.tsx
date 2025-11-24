'use client';

import React, { useState } from 'react';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { useAuth } from '@/hooks/useAuth';
import { useVentas } from '@/hooks/useVentas';
import { useClientes } from '@/hooks/useClientes';
import { useProductos } from '@/hooks/useProductos';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Plus, Trash2 } from 'lucide-react';
import { formatCurrency, formatDate } from '@/lib/utils';
import { CreateVentaRequest } from '@/hooks/useVentas';

export default function VentasPage() {
  const { user } = useAuth();
  const { ventas, createVenta, deleteVenta, isCreating } = useVentas();
  const { clientes } = useClientes();
  const { productos } = useProductos();
  const [showForm, setShowForm] = useState(false);

  const [formData, setFormData] = useState<CreateVentaRequest>({
    clienteId: '',
    productos: [],
  });

  // Permisos basados en roles
  const canCreate = user?.role === 'admin' || user?.role === 'recepcion';
  const canDelete = user?.role === 'admin';
  const canView = 
    user?.role === 'admin' || 
    user?.role === 'owner' || 
    user?.role === 'recepcion';

  const handleSubmit = () => {
    if (!formData.clienteId || formData.productos.length === 0) {
      return;
    }

    createVenta(formData, {
      onSuccess: () => {
        setShowForm(false);
        setFormData({ clienteId: '', productos: [] });
      },
    });
  };

  const getClienteName = (clienteId: string) => {
    return clientes.find((c) => c.id === clienteId)?.name || 'Desconocido';
  };

  const getProductoInfo = (productoId: string) => {
    return productos.find((p) => p.id === productoId);
  };

  const calculateTotal = () => {
    return formData.productos.reduce((sum, p) => {
      return sum + p.cantidad * p.precioUnitario;
    }, 0);
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
          <h1 className="text-3xl font-bold text-tesla-text">Ventas</h1>
          {canCreate && (
            <Button
              onClick={() => {
                setShowForm(!showForm);
                setFormData({ clienteId: '', productos: [] });
              }}
              className="gap-2"
            >
              <Plus size={20} />
              Nueva Venta
            </Button>
          )}
        </div>

        {showForm && (
          <Card>
            <CardHeader>
              <CardTitle>Nueva Venta</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={(e) => { e.preventDefault(); handleSubmit(); }} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-tesla-text">
                    Cliente
                  </label>
                  <select
                    value={formData.clienteId}
                    onChange={(e) => setFormData({ ...formData, clienteId: e.target.value })}
                    className="mt-1 w-full rounded border border-tesla-border bg-tesla-bg px-3 py-2 text-tesla-text"
                  >
                    <option value="">Selecciona un cliente</option>
                    {clientes.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-tesla-text">
                    Productos
                  </label>
                  <div className="mt-2 space-y-2 max-h-64 overflow-y-auto">
                    {productos.map((producto) => {
                      const selected = formData.productos.find(
                        (p) => p.productoId === producto.id
                      );
                      return (
                        <div key={producto.id} className="flex items-center gap-2 rounded border border-tesla-border p-2">
                          <input
                            type="checkbox"
                            checked={!!selected}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setFormData({
                                  ...formData,
                                  productos: [
                                    ...formData.productos,
                                    {
                                      productoId: producto.id,
                                      cantidad: 1,
                                      precioUnitario: producto.precio,
                                    },
                                  ],
                                });
                              } else {
                                setFormData({
                                  ...formData,
                                  productos: formData.productos.filter(
                                    (p) => p.productoId !== producto.id
                                  ),
                                });
                              }
                            }}
                          />
                          <div className="flex-1">
                            <p className="text-sm font-medium text-tesla-text">
                              {producto.nombre}
                            </p>
                            <p className="text-xs text-gray-400">
                              Precio: {formatCurrency(producto.precio)}
                            </p>
                          </div>
                          {selected && (
                            <input
                              type="number"
                              min="1"
                              value={selected.cantidad}
                              onChange={(e) => {
                                const newProductos = formData.productos.map((p) =>
                                  p.productoId === producto.id
                                    ? { ...p, cantidad: parseInt(e.target.value) || 1 }
                                    : p
                                );
                                setFormData({ ...formData, productos: newProductos });
                              }}
                              className="w-16 rounded border border-tesla-border bg-tesla-bg px-2 py-1 text-sm text-tesla-text"
                            />
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="rounded border border-tesla-border bg-tesla-hover p-4">
                  <p className="text-sm text-gray-400">Total a pagar:</p>
                  <p className="text-2xl font-bold text-tesla-accent">
                    {formatCurrency(calculateTotal())}
                  </p>
                </div>

                <Button type="submit" className="w-full" disabled={isCreating}>
                  {isCreating ? 'Creando venta...' : 'Crear Venta'}
                </Button>
              </form>
            </CardContent>
          </Card>
        )}

        <div className="grid gap-4">
          {ventas.length === 0 ? (
            <Card>
              <CardContent className="p-6 text-center">
                <p className="text-gray-400">No hay ventas registradas</p>
              </CardContent>
            </Card>
          ) : (
            ventas.map((venta) => (
              <Card key={venta.id}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-semibold text-tesla-text">
                        {getClienteName(venta.clienteId)}
                      </h3>
                      <p className="text-sm text-gray-400">
                        {venta.productos.length} producto(s)
                      </p>
                      <div className="mt-2 flex gap-4">
                        <p className="text-sm">
                          <span className="text-gray-400">Fecha:</span>{' '}
                          {formatDate(venta.createdAt)}
                        </p>
                        <p className="text-sm">
                          <span className="text-gray-400">Estado:</span> {venta.estado}
                        </p>
                        <p className="text-sm font-semibold">
                          Total: {formatCurrency(venta.total)}
                        </p>
                      </div>
                    </div>
                    {canDelete && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => deleteVenta(venta.id)}
                      >
                        <Trash2 size={16} className="text-tesla-accent" />
                      </Button>
                    )}
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

