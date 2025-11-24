'use client';

import React, { useState } from 'react';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { useAuth } from '@/hooks/useAuth';
import { useProductos } from '@/hooks/useProductos';
import { ProductoForm } from '@/components/ProductoForm';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Plus, Trash2, Edit } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';

export default function ProductosPage() {
  const { user } = useAuth();
  const { productos, createProducto, updateProducto, deleteProducto, isCreating, isUpdating } =
    useProductos();
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const editingProducto = editingId ? productos.find((p) => p.id === editingId) : undefined;

  // Permisos basados en roles
  const canCreate = user?.role === 'admin';
  const canEdit = user?.role === 'admin';
  const canDelete = user?.role === 'admin';
  const canView = user?.role === 'admin' || user?.role === 'owner';

  const handleSubmit = (data: any) => {
    if (editingId) {
      updateProducto(
        { id: editingId, data },
        {
          onSuccess: () => {
            setEditingId(null);
            setShowForm(false);
          },
        }
      );
    } else {
      createProducto(data, {
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
          <h1 className="text-3xl font-bold text-tesla-text">Inventario de Productos</h1>
          {canCreate && (
            <Button
              onClick={() => {
                setEditingId(null);
                setShowForm(!showForm);
              }}
              className="gap-2"
            >
              <Plus size={20} />
              Nuevo Producto
            </Button>
          )}
        </div>

        {showForm && (
          <Card>
            <CardHeader>
              <CardTitle>{editingProducto ? 'Editar Producto' : 'Nuevo Producto'}</CardTitle>
            </CardHeader>
            <CardContent>
              <ProductoForm
                producto={editingProducto}
                onSubmit={handleSubmit}
                isSubmitting={isCreating || isUpdating}
              />
            </CardContent>
          </Card>
        )}

        <div className="grid gap-4">
          {productos.length === 0 ? (
            <Card>
              <CardContent className="p-6 text-center">
                <p className="text-gray-400">No hay productos registrados</p>
              </CardContent>
            </Card>
          ) : (
            productos.map((producto) => (
              <Card key={producto.id}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-semibold text-tesla-text">
                        {producto.nombre}
                      </h3>
                      <p className="text-sm text-gray-400">{producto.descripcion}</p>
                      <div className="mt-2 flex gap-4">
                        <p className="text-sm">
                          <span className="text-gray-400">SKU:</span> {producto.sku}
                        </p>
                        <p className="text-sm">
                          <span className="text-gray-400">Precio:</span>{' '}
                          {formatCurrency(producto.precio)}
                        </p>
                        <p className="text-sm">
                          <span className="text-gray-400">Stock:</span> {producto.stock}
                        </p>
                        <p className="text-sm">
                          <span className="text-gray-400">Categoría:</span>{' '}
                          {producto.categoria}
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      {canEdit && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setEditingId(producto.id);
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
                          onClick={() => deleteProducto(producto.id)}
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

