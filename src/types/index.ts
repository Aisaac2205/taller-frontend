export type UserRole = 'admin' | 'owner' | 'mechanic' | 'recepcion';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  createdAt: string;
  updatedAt: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export interface Cliente {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  createdAt: string;
  updatedAt: string;
}

export interface Vehiculo {
  id: string;
  clienteId: string;
  marca: string;
  modelo: string;
  anio: number;
  placa: string;
  vin: string;
  kmActual: number;
  createdAt: string;
  updatedAt: string;
}

export interface Producto {
  id: string;
  nombre: string;
  descripcion: string;
  precio: number;
  stock: number;
  sku: string;
  categoria: string;
  createdAt: string;
  updatedAt: string;
}

export interface Servicio {
  id: string;
  vehiculoId: string;
  descripcion: string;
  fechaServicio: string;
  productos: ProductoServicio[];
  total: number;
  estado: 'pendiente' | 'en_progreso' | 'completado' | 'cancelado';
  createdAt: string;
  updatedAt: string;
  tipo?: 'REEMPLAZO_PIEZA' | 'CAMBIO_ACEITE' | 'GENERAL';
  proximoCambioKm?: number;
  proximoCambioFecha?: string;
  piezaReemplazada?: string;
}

export interface ProductoServicio {
  productoId: string;
  cantidad: number;
  precioUnitario: number;
}

export interface Venta {
  id: string;
  clienteId: string;
  productos: ProductoVenta[];
  total: number;
  estado: 'pendiente' | 'completado' | 'cancelado';
  createdAt: string;
  updatedAt: string;
}

export interface ProductoVenta {
  productoId: string;
  cantidad: number;
  precioUnitario: number;
}

export interface Recordatorio {
  id: string;
  vehiculoId: string;
  tipo: string;
  proximaFecha: string;
  descripcion: string;
  notificado: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ApiError {
  message: string;
  code: string;
  details?: Record<string, unknown>;
}

