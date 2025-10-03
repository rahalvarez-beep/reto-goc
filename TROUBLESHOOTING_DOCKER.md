# 🛠️ Guía de Troubleshooting - Docker Compose

## 📋 **Resumen**

Esta guía proporciona soluciones detalladas para los problemas más comunes que pueden ocurrir al ejecutar `docker-compose` en el proyecto Smart City Identity Management System.

---

## 🎯 **Objetivo**

Resolver eficientemente problemas de:
- ✅ **Build failures** (errores de compilación)
- ✅ **TypeScript errors** (errores de tipos)
- ✅ **Dependency issues** (problemas de dependencias)
- ✅ **Port conflicts** (conflictos de puertos)
- ✅ **Database connection** (conexión a base de datos)
- ✅ **Memory issues** (problemas de memoria)

---

## 🔍 **Diagnóstico Inicial**

### **Comandos de Diagnóstico:**
```powershell
# 1. Verificar estado de contenedores
docker-compose ps

# 2. Ver logs de todos los servicios
docker-compose logs

# 3. Ver logs de un servicio específico
docker-compose logs -f backend
docker-compose logs -f frontend

# 4. Verificar uso de recursos
docker stats

# 5. Verificar espacio en disco
docker system df
```

---

## 🚨 **Problema 1: TypeScript Build Errors**

### **Síntomas:**
```
error TS6305: Output file '/app/vite.config.d.ts' has not been built from source file '/app/vite.config.ts'
error TS2307: Cannot find module 'zod' or its corresponding type declarations
error TS2339: Property 'authorization' does not exist on type 'Headers'
```

### **Causas:**
- Configuración incorrecta de `tsconfig.json`
- Dependencias faltantes
- Conflictos de tipos entre archivos

### **Soluciones:**

#### **Solución 1: Corregir tsconfig.json del Frontend**
```powershell
# Editar frontend/tsconfig.json
# Excluir vite.config.ts del include principal
```

**Archivo corregido:**
```json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": false,
    "noUnusedParameters": false,
    "noFallthroughCasesInSwitch": true,
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"],
      "@/components/*": ["./src/components/*"],
      "@/pages/*": ["./src/pages/*"],
      "@/services/*": ["./src/services/*"],
      "@/utils/*": ["./src/utils/*"],
      "@/types/*": ["./src/types/*"],
      "@/hooks/*": ["./src/hooks/*"],
      "@/contexts/*": ["./src/contexts/*"]
    }
  },
  "include": ["src"],
  "references": [{ "path": "./tsconfig.node.json" }]
}
```

#### **Solución 2: Corregir tsconfig.json del Backend**
```powershell
# Editar backend/tsconfig.json
# Hacer configuración más permisiva
```

**Archivo corregido:**
```json
{
  "compilerOptions": {
    "target": "ES2020",
    "lib": ["ES2020"],
    "module": "commonjs",
    "moduleResolution": "node",
    "resolveJsonModule": true,
    "declaration": true,
    "declarationMap": true,
    "sourceMap": true,
    "removeComments": true,
    "noImplicitAny": false,
    "noImplicitReturns": true,
    "noImplicitThis": true,
    "noUnusedLocals": false,
    "noUnusedParameters": false,
    "exactOptionalPropertyTypes": false,
    "noImplicitOverride": false,
    "noPropertyAccessFromIndexSignature": false,
    "noUncheckedIndexedAccess": false,
    "allowUnusedLabels": false,
    "allowUnreachableCode": false,
    "experimentalDecorators": true,
    "emitDecoratorMetadata": true,
    "baseUrl": "./src",
    "paths": {
      "@/*": ["*"],
      "@/config/*": ["config/*"],
      "@/controllers/*": ["controllers/*"],
      "@/middleware/*": ["middleware/*"],
      "@/services/*": ["services/*"],
      "@/routes/*": ["routes/*"],
      "@/utils/*": ["utils/*"],
      "@/types/*": ["types/*"]
    }
  },
  "include": ["src/**/*"],
  "exclude": [
    "node_modules",
    "dist",
    "**/*.test.ts",
    "**/*.spec.ts"
  ]
}
```

#### **Solución 3: Limpiar y Reconstruir**
```powershell
# 1. Detener todos los servicios
docker-compose down

# 2. Limpiar cache de Docker
docker system prune -a

# 3. Reconstruir sin cache
docker-compose build --no-cache

# 4. Ejecutar de nuevo
docker-compose up -d
```

---

## 🚨 **Problema 2: Dependencias Faltantes**

### **Síntomas:**
```
npm error The npm ci command can only install with an existing package-lock.json
Cannot find module 'zod' or its corresponding type declarations
Module not found: Error: Can't resolve 'react-router-dom'
```

### **Causas:**
- `package-lock.json` faltante
- Dependencias no instaladas
- Versiones incompatibles

### **Soluciones:**

#### **Solución 1: Generar package-lock.json**
```powershell
# Backend
cd backend
npm install
cd ..

# Frontend
cd frontend
npm install
cd ..

# Luego ejecutar Docker
docker-compose up --build -d
```

#### **Solución 2: Modificar Dockerfiles**
```dockerfile
# En backend/Dockerfile y frontend/Dockerfile
# Cambiar de npm ci a npm install

# Antes:
RUN npm ci

# Después:
RUN npm install
```

#### **Solución 3: Verificar Dependencias**
```powershell
# Verificar dependencias instaladas
docker-compose exec backend npm list
docker-compose exec frontend npm list

# Instalar dependencias faltantes
docker-compose exec backend npm install zod
docker-compose exec frontend npm install react-router-dom
```

---

## 🚨 **Problema 3: Conflictos de Puertos**

### **Síntomas:**
```
Port 3000 is already in use
Port 3001 is already in use
Port 5432 is already in use
```

### **Causas:**
- Otros servicios usando los mismos puertos
- Contenedores anteriores no detenidos
- Aplicaciones locales corriendo

### **Soluciones:**

#### **Solución 1: Verificar Puertos en Uso**
```powershell
# Ver qué está usando los puertos
netstat -ano | findstr :3000
netstat -ano | findstr :3001
netstat -ano | findstr :5432
netstat -ano | findstr :6379

# Ver procesos específicos
tasklist /FI "PID eq 1234"
```

#### **Solución 2: Detener Servicios Conflictuosos**
```powershell
# Detener Docker Compose
docker-compose down

# Detener procesos específicos por PID
taskkill /PID 1234 /F

# Detener todos los contenedores Docker
docker stop $(docker ps -aq)
```

#### **Solución 3: Cambiar Puertos**
```yaml
# En docker-compose.yml
services:
  frontend:
    ports:
      - "3001:80"  # Cambiar de 3000 a 3001
  backend:
    ports:
      - "3002:3001"  # Cambiar de 3001 a 3002
```

---

## 🚨 **Problema 4: Base de Datos No Conecta**

### **Síntomas:**
```
Database connection failed
Error: connect ECONNREFUSED 127.0.0.1:5432
Prisma schema validation - Environment variable not found: DATABASE_URL
```

### **Causas:**
- PostgreSQL no iniciado
- Variables de entorno incorrectas
- Red Docker no configurada

### **Soluciones:**

#### **Solución 1: Verificar Variables de Entorno**
```powershell
# Crear archivo .env
copy env.example .env

# Verificar contenido
type .env

# Debe contener:
# DATABASE_URL=postgresql://postgres:password@postgres:5432/smart_city_db
# POSTGRES_USER=postgres
# POSTGRES_PASSWORD=password
# POSTGRES_DB=smart_city_db
```

#### **Solución 2: Verificar PostgreSQL**
```powershell
# Ver logs de PostgreSQL
docker-compose logs postgres

# Verificar que esté corriendo
docker-compose ps postgres

# Reiniciar PostgreSQL
docker-compose restart postgres

# Conectar manualmente
docker-compose exec postgres psql -U postgres -d smart_city_db
```

#### **Solución 3: Ejecutar Migraciones**
```powershell
# Generar cliente Prisma
docker-compose exec backend npx prisma generate

# Ejecutar migraciones
docker-compose exec backend npx prisma db push

# Poblar base de datos
docker-compose exec backend npm run db:seed
```

---

## 🚨 **Problema 5: Memoria Insuficiente**

### **Síntomas:**
```
Out of memory
Container killed due to memory limit
Docker Desktop running out of memory
```

### **Causas:**
- Docker Desktop con poca memoria asignada
- Múltiples contenedores corriendo
- Aplicaciones pesadas

### **Soluciones:**

#### **Solución 1: Aumentar Memoria de Docker**
```
1. Abrir Docker Desktop
2. Settings → Resources → Memory
3. Aumentar a 4GB o más
4. Apply & Restart
```

#### **Solución 2: Limpiar Recursos**
```powershell
# Ver uso de memoria
docker stats

# Limpiar contenedores parados
docker container prune

# Limpiar imágenes no usadas
docker image prune

# Limpiar todo el sistema
docker system prune -a
```

#### **Solución 3: Optimizar Docker Compose**
```yaml
# En docker-compose.yml, agregar límites de memoria
services:
  backend:
    deploy:
      resources:
        limits:
          memory: 512M
        reservations:
          memory: 256M
  frontend:
    deploy:
      resources:
        limits:
          memory: 256M
        reservations:
          memory: 128M
```

---

## 🚨 **Problema 6: Frontend No Carga**

### **Síntomas:**
```
This site can't be reached
ERR_CONNECTION_REFUSED
nginx: [emerg] bind() to 0.0.0.0:80 failed
```

### **Causas:**
- Nginx no configurado correctamente
- Archivos estáticos no compilados
- Puerto no expuesto

### **Soluciones:**

#### **Solución 1: Verificar Nginx**
```powershell
# Ver logs de frontend
docker-compose logs frontend

# Verificar configuración Nginx
docker-compose exec frontend cat /etc/nginx/nginx.conf

# Reiniciar frontend
docker-compose restart frontend
```

#### **Solución 2: Verificar Build del Frontend**
```powershell
# Ejecutar build manualmente
docker-compose exec frontend npm run build

# Verificar archivos generados
docker-compose exec frontend ls -la /usr/share/nginx/html
```

#### **Solución 3: Configuración Nginx**
```nginx
# Verificar nginx.conf
events {
    worker_connections 1024;
}

http {
    include /etc/nginx/mime.types;
    default_type application/octet-stream;
    
    server {
        listen 80;
        server_name localhost;
        root /usr/share/nginx/html;
        index index.html;
        
        location / {
            try_files $uri $uri/ /index.html;
        }
    }
}
```

---

## 🚨 **Problema 7: Backend No Responde**

### **Síntomas:**
```
Backend service not responding
API endpoints returning 500 errors
Cannot connect to backend from frontend
```

### **Causas:**
- Backend no iniciado correctamente
- Errores en el código
- Variables de entorno incorrectas

### **Soluciones:**

#### **Solución 1: Verificar Backend**
```powershell
# Ver logs del backend
docker-compose logs backend

# Verificar que esté corriendo
docker-compose ps backend

# Reiniciar backend
docker-compose restart backend
```

#### **Solución 2: Verificar APIs**
```powershell
# Probar endpoint de salud
curl http://localhost:3001/health

# Probar endpoint de API
curl http://localhost:3001/api/health

# Ver logs en tiempo real
docker-compose logs -f backend
```

#### **Solución 3: Debug Backend**
```powershell
# Ejecutar shell en backend
docker-compose exec backend sh

# Verificar variables de entorno
env | grep DATABASE
env | grep REDIS

# Ejecutar comando específico
npm run db:seed
```

---

## 🔧 **Comandos de Diagnóstico Avanzado**

### **Verificar Estado Completo:**
```powershell
# Estado de todos los servicios
docker-compose ps -a

# Información detallada
docker-compose config

# Verificar redes
docker network ls
docker network inspect reto-goc_default

# Verificar volúmenes
docker volume ls
docker volume inspect reto-goc_postgres_data
```

### **Logs Detallados:**
```powershell
# Logs con timestamps
docker-compose logs -t

# Logs de las últimas 100 líneas
docker-compose logs --tail=100

# Logs desde una fecha específica
docker-compose logs --since="2024-01-01T00:00:00"

# Logs de múltiples servicios
docker-compose logs -f backend frontend
```

### **Inspeccionar Contenedores:**
```powershell
# Información detallada de un contenedor
docker inspect reto-goc-backend-1

# Ver procesos dentro del contenedor
docker-compose top

# Ver uso de recursos
docker stats --no-stream
```

---

## 🚀 **Comandos de Recuperación Rápida**

### **Reset Completo:**
```powershell
# 1. Detener todo
docker-compose down -v

# 2. Limpiar sistema
docker system prune -a

# 3. Reconstruir todo
docker-compose up --build -d

# 4. Verificar estado
docker-compose ps
```

### **Reset Parcial:**
```powershell
# Solo un servicio
docker-compose up --build --force-recreate backend

# Solo base de datos
docker-compose up --build --force-recreate postgres

# Solo frontend
docker-compose up --build --force-recreate frontend
```

### **Backup y Restore:**
```powershell
# Backup de base de datos
docker-compose exec postgres pg_dump -U postgres smart_city_db > backup.sql

# Restore de base de datos
docker-compose exec -T postgres psql -U postgres smart_city_db < backup.sql

# Backup de volúmenes
docker run --rm -v reto-goc_postgres_data:/data -v $(pwd):/backup alpine tar czf /backup/postgres_backup.tar.gz -C /data .
```

---

## 📋 **Checklist de Troubleshooting**

### **Antes de Buscar Ayuda:**
- [ ] ¿Docker Desktop está corriendo?
- [ ] ¿Los puertos están disponibles?
- [ ] ¿Hay suficiente memoria disponible?
- [ ] ¿Las variables de entorno están configuradas?
- [ ] ¿Los logs muestran errores específicos?

### **Pasos de Diagnóstico:**
- [ ] `docker-compose ps` - Estado de servicios
- [ ] `docker-compose logs` - Logs de errores
- [ ] `docker stats` - Uso de recursos
- [ ] `netstat -ano | findstr :PUERTO` - Puertos en uso
- [ ] `docker system df` - Espacio en disco

### **Soluciones Comunes:**
- [ ] Limpiar cache: `docker system prune -a`
- [ ] Reconstruir: `docker-compose build --no-cache`
- [ ] Reiniciar: `docker-compose restart`
- [ ] Reset completo: `docker-compose down -v && docker-compose up --build -d`

---

## 🎯 **Prevención de Problemas**

### **Mejores Prácticas:**
1. **Siempre usar `docker-compose down`** antes de cambios
2. **Verificar logs** después de cada cambio
3. **Mantener archivos de configuración** actualizados
4. **Usar variables de entorno** para configuración
5. **Hacer backup regular** de datos importantes

### **Monitoreo Continuo:**
```powershell
# Script de monitoreo básico
while ($true) {
    docker-compose ps
    Start-Sleep 30
}
```

---

## 🎯 **Conclusión**

Esta guía cubre los problemas más comunes de Docker Compose y sus soluciones. La clave está en:

1. **Diagnosticar correctamente** el problema
2. **Aplicar la solución específica** para cada caso
3. **Verificar que la solución funcione**
4. **Documentar el problema** para futuras referencias

Con esta guía, podrás resolver la mayoría de problemas de Docker Compose de manera eficiente y mantener el proyecto Smart City funcionando correctamente.

---

**Fecha:** 2 de Octubre, 2025  
**Proyecto:** Smart City Identity Management System  
**Tecnologías:** Docker, Docker Compose, TypeScript, Node.js, React, PostgreSQL, Redis
