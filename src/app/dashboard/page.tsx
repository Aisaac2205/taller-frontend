'use client';

import React from 'react';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { useAuth } from '@/hooks/useAuth';
import { useClientes } from '@/hooks/useClientes';
import { useVehiculos } from '@/hooks/useVehiculos';
import { useProductos } from '@/hooks/useProductos';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Users, Truck, Package, Activity } from 'lucide-react';

export default function DashboardPage() {
  const { user } = useAuth();
  const { clientes } = useClientes();
  const { vehiculos } = useVehiculos();
  const { productos } = useProductos();

  const stats = [
    {
      label: 'Clientes',
      value: clientes.length,
      icon: <Users size={32} className="text-tesla-accent" />,
    },
    {
      label: 'Vehículos',
      value: vehiculos.length,
      icon: <Truck size={32} className="text-tesla-accent" />,
    },
    {
      label: 'Productos',
      value: productos.length,
      icon: <Package size={32} className="text-tesla-accent" />,
    },
    {
      label: 'Servicios',
      value: 0,
      icon: <Activity size={32} className="text-tesla-accent" />,
    },
  ];

  return (
    <ProtectedRoute>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-tesla-text">Dashboard</h1>
          <p className="mt-2 text-gray-400">
            Bienvenido, {user?.name} ({user?.role})
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => (
            <Card key={stat.label} className="flex flex-col items-center justify-center p-6">
              <div className="mb-4">{stat.icon}</div>
              <p className="text-gray-400">{stat.label}</p>
              <p className="text-2xl font-bold text-tesla-text">{stat.value}</p>
            </Card>
          ))}
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Información del Sistema</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm">
              <p>
                <span className="text-gray-400">Usuario:</span> {user?.name}
              </p>
              <p>
                <span className="text-gray-400">Rol:</span> {user?.role}
              </p>
              <p>
                <span className="text-gray-400">Email:</span> {user?.email}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </ProtectedRoute>
  );
}

