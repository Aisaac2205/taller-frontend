# 🚀 Guía de Despliegue - Taller Frontend

## Opciones de Despliegue

### 1. Vercel (Recomendado para Next.js)

**Ventajas**: 
- Despliegue automático desde Git
- Serverless functions
- CDN global
- SSL automático

**Pasos**:
```bash
# 1. Sube el código a GitHub
git init
git add .
git commit -m "Initial commit"
git push origin main

# 2. Ve a https://vercel.com
# 3. Conéctate con GitHub
# 4. Selecciona el repositorio
# 5. Configura variables de entorno:
#    NEXT_PUBLIC_API_URL=https://api.example.com

# 6. Click en Deploy
```

### 2. Self-Hosted (VPS/Servidor Propio)

**Requisitos**:
- Node.js 18+
- pnpm (o npm)
- Reverse proxy (Nginx)
- SSL (Let's Encrypt)

**Pasos**:
```bash
# En tu servidor
cd /opt/taller-frontend

# Clonar repo
git clone <tu-repo> .

# Instalar dependencias
pnpm install --prod

# Compilar
pnpm build

# Crear archivo .env.production
cat > .env.production << EOF
NEXT_PUBLIC_API_URL=https://api.example.com
EOF

# Iniciar con PM2
npm install -g pm2
pm2 start "pnpm start" --name "taller-frontend"
pm2 save

# O con systemd
sudo systemctl start taller-frontend
```

**Configuración Nginx**:
```nginx
server {
    listen 443 ssl http2;
    server_name taller.example.com;

    ssl_certificate /etc/letsencrypt/live/taller.example.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/taller.example.com/privkey.pem;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

### 3. Docker

**Dockerfile**:
```dockerfile
FROM node:18-alpine

WORKDIR /app

# Instalar pnpm
RUN npm install -g pnpm

# Copiar archivos
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --prod

COPY . .

# Build
RUN pnpm build

# Expose port
EXPOSE 3000

# Start
CMD ["pnpm", "start"]
```

**docker-compose.yml**:
```yaml
version: '3.8'

services:
  frontend:
    build: .
    ports:
      - "3000:3000"
    environment:
      NEXT_PUBLIC_API_URL: https://api.example.com
    restart: unless-stopped
```

**Desplegar**:
```bash
docker-compose up -d
```

### 4. AWS Amplify

**Pasos**:
```bash
# 1. Instalar Amplify CLI
npm install -g @aws-amplify/cli

# 2. Configurar
amplify init

# 3. Agregar hosting
amplify add hosting
# Seleccionar "Hosting with Amplify Console"

# 4. Desplegar
amplify publish
```

### 5. Railway / Render / Heroku

Similares a Vercel. Pasos generales:

1. Conectar repo Git
2. Configurar variables de entorno
3. Build: `pnpm install && pnpm build`
4. Start: `pnpm start`
5. Exponer puerto 3000

## 🌍 Variables de Entorno por Ambiente

### Desarrollo
```
NEXT_PUBLIC_API_URL=http://localhost:3001/api
```

### Staging
```
NEXT_PUBLIC_API_URL=https://api-staging.example.com/api
```

### Producción
```
NEXT_PUBLIC_API_URL=https://api.example.com/api
```

## 🔒 Seguridad en Producción

1. **HTTPS**: Obligatorio
2. **Headers de Seguridad**:
```javascript
// next.config.js
module.exports = {
  headers: async () => {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY'
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block'
          }
        ]
      }
    ];
  }
};
```

3. **CORS**: Configurar en el backend
4. **Rate Limiting**: Implementar en el backend
5. **Token Expiration**: Implementar refresh tokens

## 📊 Monitoreo

### Sentry (Error Tracking)
```bash
npm install @sentry/nextjs
```

```javascript
// sentry.client.config.ts
import * as Sentry from '@sentry/nextjs';

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  environment: process.env.NODE_ENV,
});
```

### Google Analytics
```bash
npm install next-gtag
```

### Vercel Analytics (Automático)

## 📈 Performance Checklist

- [ ] Image optimization
- [ ] Code splitting
- [ ] CSS minification
- [ ] JavaScript minification
- [ ] Gzip compression
- [ ] CDN caching
- [ ] Bundle analysis

```bash
# Analizar bundle
pnpm add -D @next/bundle-analyzer
npm run analyze
```

## 🔄 CI/CD Pipeline

### GitHub Actions
```yaml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - uses: pnpm/action-setup@v2
        with:
          version: 8
      
      - uses: actions/setup-node@v3
        with:
          node-version: 18
          cache: 'pnpm'
      
      - run: pnpm install
      - run: pnpm lint
      - run: pnpm build
      
      - name: Deploy
        run: |
          # Tu comando de despliegue aquí
```

## 📋 Checklist Pre-Deploy

- [ ] Compilación correcta: `pnpm build`
- [ ] Sin errores TypeScript
- [ ] Variables de entorno configuradas
- [ ] API URL correcta
- [ ] HTTPS habilitado
- [ ] Dominios correctos en CORS
- [ ] Log levels configurados
- [ ] Monitoreo activado
- [ ] Backups configurados
- [ ] Rollback plan listo

## 🚨 Troubleshooting Despliegue

### Error: "Module not found"
```
Solución: Ejecutar "pnpm install" en el servidor
```

### Error: "Cannot find next"
```
Solución: Instalar devDependencies
pnpm install (sin --prod)
```

### Error: "Port already in use"
```
Solución: Cambiar puerto o matar proceso
lsof -i :3000
kill -9 <PID>
```

### Error: "API connection failed"
```
Solución: Verificar NEXT_PUBLIC_API_URL
Verificar CORS en backend
```

### Sitio lento
```
Solución: 
- Habilitar compression en Nginx
- Aumentar caché
- Aumentar recursos del servidor
```

## 📞 Monitoreo Post-Deploy

```bash
# Ver logs en tiempo real
pm2 logs taller-frontend

# Ver estado
pm2 status

# Reiniciar si es necesario
pm2 restart taller-frontend
```

## 🔄 Rollback

```bash
# Si algo sale mal
git revert <commit-hash>
git push

# En Vercel: Click en "Rollback"
# En Docker: Pull imagen anterior
# En PM2: pm2 restart con versión anterior
```

## 📝 Ejemplo Completo: Vercel

```bash
# 1. Crear cuenta en vercel.com

# 2. Conectar GitHub
# (Autorizar Vercel)

# 3. Crear .env.production
NEXT_PUBLIC_API_URL=https://api.tu-dominio.com/api

# 4. Push a GitHub
git add .
git commit -m "Listo para desplegar"
git push origin main

# 5. Vercel despliega automáticamente

# 6. Dominio personalizado
# Settings → Domains → Agregar dominio
```

## 🎯 Mejores Prácticas

1. **Versionamiento**: Mantener versionamiento semántico
2. **Branches**: Main para producción, develop para staging
3. **Testing**: Ejecutar tests antes de desplegar
4. **Approval**: Code review antes de merge
5. **Monitoring**: Alertas configuradas
6. **Logging**: Logs estructurados
7. **Backups**: Backups diarios
8. **Documentation**: Documentación actualizada

## 📚 Recursos

- [Next.js Deployment](https://nextjs.org/docs/deployment)
- [Vercel Docs](https://vercel.com/docs)
- [PM2 Docs](https://pm2.keymetrics.io/)
- [Nginx Docs](https://nginx.org/en/docs/)
- [Docker Docs](https://docs.docker.com/)

---

**Última actualización**: Noviembre 2024

