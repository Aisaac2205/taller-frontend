'use client';

import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Vehiculo } from '@/types/index';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

const vehiculoSchema = z.object({
  clienteId: z.string().min(1, 'El cliente es requerido'),
  marca: z.string().min(1, 'La marca es requerida'),
  modelo: z.string().min(1, 'El modelo es requerido'),
  anio: z.number().int().min(1900, 'Año inválido'),
  placa: z.string().min(1, 'La placa es requerida'),
  vin: z.string().min(1, 'El VIN es requerido'),
});

type VehiculoFormData = z.infer<typeof vehiculoSchema>;

interface VehiculoFormProps {
  vehiculo?: Vehiculo;
  clienteId?: string;
  onSubmit: (data: VehiculoFormData) => void;
  isSubmitting: boolean;
}

export const VehiculoForm: React.FC<VehiculoFormProps> = ({
  vehiculo,
  clienteId,
  onSubmit,
  isSubmitting,
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<VehiculoFormData>({
    resolver: zodResolver(vehiculoSchema),
    defaultValues: vehiculo || { clienteId },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-tesla-text">
          Cliente ID
        </label>
        <Input
          placeholder="ID del cliente"
          {...register('clienteId')}
          className="mt-1"
          disabled={!!clienteId}
        />
        {errors.clienteId && (
          <p className="mt-1 text-xs text-tesla-accent">{errors.clienteId.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-tesla-text">
          Marca
        </label>
        <Input
          placeholder="Toyota, Honda, etc."
          {...register('marca')}
          className="mt-1"
        />
        {errors.marca && (
          <p className="mt-1 text-xs text-tesla-accent">{errors.marca.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-tesla-text">
          Modelo
        </label>
        <Input
          placeholder="Modelo del vehículo"
          {...register('modelo')}
          className="mt-1"
        />
        {errors.modelo && (
          <p className="mt-1 text-xs text-tesla-accent">{errors.modelo.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-tesla-text">
          Año
        </label>
        <Input
          type="number"
          placeholder="2024"
          {...register('anio', { valueAsNumber: true })}
          className="mt-1"
        />
        {errors.anio && (
          <p className="mt-1 text-xs text-tesla-accent">{errors.anio.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-tesla-text">
          Placa
        </label>
        <Input
          placeholder="ABC-123"
          {...register('placa')}
          className="mt-1"
        />
        {errors.placa && (
          <p className="mt-1 text-xs text-tesla-accent">{errors.placa.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-tesla-text">
          VIN
        </label>
        <Input
          placeholder="Vehicle Identification Number"
          {...register('vin')}
          className="mt-1"
        />
        {errors.vin && (
          <p className="mt-1 text-xs text-tesla-accent">{errors.vin.message}</p>
        )}
      </div>

      <Button type="submit" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? 'Guardando...' : 'Guardar'}
      </Button>
    </form>
  );
};

