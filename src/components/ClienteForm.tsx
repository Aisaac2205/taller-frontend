'use client';

import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Cliente } from '@/types/index';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

const clienteSchema = z.object({
  name: z.string().min(1, 'El nombre es requerido'),
  email: z.string().email('Email inválido'),
  phone: z.string()
    .length(8, 'El teléfono debe tener exactamente 8 dígitos')
    .regex(/^\d+$/, 'El teléfono solo debe contener números'),
  address: z.string().min(1, 'La dirección es requerida'),
});

type ClienteFormData = z.infer<typeof clienteSchema>;

interface ClienteFormProps {
  cliente?: Cliente;
  onSubmit: (data: ClienteFormData) => void;
  isSubmitting: boolean;
}

export const ClienteForm: React.FC<ClienteFormProps> = ({
  cliente,
  onSubmit,
  isSubmitting,
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ClienteFormData>({
    resolver: zodResolver(clienteSchema),
    defaultValues: cliente,
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-tesla-text">
          Nombre
        </label>
        <Input
          placeholder="Nombre del cliente"
          {...register('name')}
          className="mt-1"
        />
        {errors.name && (
          <p className="mt-1 text-xs text-tesla-accent">{errors.name.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-tesla-text">
          Email
        </label>
        <Input
          type="email"
          placeholder="cliente@email.com"
          {...register('email')}
          className="mt-1"
        />
        {errors.email && (
          <p className="mt-1 text-xs text-tesla-accent">{errors.email.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-tesla-text">
          Teléfono
        </label>
        <Input
          placeholder="Teléfono del cliente"
          {...register('phone')}
          className="mt-1"
        />
        {errors.phone && (
          <p className="mt-1 text-xs text-tesla-accent">{errors.phone.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-tesla-text">
          Dirección
        </label>
        <Input
          placeholder="Dirección del cliente"
          {...register('address')}
          className="mt-1"
        />
        {errors.address && (
          <p className="mt-1 text-xs text-tesla-accent">{errors.address.message}</p>
        )}
      </div>

      <Button type="submit" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? 'Guardando...' : 'Guardar'}
      </Button>
    </form>
  );
};

