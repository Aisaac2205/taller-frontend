# 🚀 Instalación Rápida

## ⚡ 3 Pasos para Empezar

### Paso 1: Instalar Dependencias
```bash
cd C:\Users\Asus\Documents\Taller\frontend
pnpm install
```

✅ Esto instala todas las librerías necesarias (~221 paquetes)

### Paso 2: Configurar Variables de Entorno
```bash
# El archivo .env.local ya existe con:
# NEXT_PUBLIC_API_URL=http://localhost:3001/api

# Si necesitas cambiar la API URL:
# Edita .env.local
```

### Paso 3: Iniciar Servidor de Desarrollo
```bash
pnpm dev
```

✅ Abre http://localhost:3000 en tu navegador

---

## 🎯 Flujo Completo

```bash
# 1. Asegúrate de tener pnpm
npm install -g pnpm

# 2. Ve a la carpeta del frontend
cd C:\Users\Asus\Documents\Taller\frontend

# 3. Instala dependencias
pnpm install

# 4. Inicia desarrollo
pnpm dev

# 5. Abre en navegador
# http://localhost:3000/login
```

---

## 🔐 Credenciales de Prueba

Una vez que el backend esté corriendo, usa:
```
Email: user@example.com
Password: password123
```

(O las que tu backend proporcione)

---

## 📦 Versiones Instaladas

| Paquete | Versión |
|---------|---------|
| Next.js | 15.0.0 |
| React | 19.2.0 |
| TypeScript | 5.9.3 |
| TailwindCSS | 3.4.18 |
| React Hook Form | 7.66.0 |
| Zod | 3.25.76 |
| TanStack Query | 5.90.7 |
| Axios | 1.13.2 |
| Zustand | 4.5.7 |

---

## ✅ Verificar Instalación

Después de `pnpm install`, verifica que no hay errores:

```bash
# Ver si todo está bien
pnpm lint

# Compilar (sin ejecutar)
pnpm build

# Debe mostrar: "✓ Compiled successfully"
```

---

## 🌐 Estructura de Carpetas Creada

```
frontend/
├── src/
│   ├── app/           ✅ 8 páginas
│   ├── components/    ✅ 10 componentes
│   ├── hooks/         ✅ 7 hooks
│   ├── lib/           ✅ Utils
│   ├── stores/        ✅ Zustand
│   ├── types/         ✅ TypeScript
│   └── utils/         ✅ axiosClient
├── node_modules/      ✅ 221 paquetes
├── .next/             ✅ Build output
├── public/            ✅ Assets
├── .env.local         ✅ Configurado
├── tsconfig.json      ✅ TypeScript strict
├── tailwind.config.ts ✅ Tesla theme
├── next.config.js     ✅ Configurado
├── package.json       ✅ Dependencies
└── README.md          ✅ Documentación
```

---

## 🛠️ Comandos Disponibles

```bash
# Desarrollo (localhost:3000)
pnpm dev

# Build para producción
pnpm build

# Ejecutar modo producción
pnpm start

# Linting
pnpm lint
```

---

## 🐛 Si Algo Falla

### Error: "pnpm: command not found"
```bash
# Instalar pnpm globalmente
npm install -g pnpm

# Verificar
pnpm --version  # Debe mostrar 10.18.3+
```

### Error: "Port 3000 in use"
```bash
# Usar otro puerto
pnpm dev -- -p 3001
```

### Error: "Module not found"
```bash
# Reinstalar dependencias
rm -rf node_modules pnpm-lock.yaml
pnpm install
```

### Error: "Cannot find API"
```bash
# Verificar que el backend esté corriendo
# http://localhost:3001/api debe estar disponible

# Si no, edita .env.local con la URL correcta
NEXT_PUBLIC_API_URL=http://tu-backend-url/api
```

---

## ✨ Características Listas para Usar

- ✅ Login / Logout
- ✅ Dashboard
- ✅ Gestión de Clientes
- ✅ Gestión de Vehículos
- ✅ Inventario de Productos
- ✅ Registro de Servicios
- ✅ Ventas Directas
- ✅ Recordatorios
- ✅ Sidebar Responsive
- ✅ Control de Roles

---

## 📚 Documentación Disponible

- `README.md` - Documentación completa
- `GUIA_RAPIDA.md` - Preguntas frecuentes
- `ARQUITECTURA.md` - Estructura del código
- `RESUMEN_PROYECTO.md` - Estado del proyecto
- `DEPLOY.md` - Cómo desplegar

---

## 🎓 Próximos Pasos

1. ✅ Instalación completada
2. 🔌 Conectar con tu backend
3. 🧪 Probar las características
4. 🎨 Personalizar si es necesario
5. 🚀 Desplegar a producción

---

## 💡 Pro Tips

- Usa `pnpm` en lugar de `npm` para mejor rendimiento
- TypeScript está en modo strict - resuelve todos los errores
- Consulta `GUIA_RAPIDA.md` para patrones comunes
- Los estilos Tesla están configurados - solo úsalos
- Los formularios validan con Zod automáticamente

---

## 🆘 Necesitas Ayuda?

- Lee los archivos .md en la carpeta
- Verifica la sección "Troubleshooting" en README.md
- Revisa los ejemplos en los componentes existentes
- TypeScript te ayudará - sigue las sugerencias

---

## ✅ Estás Listo!

Una vez que ejecutes `pnpm dev` y veas:
```
✓ Ready in XXms
- Local:        http://localhost:3000
```

¡Ya puedes empezar! 🎉

---

**Última actualización**: Noviembre 2024

