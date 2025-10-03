# 🚀 GitHub Actions - Smart City System

## 📋 **Workflows Disponibles**

### 1. 🐳 **Docker Compose CI/CD** (`docker-compose.yml`)

**Trigger:** Push a `master`/`main` o Pull Request

**Funciones:**
- ✅ Construye y ejecuta todos los servicios
- ✅ Ejecuta health checks de todos los servicios
- ✅ Prueba endpoints de la API
- ✅ Ejecuta migraciones de base de datos
- ✅ Pobla la base de datos con datos de prueba
- ✅ Limpia recursos después de las pruebas

**Duración:** ~5-10 minutos

### 2. 🚀 **Deploy a Producción** (`deploy.yml`)

**Trigger:** Push a `master` o ejecución manual

**Funciones:**
- ✅ Construye imágenes de producción
- ✅ Despliega en entorno de producción
- ✅ Ejecuta health checks de producción
- ✅ Configura variables de entorno de producción

**Duración:** ~10-15 minutos

## 🔧 **Configuración Requerida**

### **Variables de Entorno (Secrets)**

Para el workflow de deploy, necesitas configurar estos secrets en GitHub:

1. Ve a **Settings** → **Secrets and variables** → **Actions**
2. Agrega los siguientes secrets:

```bash
# Base de datos
DB_PASSWORD=tu_password_seguro
DB_HOST=tu_host_de_bd

# Redis
REDIS_HOST=tu_host_de_redis

# JWT
JWT_SECRET=tu_jwt_secret_muy_seguro

# URLs
FRONTEND_URL=https://tu-dominio.com
API_URL=https://api.tu-dominio.com
```

### **Variables de Entorno (Environment Variables)**

También puedes configurar variables de entorno:

```bash
NODE_ENV=production
PORT=3001
```

## 🎯 **Cómo Usar**

### **Ejecutar Tests Automáticamente:**
1. Haz push a la rama `master` o `main`
2. Los tests se ejecutan automáticamente
3. Revisa los resultados en la pestaña **Actions**

### **Ejecutar Deploy:**
1. Haz push a la rama `master`
2. O ve a **Actions** → **Deploy Smart City System** → **Run workflow**

### **Ejecutar Manualmente:**
1. Ve a la pestaña **Actions**
2. Selecciona el workflow que quieres ejecutar
3. Click en **Run workflow**

## 📊 **Monitoreo**

### **Logs en Tiempo Real:**
- Ve a **Actions** → Selecciona el workflow
- Click en el job que está ejecutándose
- Ve los logs en tiempo real

### **Health Checks:**
- **PostgreSQL**: Verifica conexión a la base de datos
- **Redis**: Verifica conexión al cache
- **Backend API**: Verifica endpoint `/api/health`
- **Frontend**: Verifica que el frontend responda
- **Nginx**: Verifica proxy reverso

## 🚨 **Troubleshooting**

### **Si fallan los tests:**
1. Revisa los logs en **Actions**
2. Verifica que todos los servicios estén funcionando
3. Revisa la configuración de variables de entorno

### **Si falla el deploy:**
1. Verifica que los secrets estén configurados
2. Revisa la conectividad con los servicios externos
3. Verifica que los puertos estén disponibles

## 🎉 **Beneficios**

- ✅ **CI/CD Automático**: Tests y deploy automáticos
- ✅ **Calidad**: Verifica que todo funcione antes del deploy
- ✅ **Consistencia**: Mismo proceso en todos los entornos
- ✅ **Monitoreo**: Logs y health checks automáticos
- ✅ **Rollback**: Fácil reversión si algo falla

---

**Fecha:** 3 de Octubre, 2025  
**Proyecto:** Smart City Identity Management System  
**Tecnologías:** GitHub Actions, Docker, Docker Compose, Node.js, React, PostgreSQL, Redis
