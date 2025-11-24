'use client';

import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/Card';

const loginSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres'),
});

type LoginFormData = z.infer<typeof loginSchema>;

export const LoginForm: React.FC = () => {
  const { login, isLoggingIn, loginError } = useAuth();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = (data: LoginFormData) => {
    login(data);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-tesla-bg p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <div className="text-center">
            <CardTitle className="mb-2 text-2xl">Taller</CardTitle>
            <p className="text-sm text-gray-400">Inicia sesión para continuar</p>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-tesla-text">
                Email
              </label>
              <Input
                type="email"
                placeholder="tu@email.com"
                {...register('email')}
                className="mt-1"
              />
              {errors.email && (
                <p className="mt-1 text-xs text-tesla-accent">
                  {errors.email.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-tesla-text">
                Contraseña
              </label>
              <Input
                type="password"
                placeholder="••••••••"
                {...register('password')}
                className="mt-1"
              />
              {errors.password && (
                <p className="mt-1 text-xs text-tesla-accent">
                  {errors.password.message}
                </p>
              )}
            </div>

            {loginError && (
              <div className="rounded bg-red-500/10 p-3 text-sm text-tesla-accent">
                {loginError.message}
              </div>
            )}

            <Button
              type="submit"
              className="w-full"
              disabled={isLoggingIn}
            >
              {isLoggingIn ? 'Iniciando sesión...' : 'Iniciar sesión'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

