# Guía Rápida - Taller Frontend

## ⚡ Inicio Rápido

```bash
# 1. Instalar dependencias (si no lo hiciste)
pnpm install

# 2. Iniciar desarrollo
pnpm dev

# 3. Abre http://localhost:3000 en tu navegador
```

## 📁 Estructura Clave

```
src/
├── app/              # Páginas (Next.js App Router)
├── components/       # Componentes reutilizables
├── hooks/           # Lógica de API (SIEMPRE aquí)
├── lib/utils.ts     # Funciones auxiliares
├── stores/          # Estado UI (Zustand)
└── types/index.ts   # Tipos TypeScript
```

## 🔄 Flujo: Agregar una Característica Nueva

### 1. **Crear el Hook (API)**
```typescript
// src/hooks/useNuevaFeatura.ts
import { useMutation, useQuery } from '@tanstack/react-query';
import { axiosClient } from '@/utils/axiosClient';

export const useNuevaFeatura = () => {
  const { data, ...rest } = useQuery({
    queryKey: ['nuevaFeatura'],
    queryFn: async () => {
      const res = await axiosClient.get('/endpoint');
      return res.data;
    }
  });
  
  return { data, ...rest };
};
```

### 2. **Crear Formulario** (Si es necesario)
```typescript
// src/components/NuevaFeatureForm.tsx
'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const schema = z.object({
  nombre: z.string().min(1, 'Requerido'),
});

export const NuevaFeatureForm = ({ onSubmit, isSubmitting }) => {
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {/* Tu formulario aquí */}
    </form>
  );
};
```

### 3. **Crear la Página**
```typescript
// src/app/nuevafeature/page.tsx
'use client';

import { ProtectedRoute } from '@/components/ProtectedRoute';
import { useNuevaFeatura } from '@/hooks/useNuevaFeatura';
import { NuevaFeatureForm } from '@/components/NuevaFeatureForm';

export default function NuevaFeaturePage() {
  const { data, isLoading } = useNuevaFeatura();

  return (
    <ProtectedRoute>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold text-tesla-text">Nueva Feature</h1>
        {/* Tu contenido aquí */}
      </div>
    </ProtectedRoute>
  );
}
```

## 🎨 Componentes Reutilizables

```typescript
// Button
import { Button } from '@/components/ui/Button';
<Button variant="default|outline|ghost|secondary" size="sm|md|lg">
  Haz clic
</Button>

// Input
import { Input } from '@/components/ui/Input';
<Input type="text|email|password|number" placeholder="Escribe..." />

// Card
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/Card';
<Card>
  <CardHeader><CardTitle>Título</CardTitle></CardHeader>
  <CardContent>Contenido</CardContent>
</Card>
```

## 🔐 Control de Acceso

```typescript
// En componentes:
import { useAuth } from '@/hooks/useAuth';

const { user } = useAuth();

if (user?.role !== 'admin') {
  return <div>Acceso denegado</div>;
}

// O usa hasRole
import { hasRole } from '@/lib/utils';

if (!hasRole(user?.role, ['admin', 'mechanic'])) {
  return <div>Acceso denegado</div>;
}
```

## 💾 Llamadas API (Hooks)

```typescript
// ✅ BIEN: En un hook
const useClientes = () => {
  const { data } = useQuery({
    queryKey: ['clientes'],
    queryFn: () => axiosClient.get('/clientes').then(r => r.data)
  });
  return { clientes: data || [] };
};

// ❌ MAL: En un componente
const MyComponent = () => {
  const [data, setData] = useState([]);
  useEffect(() => {
    axiosClient.get('/clientes').then(r => setData(r.data)); // ❌ MAL
  }, []);
};
```

## 📋 Formularios con Validación

```typescript
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const schema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'Mínimo 6 caracteres'),
});

type FormData = z.infer<typeof schema>;

const MyForm = () => {
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  return (
    <form onSubmit={handleSubmit((data) => console.log(data))}>
      <input {...register('email')} />
      {errors.email && <p>{errors.email.message}</p>}
      {/* ... más campos ... */}
    </form>
  );
};
```

## 🎯 Estilos Rápidos

```typescript
// Tesla Theme
bg-tesla-bg      // Negro #000
text-tesla-text  // Blanco #fff
bg-tesla-accent  // Rojo #e50914
border-tesla-border
bg-tesla-hover

// Ejemplos
<div className="bg-tesla-bg text-tesla-text border border-tesla-border">
  <button className="bg-tesla-accent hover:bg-red-700">
    Botón rojo
  </button>
</div>
```

## 🔄 Flujo de Autenticación

1. Usuario va a `/login`
2. Completa formulario → POST `/auth/login`
3. Recibe `{ user, token }`
4. Token se guarda en localStorage
5. Se redirige a `/dashboard`
6. Todas las rutas son protegidas con `<ProtectedRoute>`
7. Si token expira (401) → redirige a `/login`

## 🚀 Desplegar a Producción

```bash
# Build
pnpm build

# Verificar
pnpm start

# En producción, establece:
NEXT_PUBLIC_API_URL=https://api.example.com
```

## 🐛 Problemas Comunes

### "Token no se envía a la API"
✅ Solución: El token se envía automáticamente. Verifica que esté en localStorage:
```javascript
console.log(localStorage.getItem('token'));
```

### "Mi componente se renderiza dos veces"
✅ Normal: Next.js en desarrollo renderiza 2 veces para detectar problemas.

### "Las variables de entorno no se cargan"
✅ Solu: Reinicia el servidor (`pnpm dev`) después de cambiar `.env.local`

### "Port 3000 en uso"
✅ Solución:
```bash
pnpm dev -- -p 3001  # Usa puerto 3001
```

## 📝 Checklist para Nueva Página

- [ ] Crear hook en `src/hooks/useXXX.ts`
- [ ] Crear componentes en `src/components/XXXForm.tsx`
- [ ] Crear página en `src/app/xxx/page.tsx`
- [ ] Envolver con `<ProtectedRoute>`
- [ ] Agregar iconos en `Sidebar.tsx` si es pública
- [ ] Agregar validaciones con Zod
- [ ] Verificar permisos de rol
- [ ] Probar con `pnpm dev`

## 🔗 Links Útiles

- [Documentación Next.js](https://nextjs.org/docs)
- [React Hook Form](https://react-hook-form.com/)
- [Zod Validation](https://zod.dev/)
- [TailwindCSS](https://tailwindcss.com/)
- [TanStack Query](https://tanstack.com/query/latest/)

## 💡 Tips Pro

1. Usa `formatCurrency()` para precios
2. Usa `formatDate()` para fechas
3. Siempre usa `@/` para imports (alias)
4. Los errores de API van en el hook, no en el componente
5. Usa `isLoading`, `error` directamente del hook
6. Componentes must be `'use client'` si usan hooks
7. TypeScript `strict: true` - resuelve todos los errores

---

**¿Necesitas ayuda?** Revisa `README.md` para documentación completa.

