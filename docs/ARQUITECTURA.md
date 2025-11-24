# Arquitectura del Frontend - Taller

## 🏗️ Estructura General

```
frontend/
├── src/
│   ├── app/                          # Páginas Next.js (App Router)
│   │   ├── layout.tsx               # Layout raíz
│   │   ├── page.tsx                 # Página raíz (/ - redirige)
│   │   ├── providers.tsx            # Provider de React Query
│   │   ├── globals.css              # Estilos globales
│   │   ├── login/
│   │   │   └── page.tsx             # Página de login
│   │   ├── dashboard/
│   │   │   └── page.tsx             # Dashboard principal
│   │   ├── clientes/
│   │   │   └── page.tsx             # Lista de clientes
│   │   ├── vehiculos/
│   │   │   └── page.tsx             # Lista de vehículos
│   │   ├── productos/
│   │   │   └── page.tsx             # Inventario (admin only)
│   │   ├── servicios/
│   │   │   └── page.tsx             # Servicios (mechanic/admin)
│   │   ├── ventas/
│   │   │   └── page.tsx             # Ventas (seller/admin)
│   │   └── recordatorios/
│   │       └── page.tsx             # Recordatorios de mantenimiento
│   │
│   ├── components/                   # Componentes reutilizables
│   │   ├── ui/                      # Componentes base (sin lógica)
│   │   │   ├── Button.tsx
│   │   │   ├── Input.tsx
│   │   │   └── Card.tsx
│   │   ├── LoginForm.tsx            # Formulario de autenticación
│   │   ├── ClienteForm.tsx          # Formulario de clientes
│   │   ├── VehiculoForm.tsx         # Formulario de vehículos
│   │   ├── ProductoForm.tsx         # Formulario de productos
│   │   ├── Sidebar.tsx              # Barra lateral expandible
│   │   ├── Header.tsx               # Encabezado
│   │   └── ProtectedRoute.tsx       # Wrapper para rutas protegidas
│   │
│   ├── hooks/                        # Custom hooks (SOLO API calls)
│   │   ├── useAuth.ts               # Login, logout, /auth/me
│   │   ├── useClientes.ts           # CRUD clientes
│   │   ├── useVehiculos.ts          # CRUD vehículos
│   │   ├── useProductos.ts          # CRUD productos
│   │   ├── useServicios.ts          # CRUD servicios
│   │   ├── useVentas.ts             # CRUD ventas
│   │   └── useRecordatorios.ts      # Recordatorios
│   │
│   ├── lib/
│   │   └── utils.ts                 # Funciones auxiliares
│   │       ├── cn()                 # Merge de clases Tailwind
│   │       ├── formatCurrency()     # Formato de moneda
│   │       ├── formatDate()         # Formato de fecha
│   │       └── hasRole()            # Check de roles
│   │
│   ├── stores/                       # Zustand (UI state only)
│   │   └── sidebarStore.ts          # Estado del sidebar
│   │
│   ├── types/
│   │   └── index.ts                 # Todos los tipos TypeScript
│   │
│   └── utils/
│       └── axiosClient.ts           # Instancia HTTP con interceptors
│
├── public/                           # Assets estáticos
├── .env.local                        # Variables de entorno
├── .env.example                      # Ejemplo de variables
├── tsconfig.json                     # Configuración TypeScript
├── tailwind.config.ts                # Configuración Tailwind
├── next.config.js                    # Configuración Next.js
├── package.json                      # Dependencias
├── README.md                         # Documentación completa
├── GUIA_RAPIDA.md                    # Guía rápida de desarrollo
└── ARQUITECTURA.md                   # Este archivo
```

## 🔄 Flujo de Datos

```
┌─────────────────┐
│   User Input    │
│   (formulario)  │
└────────┬────────┘
         │
         ▼
┌─────────────────────────┐
│   Componente (UI Only)  │ ← 'use client'
│   - Renderiza form      │
│   - Valida con Zod      │
│   - Llama hook on submit│
└────────┬────────────────┘
         │ onSubmit(data)
         ▼
┌──────────────────────────────┐
│   Custom Hook                │
│   (useXXX.ts)                │
│   - useMutation              │
│   - useQuery                 │
│   - TanStack Query           │
└────────┬─────────────────────┘
         │
         ▼
┌──────────────────────────────┐
│   axiosClient                │
│   - Agrega token             │
│   - Envía request            │
│   - Maneja errores 401       │
└────────┬─────────────────────┘
         │
         ▼
┌──────────────────────────────┐
│   Backend API                │
│   (/auth, /clientes, etc)    │
└──────────────────────────────┘
```

## 📋 Flujo de Autenticación

```
GET /                       → Redirige a /login o /dashboard
    │
    ├─ No autenticado → /login
    └─ Autenticado → /dashboard

POST /auth/login
    ├─ Email + Password
    └─ Response: { user, token }

GET /auth/me (cada navegación)
    ├─ Verifica token
    ├─ Si válido: obtiene datos del usuario
    └─ Si 401: redirige a /login

Logout
    └─ Limpia localStorage
    └─ Redirige a /login
```

## 🎯 Patrones de Desarrollo

### 1. Hook para API Calls
```typescript
// src/hooks/useXXX.ts
export const useXXX = () => {
  const queryClient = useQueryClient();

  // Query: GET
  const { data, isLoading, error } = useQuery({
    queryKey: ['xxx'],
    queryFn: async () => {
      const res = await axiosClient.get('/endpoint');
      return res.data;
    },
  });

  // Mutation: POST/PUT/DELETE
  const createMutation = useMutation({
    mutationFn: async (data) => {
      const res = await axiosClient.post('/endpoint', data);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['xxx'] });
    },
  });

  return {
    items: data || [],
    isLoading,
    error,
    createItem: createMutation.mutate,
    isCreating: createMutation.isPending,
  };
};
```

### 2. Componente de Página
```typescript
// src/app/xxx/page.tsx
'use client';

import { ProtectedRoute } from '@/components/ProtectedRoute';
import { useXXX } from '@/hooks/useXXX';

export default function XXXPage() {
  const { items, createItem, isCreating } = useXXX();

  const handleSubmit = (data) => {
    createItem(data);
  };

  return (
    <ProtectedRoute>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold text-tesla-text">
          XXX
        </h1>
        {/* Contenido */}
      </div>
    </ProtectedRoute>
  );
}
```

### 3. Componente de Formulario
```typescript
// src/components/XXXForm.tsx
'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const schema = z.object({
  field: z.string().min(1, 'Requerido'),
});

interface XXXFormProps {
  item?: XXX;
  onSubmit: (data: FormData) => void;
  isSubmitting: boolean;
}

export const XXXForm: React.FC<XXXFormProps> = ({
  item,
  onSubmit,
  isSubmitting,
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: item,
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {/* Campos */}
      <Button type="submit" disabled={isSubmitting}>
        Guardar
      </Button>
    </form>
  );
};
```

## 🔐 Control de Acceso por Rol

```typescript
// src/hooks/useAuth.ts - proporciona user.role

// Roles disponibles
type UserRole = 'admin' | 'mechanic' | 'seller' | 'viewer';

// En componentes
const { user } = useAuth();

if (user?.role !== 'admin') {
  return <Forbidden />;
}

// O usar hasRole
import { hasRole } from '@/lib/utils';

if (!hasRole(user?.role, ['admin', 'mechanic'])) {
  return <Forbidden />;
}
```

## 🎨 Sistema de Diseño

### Colores Tesla
```css
--tesla-bg: #000000;      /* Negro puro */
--tesla-text: #ffffff;     /* Blanco puro */
--tesla-accent: #e50914;   /* Rojo Netflix */
--tesla-border: #333333;   /* Gris oscuro */
--tesla-hover: #1a1a1a;    /* Gris muy oscuro */
```

### Componentes Base
- **Button**: 4 variantes (default, outline, ghost, secondary)
- **Input**: Campo de texto con estilos Tesla
- **Card**: Contenedor con header, title, content, footer

## 🚀 Flujo de Desarrollo

1. **Backend define API**: POST /clientes, GET /clientes, etc.
2. **Frontend crea tipos**: Agregar interfaces en `types/index.ts`
3. **Frontend crea hook**: Crear `hooks/useClientes.ts` con queries/mutations
4. **Frontend crea formularios**: Si es necesario, crear componentes de formulario
5. **Frontend crea página**: Crear archivo `app/clientes/page.tsx`
6. **Frontend agrega a sidebar**: Agregar item de navegación en `Sidebar.tsx`
7. **Pruebas**: Verificar que funcione correctamente

## 📦 Dependencias Clave

```json
{
  "next": "15.0.0",              // Framework
  "react": "^19.0.0",            // UI
  "typescript": "^5.3.3",        // Tipado
  "tailwindcss": "^3.4.0",       // Estilos
  "react-hook-form": "^7.48.0",  // Formularios
  "zod": "^3.22.4",              // Validación
  "@tanstack/react-query": "^5.28.0", // Caching/API
  "axios": "^1.6.2",             // HTTP
  "zustand": "^4.4.1",           // Estado UI
  "lucide-react": "^0.368.0",    // Iconos
}
```

## 🔧 Configuración

- **TypeScript**: `strict: true` - No se permite `any`
- **Next.js**: App Router habilitado
- **Tailwind**: Tema personalizado con colores Tesla
- **Axios**: Interceptors para token + manejo de 401

## ⚡ Performance

- **Query Caching**: 5 minutos default
- **Code Splitting**: Automático por ruta
- **Image Optimization**: Incluido con Next.js
- **Bundle Size**: ~150KB inicial

## 🐛 Debugging

### En desarrollo
```bash
pnpm dev
# Abre http://localhost:3000
# Abre DevTools (F12)
# Ve a Network tab para ver requests
```

### Logs útiles
```typescript
console.log('Token:', localStorage.getItem('token'));
console.log('User:', useAuth().user);
console.log('Data:', useXXX().items);
```

## 📞 Endpoints Esperados

```
POST   /auth/login
GET    /auth/me
POST   /auth/logout

GET    /clientes
POST   /clientes
PATCH  /clientes/:id
DELETE /clientes/:id

GET    /vehiculos
POST   /vehiculos
PATCH  /vehiculos/:id
DELETE /vehiculos/:id

GET    /productos
POST   /productos
PATCH  /productos/:id
DELETE /productos/:id

GET    /servicios
POST   /servicios
PATCH  /servicios/:id
DELETE /servicios/:id

GET    /ventas
POST   /ventas
PATCH  /ventas/:id
DELETE /ventas/:id

GET    /recordatorios
POST   /recordatorios/:id/send-whatsapp
```

---

**Última actualización**: Noviembre 2024

