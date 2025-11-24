# 🎯 START HERE - Taller Frontend

**¡Bienvenido!** Este documento te guiará en menos de 5 minutos.

## ⚡ Quick Start (2 minutos)

```bash
# 1. Abre PowerShell aquí
cd C:\Users\Asus\Documents\Taller\frontend

# 2. Instala dependencias (si no lo hiciste)
pnpm install

# 3. Inicia el servidor
pnpm dev

# 4. Abre http://localhost:3000/login
```

**¡Listo!** Verás la página de login. 🎉

## 📚 Documentación en Español

Este proyecto incluye documentación completa:

| Archivo | Tiempo | Para Quién |
|---------|--------|-----------|
| **COMIENZA_AQUI.txt** | 2 min | Todos |
| **INSTALAR.md** | 5 min | Nuevos usuarios |
| **README.md** | 20 min | Referencia completa |
| **GUIA_RAPIDA.md** | 10 min | Desarrolladores |
| **ARQUITECTURA.md** | 15 min | Entender estructura |
| **RESUMEN_PROYECTO.md** | 5 min | Estado del proyecto |
| **DEPLOY.md** | 15 min | Deploy a producción |

## 🎯 Tu Ruta de Aprendizaje

### Día 1: Setup (30 minutos)
1. Lee **COMIENZA_AQUI.txt** (2 min)
2. Sigue **INSTALAR.md** (5 min)
3. Ejecuta `pnpm dev` (5 min)
4. Prueba la app en http://localhost:3000 (10 min)
5. Lee **README.md** parcialmente (8 min)

### Día 2: Estructura (1 hora)
1. Lee **ARQUITECTURA.md** (20 min)
2. Explora la estructura de carpetas (10 min)
3. Lee un componente (`src/components/LoginForm.tsx`) (10 min)
4. Lee un hook (`src/hooks/useAuth.ts`) (10 min)
5. Prueba la app más (10 min)

### Día 3+: Desarrollo (según necesites)
1. Consulta **GUIA_RAPIDA.md** para patrones
2. Sigue los ejemplos en el código
3. TypeScript te guiará
4. Lee tipos en `src/types/index.ts`

## ❓ Preguntas Rápidas

**¿Cómo agrego una nueva página?**
→ Ver **GUIA_RAPIDA.md** sección "Agregar una Característica Nueva"

**¿Cómo funciona la autenticación?**
→ Ver **README.md** sección "Autenticación"

**¿Cómo conecto con mi backend?**
→ Edita `.env.local` y actualiza `NEXT_PUBLIC_API_URL`

**¿Cómo despliego a producción?**
→ Ver **DEPLOY.md**

**¿Tengo errores TypeScript?**
→ Lee el error - TypeScript es muy descriptivo
→ Revisa `src/types/index.ts` para tipos

## 🔐 Credenciales de Prueba

Cuando tu backend esté listo:
```
Email: user@example.com
Password: password123
```

(O las que tu backend proporcione)

## ✨ Lo que ya está hecho

- ✅ 8 Páginas completamente funcionales
- ✅ Autenticación (login/logout)
- ✅ CRUD para clientes, vehículos, productos
- ✅ Servicios y ventas
- ✅ Recordatorios con WhatsApp
- ✅ Control de roles
- ✅ Formularios con validación
- ✅ Sidebar expandible
- ✅ Tema Tesla (Negro + Blanco + Rojo)
- ✅ TypeScript strict

## 🔧 Tech Stack

```
Frontend:        Next.js 15 + React 19 + TypeScript 5
Styling:         TailwindCSS 3 + shadcn/ui
Forms:           React Hook Form + Zod
State:           TanStack Query + Zustand
HTTP:            Axios
Icons:           Lucide React
```

## 📋 Archivos Clave a Conocer

```
src/
├── app/              ← Tus páginas
├── components/       ← Componentes reutilizables
├── hooks/           ← Lógica de API (IMPORTANTE)
├── types/index.ts   ← Todos los tipos
├── lib/utils.ts     ← Funciones auxiliares
└── stores/          ← Estado UI (Zustand)
```

## 🎓 Principios Clave

1. **No axios en componentes** → Solo en hooks
2. **TypeScript strict** → Sin tipos "any"
3. **Validación con Zod** → En formularios
4. **Componentes sin lógica** → Solo UI
5. **TanStack Query** → Para caching/sincronización

## 🚀 Comandos Útiles

```bash
pnpm dev      # Desarrollo (http://localhost:3000)
pnpm build    # Build para producción
pnpm start    # Ejecutar build
pnpm lint     # Validar TypeScript/ESLint
```

## 🐛 Si Algo Falla

**Error: Port 3000 en uso**
```bash
pnpm dev -- -p 3001
```

**Error: Module not found**
```bash
rm -rf node_modules
pnpm install
```

**Error: API no conecta**
```
1. Verifica que backend corre en http://localhost:3001
2. Verifica .env.local
3. Revisa NEXT_PUBLIC_API_URL
```

**Error de TypeScript**
```
Lee el error - es muy descriptivo
Consulta src/types/index.ts
Usa interfaces exportadas
```

## 💡 Pro Tips

- Usa Ctrl+Click en componentes para ir a su definición
- Hover sobre variables para ver tipos
- TypeScript autocompletará imports
- Los hooks maneja el caching automáticamente
- `formatCurrency()` para precios
- `formatDate()` para fechas

## 📖 Lectura Ordenada

```
1. COMIENZA_AQUI.txt        ← Empeza aquí
   ↓
2. INSTALAR.md               ← Instala todo
   ↓
3. README.md (partes clave)  ← Entiende estructura
   ↓
4. GUIA_RAPIDA.md            ← Patrones de código
   ↓
5. ARQUITECTURA.md           ← Profundiza en diseño
   ↓
6. DEPLOY.md (cuando necesites) ← Producción
```

## 🎯 Próximos Pasos

- [ ] Ejecuta `pnpm dev`
- [ ] Abre http://localhost:3000
- [ ] Prueba navegación
- [ ] Prueba login (con backend)
- [ ] Lee GUIA_RAPIDA.md
- [ ] Personaliza si es necesario
- [ ] Agrega tus propias páginas

## 🌟 Características Especiales

- 🎨 Tema Tesla personalizado (colores configurables)
- 📱 Responsive en móvil (probado)
- 🔐 Control de roles (admin/mechanic/seller/viewer)
- 🔄 Caching inteligente (TanStack Query)
- 📝 Formularios validados (Zod)
- ⚡ Bundle size optimizado (~150KB)
- 🚀 Listo para producción

## 📞 Estructura de Carpetas (Resumen)

```
frontend/
├── src/
│   ├── app/               # 8 páginas
│   ├── components/        # 10 componentes UI
│   ├── hooks/            # 7 hooks (API)
│   ├── lib/              # Utilidades
│   ├── stores/           # Zustand
│   ├── types/            # TypeScript
│   └── utils/            # axiosClient
├── public/               # Assets estáticos
├── node_modules/         # Dependencias (221)
├── .env.local            # Configuración local
├── package.json          # Dependencies
└── docs/                 # Documentación
```

## ✅ Checklist

- [ ] Node.js 18+ instalado
- [ ] pnpm instalado
- [ ] `pnpm install` completado
- [ ] `.env.local` configurado
- [ ] `pnpm dev` ejecutándose
- [ ] http://localhost:3000 funciona
- [ ] Has leído COMIENZA_AQUI.txt
- [ ] Comprendes la estructura

## 🎉 ¡Estás Listo!

Ejecuta ahora:
```bash
pnpm dev
```

Luego abre:
```
http://localhost:3000/login
```

**¡Bienvenido al proyecto!** 🚀

---

## 📚 Referencias Rápidas

- **Componentes**: `src/components/ui/`
- **Hooks API**: `src/hooks/`
- **Tipos**: `src/types/index.ts`
- **Utilidades**: `src/lib/utils.ts`
- **Configuración**: `tailwind.config.ts`, `tsconfig.json`

## 🔗 Enlaces Útiles

- [Next.js Docs](https://nextjs.org/docs)
- [React Docs](https://react.dev)
- [TypeScript](https://www.typescriptlang.org)
- [TailwindCSS](https://tailwindcss.com)
- [Zod](https://zod.dev)

---

**Última actualización**: Noviembre 2024  
**Estado**: ✅ COMPLETAMENTE FUNCIONAL  
**Tiempo para empezar**: 2 minutos

¡Que disfrutes! 🎊

