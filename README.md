# Taller - Frontend

Sistema de gestión para talleres mecánicos construido con Next.js 15, TypeScript, TailwindCSS y shadcn/ui.

## 🚀 Tecnologías

- **Framework**: Next.js 15 (App Router)
- **Lenguaje**: TypeScript (strict mode)
- **Estilos**: TailwindCSS + shadcn/ui
- **Iconos**: Lucide React
- **Formularios**: React Hook Form + Zod
- **HTTP**: Axios
- **Query**: TanStack React Query
- **Estado**: Zustand (UI state only)
- **Package Manager**: pnpm

## 📋 Requisitos

- Node.js 18+
- pnpm 8+

## 🛠️ Instalación

1. Instalar dependencias:
```bash
pnpm install
```

2. Configurar variables de entorno:
```bash
cp .env.example .env.local
# Actualiza NEXT_PUBLIC_API_URL con la URL de tu backend
```

## 🚀 Desarrollo

Ejecutar servidor de desarrollo:
```bash
pnpm dev
```

La aplicación se abrirá en `http://localhost:3000`

## 🏗️ Construcción

Compilar para producción:
```bash
pnpm build
```

Ejecutar servidor de producción:
```bash
pnpm start
```

## 📁 Estructura del Proyecto

```
src/
├── app/                    # Páginas Next.js (App Router)
│   ├── dashboard/         # Dashboard principal
│   ├── clientes/          # Gestión de clientes
│   ├── vehiculos/         # Gestión de vehículos
│   ├── productos/         # Inventario de productos (admin)
│   ├── servicios/         # Registro de servicios (mechanic/admin)
│   ├── ventas/            # Ventas directas (seller/admin)
│   ├── recordatorios/     # Mantenimientos programados
│   ├── login/             # Página de login
│   └── layout.tsx         # Layout raíz
├── components/            # Componentes reutilizables
│   ├── ui/               # Componentes base (Button, Input, Card)
│   ├── LoginForm.tsx     # Formulario de autenticación
│   ├── ClienteForm.tsx   # Formulario de clientes
│   ├── VehiculoForm.tsx  # Formulario de vehículos
│   ├── ProductoForm.tsx  # Formulario de productos
│   ├── Sidebar.tsx       # Barra lateral (expandible)
│   ├── Header.tsx        # Encabezado
│   └── ProtectedRoute.tsx # Wrapper para rutas protegidas
├── hooks/                 # Custom hooks (solo API calls)
│   ├── useAuth.ts        # Autenticación
│   ├── useClientes.ts    # CRUD clientes
│   ├── useVehiculos.ts   # CRUD vehículos
│   ├── useProductos.ts   # CRUD productos
│   ├── useServicios.ts   # CRUD servicios
│   ├── useVentas.ts      # CRUD ventas
│   └── useRecordatorios.ts # Recordatorios
├── lib/
│   └── utils.ts          # Utilidades (cn, formatCurrency, formatDate, hasRole)
├── stores/
│   └── sidebarStore.ts   # Zustand store para estado UI
├── types/
│   └── index.ts          # Tipos TypeScript
└── utils/
    └── axiosClient.ts    # Cliente HTTP configurado
```

## 🔐 Autenticación

- **Endpoint**: `POST /auth/login`
- **Response**: `{ user: User, token: string }`
- **Token**: Almacenado en localStorage y enviado en headers
- **Protección**: 401 redirige a `/login`

## 👥 Roles y Permisos

```
admin     - Acceso total a todas las funciones
mechanic  - Servicios, clientes, vehículos
seller    - Ventas, clientes, productos
viewer    - Solo lectura
```

## 📝 Reglas de Desarrollo

✅ **DO**:
- Todos los API calls van en hooks (`src/hooks/`)
- Componentes son pure UI (sin lógica de negocio)
- Usar TypeScript strict mode
- Usar zod para validación de formularios
- Usar React Hook Form para formularios
- Usar TanStack Query para caching y sincronización

❌ **DON'T**:
- Llamadas axios dentro de componentes
- Cálculos de totales en componentes (backend lo hace)
- Cualquier tipo `any`
- Props drilling (usar context si es necesario)

## 🎨 Estilos

### Colores Tesla
```
bg: #000000 (negro)
text: #ffffff (blanco)
accent: #e50914 (rojo)
border: #333333
hover: #1a1a1a
```

### Componentes
Todos los componentes base están en `src/components/ui/`:
- Button (variants: default, outline, ghost, secondary)
- Input
- Card (con Header, Title, Content, Footer)

## 🔄 Estado

- **Query State**: TanStack Query (caching, sincronización)
- **UI State**: Zustand (sidebar open/close)
- **Form State**: React Hook Form (validación con Zod)

## 📦 Despliegue

```bash
# Compilar
pnpm build

# Verificar
pnpm start

# Usar variables de entorno en producción
NEXT_PUBLIC_API_URL=https://api.example.com pnpm start
```

## 🐛 Troubleshooting

### Puerto 3000 en uso
```bash
# Windows: Encontrar el proceso
netstat -ano | findstr :3000

# Linux/Mac
lsof -i :3000

# Cambiar puerto
pnpm dev -- -p 3001
```

### Token expirado
El cliente redirige automáticamente a `/login` si recibe un 401.

### Variables de entorno no se cargan
- Asegúrate de usar `NEXT_PUBLIC_` para variables públicas
- Reinicia el servidor de desarrollo después de cambiar `.env.local`

## 📚 Documentación Adicional

- [Next.js App Router](https://nextjs.org/docs)
- [TypeScript](https://www.typescriptlang.org/)
- [TailwindCSS](https://tailwindcss.com/)
- [React Hook Form](https://react-hook-form.com/)
- [Zod](https://zod.dev/)
- [TanStack Query](https://tanstack.com/query/latest/)
- [Zustand](https://github.com/pmndrs/zustand)

