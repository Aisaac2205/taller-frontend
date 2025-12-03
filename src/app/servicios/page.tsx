'use client';

import React, { useState, useEffect } from 'react';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { useAuth } from '@/hooks/useAuth';
import { useServicios } from '@/hooks/useServicios';
import { useVehiculos } from '@/hooks/useVehiculos';
import { useProductos } from '@/hooks/useProductos';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Plus, Trash2, Edit } from 'lucide-react';
import { formatCurrency, formatDate } from '@/lib/utils';
import { CreateServicioRequest } from '@/hooks/useServicios';

export default function ServiciosPage() {
  const { user } = useAuth();
  const { servicios, createServicio, updateServicio, deleteServicio, isCreating, isUpdating } =
    useServicios();
  const { vehiculos } = useVehiculos();
  const { productos } = useProductos();
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [formData, setFormData] = useState<CreateServicioRequest>({
    vehiculoId: '',
    clienteId: '',
    kmRegistrado: 0,
    descripcion: '',
    piezasUsadas: [],
    tipo: 'GENERAL',
  });

  // Permisos basados en roles
  const canCreate = user?.role === 'admin' || user?.role === 'mechanic';
  const canEdit = user?.role === 'admin' || user?.role === 'mechanic';
  const canDelete = user?.role === 'admin';
  const canView =
    user?.role === 'admin' ||
    user?.role === 'owner' ||
    user?.role === 'mechanic' ||
    user?.role === 'recepcion';

  const handleSubmit = () => {
    if (!formData.vehiculoId || !formData.clienteId || !formData.descripcion) {
      return;
    }

    if (isNaN(formData.kmRegistrado)) {
      alert('Por favor ingrese un kilometraje válido');
      return;
    }

    if (editingId) {
      updateServicio(
        { id: editingId, data: formData },
        {
          onSuccess: () => {
            setEditingId(null);
            setShowForm(false);
            resetForm();
          },
        }
      );
    } else {
      createServicio(formData, {
        onSuccess: () => {
          setShowForm(false);
          resetForm();
        },
      });
    }
  };

  const resetForm = () => {
    setFormData({
      vehiculoId: '',
      clienteId: '',
      kmRegistrado: 0,
      descripcion: '',
      piezasUsadas: [],
      tipo: 'GENERAL',
    });
  };

  const getVehicleInfo = (vehiculoId: string) => {
    const vehicle = vehiculos.find((v) => v.id === vehiculoId);
    return vehicle ? `${vehicle.marca} ${vehicle.modelo}` : 'Desconocido';
  };

  // Obtener clienteId del vehículo seleccionado
  const selectedVehicle = vehiculos.find((v) => v.id === formData.vehiculoId);
  useEffect(() => {
    if (selectedVehicle && !formData.clienteId) {
      setFormData((prev) => ({ ...prev, clienteId: selectedVehicle.clienteId }));
    }
  }, [selectedVehicle, formData.clienteId]);

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
          <h1 className="text-3xl font-bold text-tesla-text">Servicios</h1>
          {canCreate && (
            <Button
              onClick={() => {
                setEditingId(null);
                setShowForm(!showForm);
                resetForm();
              }}
              className="gap-2"
            >
              <Plus size={20} />
              Nuevo Servicio
            </Button>
          )}
        </div>

        {showForm && (
          <Card>
            <CardHeader>
              <CardTitle>{editingId ? 'Editar Servicio' : 'Nuevo Servicio'}</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={(e) => { e.preventDefault(); handleSubmit(); }} className="space-y-4">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div>
                    <label className="block text-sm font-medium text-tesla-text">
                      Tipo de Servicio
                    </label>
                    <select
                      value={formData.tipo}
                      onChange={(e) => setFormData({ ...formData, tipo: e.target.value as any })}
                      className="mt-1 w-full rounded border border-tesla-border bg-tesla-bg px-3 py-2 text-tesla-text"
                    >
                      <option value="GENERAL">General</option>
                      <option value="REEMPLAZO_PIEZA">Reemplazo de Pieza</option>
                      <option value="CAMBIO_ACEITE">Servicio de Aceite</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-tesla-text">
                      Vehículo
                    </label>
                    <select
                      value={formData.vehiculoId}
                      onChange={(e) => setFormData({ ...formData, vehiculoId: e.target.value })}
                      className="mt-1 w-full rounded border border-tesla-border bg-tesla-bg px-3 py-2 text-tesla-text"
                    >
                      <option value="">Selecciona un vehículo</option>
                      {vehiculos.map((v) => (
                        <option key={v.id} value={v.id}>
                          {v.marca} {v.modelo} ({v.placa})
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-tesla-text">
                    Kilometraje Actual
                  </label>
                  <Input
                    type="number"
                    value={isNaN(formData.kmRegistrado) ? '' : formData.kmRegistrado}
                    onChange={(e) =>
                      setFormData({ ...formData, kmRegistrado: parseInt(e.target.value) })
                    }
                    placeholder="Kilometraje"
                    className="mt-1"
                  />
                </div>

                {formData.tipo === 'REEMPLAZO_PIEZA' && (
                  <div>
                    <label className="block text-sm font-medium text-tesla-text">
                      Pieza Reemplazada (Descripción)
                    </label>
                    <Input
                      value={formData.piezaReemplazada || ''}
                      onChange={(e) =>
                        setFormData({ ...formData, piezaReemplazada: e.target.value })
                      }
                      placeholder="Ej. Alternador, Bomba de agua"
                      className="mt-1"
                    />
                  </div>
                )}

                {formData.tipo === 'CAMBIO_ACEITE' && (
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div>
                      <label className="block text-sm font-medium text-tesla-text">
                        Próximo Cambio (Km)
                      </label>
                      <Input
                        type="number"
                        value={formData.proximoCambioKm === undefined || isNaN(formData.proximoCambioKm) ? '' : formData.proximoCambioKm}
                        onChange={(e) =>
                          setFormData({ ...formData, proximoCambioKm: parseInt(e.target.value) })
                        }
                        placeholder="Ej. 5000 más del actual"
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-tesla-text">
                        Próximo Cambio (Fecha)
                      </label>
                      <Input
                        type="date"
                        value={formData.proximoCambioFecha ? new Date(formData.proximoCambioFecha).toISOString().split('T')[0] : ''}
                        onChange={(e) =>
                          setFormData({ ...formData, proximoCambioFecha: e.target.value })
                        }
                        className="mt-1"
                      />
                    </div>
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-tesla-text">
                    Descripción General
                  </label>
                  <Input
                    value={formData.descripcion}
                    onChange={(e) =>
                      setFormData({ ...formData, descripcion: e.target.value })
                    }
                    placeholder="Descripción del servicio"
                    className="mt-1"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-tesla-text">
                    Piezas/Productos de Stock Usados
                  </label>
                  <div className="mt-2 space-y-2 max-h-64 overflow-y-auto">
                    {productos.map((producto) => {
                      const selected = formData.piezasUsadas.find(
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
                                  piezasUsadas: [
                                    ...formData.piezasUsadas,
                                    {
                                      productoId: producto.id,
                                      cantidad: 1,
                                    },
                                  ],
                                });
                              } else {
                                setFormData({
                                  ...formData,
                                  piezasUsadas: formData.piezasUsadas.filter(
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
                              Stock: {producto.stock}
                            </p>
                          </div>
                          {selected && (
                            <input
                              type="number"
                              min="1"
                              max={producto.stock}
                              value={selected.cantidad}
                              onChange={(e) => {
                                const newPiezas = formData.piezasUsadas.map((p) =>
                                  p.productoId === producto.id
                                    ? { ...p, cantidad: parseInt(e.target.value) || 1 }
                                    : p
                                );
                                setFormData({ ...formData, piezasUsadas: newPiezas });
                              }}
                              className="w-16 rounded border border-tesla-border bg-tesla-bg px-2 py-1 text-sm text-tesla-text"
                            />
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>

                <Button type="submit" className="w-full" disabled={isCreating || isUpdating}>
                  {isCreating || isUpdating ? 'Guardando...' : 'Guardar'}
                </Button>
              </form>
            </CardContent>
          </Card>
        )}

        <div className="grid gap-4">
          {servicios.length === 0 ? (
            <Card>
              <CardContent className="p-6 text-center">
                <p className="text-gray-400">No hay servicios registrados</p>
              </CardContent>
            </Card>
          ) : (
            servicios.map((servicio) => (
              <Card key={servicio.id}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-lg font-semibold text-tesla-text">
                          {getVehicleInfo(servicio.vehiculoId)}
                        </h3>
                        <span className={`text-xs px-2 py-1 rounded-full ${servicio.tipo === 'CAMBIO_ACEITE' ? 'bg-blue-900 text-blue-200' :
                          servicio.tipo === 'REEMPLAZO_PIEZA' ? 'bg-orange-900 text-orange-200' :
                            'bg-gray-800 text-gray-200'
                          }`}>
                          {servicio.tipo?.replace('_', ' ') || 'GENERAL'}
                        </span>
                      </div>
                      <p className="text-sm text-gray-400">{servicio.descripcion}</p>
                      {servicio.piezaReemplazada && (
                        <p className="text-sm text-orange-400">Pieza: {servicio.piezaReemplazada}</p>
                      )}
                      <div className="mt-2 flex gap-4">
                        <p className="text-sm">
                          <span className="text-gray-400">Fecha:</span>{' '}
                          {formatDate(servicio.fechaServicio)}
                        </p>
                        <p className="text-sm">
                          <span className="text-gray-400">Estado:</span> {servicio.estado}
                        </p>
                        <p className="text-sm font-semibold">
                          Total: {formatCurrency(servicio.total)}
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      {canEdit && (
                        <Button variant="ghost" size="sm">
                          <Edit size={16} />
                        </Button>
                      )}
                      {canDelete && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => deleteServicio(servicio.id)}
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

