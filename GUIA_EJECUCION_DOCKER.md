# 🚀 Guía de Ejecución - Smart City Identity Management System

## 📋 **Resumen**

Esta guía explica paso a paso cómo ejecutar el proyecto **Smart City Identity Management System** completo utilizando Docker y Docker Compose, incluyendo todos los servicios necesarios y troubleshooting.

---

## 🎯 **Objetivo**

Ejecutar exitosamente el proyecto completo con:
- ✅ **Backend** Node.js/Express/TypeScript (Puerto 3001)
- ✅ **Frontend** React/TypeScript con Nginx (Puerto 3000)
- ✅ **PostgreSQL** Base de datos (Puerto 5432)
- ✅ **Redis** Cache y sesiones (Puerto 6379)

---

## 🔧 **Prerrequisitos**

### **Software Requerido:**
- ✅ **Docker Desktop** (Windows/Mac) o **Docker Engine** (Linux)
- ✅ **Docker Compose** (incluido con Docker Desktop)
- ✅ **Git** (para clonar el repositorio)

### **Verificar Instalación:**
```powershell
# Verificar Docker
docker --version
# Resultado esperado: Docker version 20.x.x o superior

# Verificar Docker Compose
docker-compose --version
# Resultado esperado: Docker Compose version 2.x.x o superior
```

---

## 📁 **Estructura del Proyecto**

```
reto-goc/
├── backend/                 # Backend Node.js/Express
│   ├── Dockerfile          # Configuración Docker backend
│   ├── src/                # Código fuente TypeScript
│   ├── prisma/             # Esquemas de base de datos
│   └── package.json        # Dependencias backend
├── frontend/               # Frontend React/TypeScript
│   ├── Dockerfile          # Configuración Docker frontend
│   ├── src/                # Código fuente React
│   ├── public/             # Archivos estáticos
│   └── package.json        # Dependencias frontend
├── docker-compose.yml      # Orquestación de servicios
├── nginx.conf              # Configuración Nginx
└── .env.example            # Variables de entorno
```

---

## 🚀 **Ejecución Paso a Paso**

### **Paso 1: Preparar el Entorno**

```powershell
# 1. Navegar al directorio del proyecto
cd D:\reto_goc

# 2. Verificar que estás en el directorio correcto
dir
# Deberías ver: backend, frontend, docker-compose.yml, etc.
```

### **Paso 2: Configurar Variables de Entorno**

```powershell
# 1. Copiar archivo de ejemplo
copy env.example .env

# 2. Editar el archivo .env (opcional, tiene valores por defecto)
notepad .env
```

**Contenido del archivo .env:**
```env
# Database Configuration
DATABASE_URL="postgresql://postgres:password@localhost:5432/smart_city_db"
POSTGRES_USER=postgres
POSTGRES_PASSWORD=password
POSTGRES_DB=smart_city_db

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-here-change-in-production
JWT_EXPIRES_IN=24h
JWT_REFRESH_EXPIRES_IN=7d

# Server Configuration
PORT=3001
NODE_ENV=development
CORS_ORIGIN=http://localhost:3000

# Redis Configuration
REDIS_URL=redis://localhost:6379

# Security
BCRYPT_ROUNDS=12
RATE_LIMIT_WINDOW=15
RATE_LIMIT_MAX=100

# File Upload
MAX_FILE_SIZE=5242880
UPLOAD_PATH=./uploads
```

### **Paso 3: Ejecutar el Proyecto Completo**

```powershell
# Ejecutar todos los servicios en modo detached (segundo plano)
docker-compose up --build -d
```

**¿Qué hace este comando?**
- `--build`: Construye las imágenes Docker si no existen
- `-d`: Ejecuta en modo detached (segundo plano)
- Crea y ejecuta: PostgreSQL, Redis, Backend, Frontend

### **Paso 4: Verificar que Todo Esté Funcionando**

```powershell
# 1. Ver estado de todos los contenedores
docker-compose ps

# Resultado esperado:
# Name                    Command               State           Ports
# -------------------------------------------------------------------------------
# reto-goc-backend-1     node dist/index.js    Up      0.0.0.0:3001->3001/tcp
# reto-goc-frontend-1    nginx -g daemon off;  Up      0.0.0.0:3000->80/tcp
# reto-goc-postgres-1    docker-entrypoint.sh  Up      0.0.0.0:5432->5432/tcp
# reto-goc-redis-1       docker-entrypoint.sh  Up      0.0.0.0:6379->6379/tcp
```

### **Paso 5: Verificar en el Navegador**

1. **Abrir navegador** y ir a: http://localhost:3000
2. **Deberías ver** la aplicación React del Smart City
3. **El backend** estará disponible en: http://localhost:3001

---

## 📊 **Comandos de Monitoreo**

### **Ver Logs en Tiempo Real:**
```powershell
# Logs de todos los servicios
docker-compose logs -f

# Logs de un servicio específico
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f postgres
docker-compose logs -f redis
```

### **Ver Estado Detallado:**
```powershell
# Estado de contenedores
docker-compose ps

# Información detallada de un servicio
docker-compose ps backend
docker-compose ps frontend
```

### **Verificar Recursos:**
```powershell
# Uso de recursos del sistema
docker stats

# Información de imágenes
docker images
```

---

## 🔧 **Comandos de Desarrollo**

### **Ejecutar Solo Base de Datos:**
```powershell
# Solo PostgreSQL y Redis (para desarrollo local)
docker-compose up postgres redis -d

# Verificar que estén corriendo
docker-compose ps postgres redis
```

### **Reconstruir un Servicio Específico:**
```powershell
# Solo backend
docker-compose up --build backend

# Solo frontend
docker-compose up --build frontend

# Reconstruir sin cache
docker-compose build --no-cache backend
```

### **Ejecutar Comandos Dentro de Contenedores:**
```powershell
# Ejecutar shell en backend
docker-compose exec backend sh

# Ejecutar comando específico en backend
docker-compose exec backend npm run db:seed

# Ejecutar shell en frontend
docker-compose exec frontend sh
```

---

## 🛠️ **Troubleshooting**

### **Problema 1: Puerto en Uso**

**Error:** `Port 3000 is already in use`

**Solución:**
```powershell
# Ver qué está usando el puerto
netstat -ano | findstr :3000
netstat -ano | findstr :3001

# Detener servicios que usen el puerto
docker-compose down

# Cambiar puertos en docker-compose.yml si es necesario
```

### **Problema 2: Error de Build**

**Error:** `Build failed` o `npm install failed`

**Solución:**
```powershell
# Limpiar cache de Docker
docker system prune -a

# Reconstruir sin cache
docker-compose build --no-cache

# Ver logs detallados
docker-compose logs backend
```

### **Problema 3: Base de Datos No Conecta**

**Error:** `Database connection failed`

**Solución:**
```powershell
# Verificar que PostgreSQL esté corriendo
docker-compose logs postgres

# Reiniciar solo la base de datos
docker-compose restart postgres

# Verificar variables de entorno
docker-compose exec backend env | grep DATABASE
```

### **Problema 4: Frontend No Carga**

**Error:** `This site can't be reached`

**Solución:**
```powershell
# Verificar que frontend esté corriendo
docker-compose logs frontend

# Reiniciar frontend
docker-compose restart frontend

# Verificar configuración Nginx
docker-compose exec frontend cat /etc/nginx/nginx.conf
```

### **Problema 5: Memoria Insuficiente**

**Error:** `Out of memory` o contenedores se reinician

**Solución:**
```powershell
# Verificar uso de memoria
docker stats

# Aumentar memoria en Docker Desktop
# Settings → Resources → Memory → Aumentar a 4GB+

# Reiniciar Docker Desktop
```

---

## 🔄 **Comandos de Mantenimiento**

### **Detener Servicios:**
```powershell
# Detener todos los servicios
docker-compose down

# Detener y eliminar volúmenes (CUIDADO: borra datos)
docker-compose down -v

# Detener y eliminar imágenes
docker-compose down --rmi all
```

### **Limpiar Sistema:**
```powershell
# Limpiar contenedores parados
docker container prune

# Limpiar imágenes no usadas
docker image prune

# Limpiar todo el sistema (CUIDADO)
docker system prune -a
```

### **Backup y Restore:**
```powershell
# Backup de base de datos
docker-compose exec postgres pg_dump -U postgres smart_city_db > backup.sql

# Restore de base de datos
docker-compose exec -T postgres psql -U postgres smart_city_db < backup.sql
```

---

## 📈 **Monitoreo de Performance**

### **Métricas de Recursos:**
```powershell
# Ver uso de recursos en tiempo real
docker stats

# Ver uso de espacio en disco
docker system df

# Ver información de contenedores
docker-compose top
```

### **Logs Estructurados:**
```powershell
# Logs con timestamps
docker-compose logs -t

# Logs de las últimas 100 líneas
docker-compose logs --tail=100

# Logs desde una fecha específica
docker-compose logs --since="2024-01-01T00:00:00"
```

---

## 🎯 **Comandos de Producción**

### **Ejecutar en Modo Producción:**
```powershell
# Configurar variables de producción
set NODE_ENV=production
set DATABASE_URL=postgresql://user:pass@prod-db:5432/smart_city_db

# Ejecutar con configuración de producción
docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d
```

### **Health Checks:**
```powershell
# Verificar salud de servicios
docker-compose ps

# Verificar endpoints de salud
curl http://localhost:3001/health
curl http://localhost:3000
```

---

## 📋 **Checklist de Verificación**

### **Antes de Ejecutar:**
- [ ] Docker Desktop instalado y corriendo
- [ ] Puerto 3000 y 3001 disponibles
- [ ] Al menos 4GB de RAM disponible
- [ ] Espacio en disco suficiente (2GB+)

### **Después de Ejecutar:**
- [ ] `docker-compose ps` muestra todos los servicios como "Up"
- [ ] http://localhost:3000 carga la aplicación React
- [ ] http://localhost:3001 responde con la API
- [ ] Logs no muestran errores críticos

### **Verificación de Funcionalidad:**
- [ ] Frontend se conecta al backend
- [ ] Base de datos acepta conexiones
- [ ] Redis responde a pings
- [ ] Autenticación funciona
- [ ] APIs responden correctamente

---

## 🚀 **Comandos Rápidos de Referencia**

```powershell
# Ejecutar todo
docker-compose up --build -d

# Ver estado
docker-compose ps

# Ver logs
docker-compose logs -f

# Detener todo
docker-compose down

# Reiniciar todo
docker-compose restart

# Limpiar sistema
docker system prune -a
```

---

## 🎯 **Conclusión**

Con esta guía puedes:

- ✅ **Ejecutar el proyecto completo** en contenedores Docker
- ✅ **Monitorear el estado** de todos los servicios
- ✅ **Solucionar problemas** comunes de manera eficiente
- ✅ **Desarrollar localmente** con base de datos en contenedores
- ✅ **Mantener el sistema** limpio y optimizado

El proyecto Smart City Identity Management System está diseñado para ejecutarse de manera eficiente en contenedores Docker, proporcionando un entorno de desarrollo y producción consistente y confiable.

---

**Fecha:** 2 de Octubre, 2025  
**Proyecto:** Smart City Identity Management System  
**Tecnologías:** Docker, Docker Compose, Node.js, React, PostgreSQL, Redis, Nginx
