'use client';

import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Producto } from '@/types/index';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

const productoSchema = z.object({
  nombre: z.string().min(1, 'El nombre es requerido'),
  descripcion: z.string().min(1, 'La descripción es requerida'),
  precio: z.number().positive('El precio debe ser mayor a 0'),
  stock: z.number().int().min(0, 'El stock no puede ser negativo'),
  sku: z.string().min(1, 'El SKU es requerido'),
  categoria: z.string().min(1, 'La categoría es requerida'),
});

type ProductoFormData = z.infer<typeof productoSchema>;

interface ProductoFormProps {
  producto?: Producto;
  onSubmit: (data: ProductoFormData) => void;
  isSubmitting: boolean;
}

export const ProductoForm: React.FC<ProductoFormProps> = ({
  producto,
  onSubmit,
  isSubmitting,
}) => {
  const { register, handleSubmit, setValue, formState: { errors } } = useForm<ProductoFormData>({
    resolver: zodResolver(productoSchema),
    defaultValues: producto,
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-tesla-text">
          Nombre
        </label>
        <Input
          placeholder="Nombre del producto"
          {...register('nombre')}
          className="mt-1"
        />
        {errors.nombre && (
          <p className="mt-1 text-xs text-tesla-accent">{errors.nombre.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-tesla-text">
          Descripción
        </label>
        <Input
          placeholder="Descripción del producto"
          {...register('descripcion')}
          className="mt-1"
        />
        {errors.descripcion && (
          <p className="mt-1 text-xs text-tesla-accent">{errors.descripcion.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-tesla-text">
          Precio
        </label>
        <Input
          type="number"
          step="0.01"
          placeholder="0.00"
          {...register('precio', { valueAsNumber: true })}
          className="mt-1"
        />
        {errors.precio && (
          <p className="mt-1 text-xs text-tesla-accent">{errors.precio.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-tesla-text">
          Stock
        </label>
        <Input
          type="number"
          placeholder="0"
          {...register('stock', { valueAsNumber: true })}
          className="mt-1"
        />
        {errors.stock && (
          <p className="mt-1 text-xs text-tesla-accent">{errors.stock.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-tesla-text">
          SKU
        </label>
        <div className="flex gap-2">
          <Input
            placeholder="SKU"
            {...register('sku')}
            className="mt-1"
          />
          <Button
            type="button"
            variant="outline"
            className="mt-1"
            onClick={() => {
              const randomSku = `SKU-${Math.random().toString(36).substr(2, 6).toUpperCase()}`;
              setValue('sku', randomSku);
            }}
          >
            Generar
          </Button>
        </div>
        {errors.sku && (
          <p className="mt-1 text-xs text-tesla-accent">{errors.sku.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-tesla-text">
          Categoría
        </label>
        <Input
          placeholder="Categoría"
          {...register('categoria')}
          className="mt-1"
        />
        {errors.categoria && (
          <p className="mt-1 text-xs text-tesla-accent">{errors.categoria.message}</p>
        )}
      </div>

      <Button type="submit" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? 'Guardando...' : 'Guardar'}
      </Button>
    </form>
  );
};

