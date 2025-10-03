# 🏙️ Smart City Identity Management System

Sistema completo de gestión de identidad digital para Smart Cities desarrollado con Node.js, React, PostgreSQL y Docker.

## 🚀 Características Principales

- **🔐 Autenticación Segura**: Sistema JWT con roles (Ciudadano, Operador, Administrador)
- **🗺️ Mapas Interactivos**: Visualización en tiempo real de accidentes, ciclovías y tráfico
- **📊 Dashboard Inteligente**: Estadísticas y análisis de datos urbanos
- **📱 Responsive Design**: Interfaz moderna y accesible en todos los dispositivos
- **🐳 Contenedorizado**: Deployment completo con Docker y Docker Compose
- **🔒 Seguridad Avanzada**: Rate limiting, validaciones, y mejores prácticas

## 🛠️ Stack Tecnológico

### Backend
- **Node.js** + **Express** + **TypeScript**
- **PostgreSQL** + **Prisma ORM**
- **Redis** para cache
- **JWT** para autenticación
- **Joi** para validaciones

### Frontend
- **React** + **TypeScript** + **Vite**
- **Tailwind CSS** para estilos
- **React Leaflet** para mapas
- **Chart.js** para gráficos
- **React Hook Form** + **Zod** para formularios

### DevOps
- **Docker** + **Docker Compose**
- **Nginx** como reverse proxy
- **PostgreSQL** + **Redis** en contenedores

## 📋 Requisitos Previos

- Node.js 18+
- Docker y Docker Compose
- Git

## 🚀 Instalación y Configuración

### 1. Clonar el Repositorio

```bash
git clone <repository-url>
cd smart-city-identity
```

### 2. Configurar Variables de Entorno

```bash
# Copiar archivo de ejemplo
cp env.example .env

# Editar variables de entorno
nano .env
```

### 3. Desarrollo Local

```bash
# Instalar dependencias
npm install

# Iniciar base de datos
docker-compose up postgres redis -d

# Configurar base de datos
cd backend
npm run db:push
npm run db:seed

# Iniciar desarrollo
npm run dev
```

### 4. Producción con Docker

```bash
# Construir y ejecutar todos los servicios
docker-compose up --build -d

# Ver logs
docker-compose logs -f

# Detener servicios
docker-compose down
```

## 🌐 Acceso a la Aplicación

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:3001
- **Base de Datos**: localhost:5432
- **Redis**: localhost:6379

## 👥 Credenciales de Demo

### Administrador
- **Email**: admin@smartcity.com
- **Contraseña**: Admin123!

### Operador
- **Email**: operator@smartcity.com
- **Contraseña**: Operator123!

### Ciudadano
- **Email**: citizen1@smartcity.com
- **Contraseña**: Citizen123!

## 📁 Estructura del Proyecto

```
smart-city-identity/
├── backend/                 # API Backend
│   ├── src/
│   │   ├── controllers/     # Controladores de rutas
│   │   ├── services/        # Lógica de negocio
│   │   ├── middleware/      # Middlewares de seguridad
│   │   ├── routes/          # Definición de rutas
│   │   ├── types/           # Tipos TypeScript
│   │   └── config/          # Configuración
│   ├── prisma/              # Esquema de base de datos
│   └── Dockerfile
├── frontend/                # Aplicación React
│   ├── src/
│   │   ├── components/      # Componentes reutilizables
│   │   ├── pages/           # Páginas de la aplicación
│   │   ├── contexts/        # Contextos de React
│   │   ├── services/        # Servicios de API
│   │   └── types/           # Tipos TypeScript
│   └── Dockerfile
├── docker-compose.yml       # Orquestación de contenedores
└── README.md
```

## 🔧 Scripts Disponibles

### Backend
```bash
npm run dev          # Desarrollo con hot-reload
npm run build        # Construir para producción
npm run start        # Iniciar en producción
npm run test         # Ejecutar tests
npm run db:push      # Sincronizar esquema de BD
npm run db:seed      # Poblar BD con datos de prueba
```

### Frontend
```bash
npm run dev          # Desarrollo con Vite
npm run build        # Construir para producción
npm run preview      # Preview de producción
npm run test         # Ejecutar tests
npm run lint         # Linter
```

### Docker
```bash
docker-compose up -d          # Iniciar servicios
docker-compose down           # Detener servicios
docker-compose logs -f        # Ver logs
docker-compose build          # Reconstruir imágenes
```

## 🗺️ Funcionalidades del Mapa

- **Marcadores de Accidentes**: Visualización por tipo y severidad
- **Ciclovías**: Estado y condiciones de las vías ciclistas
- **Filtros Interactivos**: Por fecha, tipo, severidad
- **Popups Informativos**: Detalles al hacer clic en marcadores
- **Leyenda Dinámica**: Colores y símbolos explicativos

## 📊 Dashboard y Analytics

- **Métricas en Tiempo Real**: Usuarios, accidentes, respuesta
- **Gráficos Interactivos**: Tipos y severidad de accidentes
- **Tendencias**: Comparación mes actual vs anterior
- **Acciones Rápidas**: Navegación a funciones principales

## 🔒 Seguridad

- **Autenticación JWT**: Tokens seguros con refresh
- **Rate Limiting**: Protección contra ataques de fuerza bruta
- **Validación de Datos**: Esquemas de validación estrictos
- **CORS Configurado**: Orígenes permitidos específicos
- **Headers de Seguridad**: Helmet.js para protección adicional

## 🧪 Testing

```bash
# Backend tests
cd backend
npm test

# Frontend tests
cd frontend
npm test

# Tests con cobertura
npm run test:coverage
```

## 📈 Monitoreo y Logs

- **Health Checks**: Endpoints de salud para todos los servicios
- **Logs Estructurados**: Formato JSON para fácil parsing
- **Métricas de Performance**: Tiempo de respuesta y uso de recursos
- **Error Tracking**: Captura y logging de errores

## 🚀 Deployment

### Variables de Entorno de Producción

```env
NODE_ENV=production
DATABASE_URL=postgresql://user:pass@host:5432/db
REDIS_URL=redis://host:6379
JWT_SECRET=your-super-secret-key
CORS_ORIGIN=https://yourdomain.com
```

### Comandos de Deployment

```bash
# Construir para producción
docker-compose -f docker-compose.prod.yml up --build -d

# Backup de base de datos
docker-compose exec postgres pg_dump -U postgres smart_city_db > backup.sql

# Restaurar base de datos
docker-compose exec -T postgres psql -U postgres smart_city_db < backup.sql
```

## 🤝 Contribución

1. Fork el proyecto
2. Crear una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abrir un Pull Request

## 📝 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

## 👨‍💻 Autor

**Raul Alvarez Huerta**
- Proyecto desarrollado como parte del Certificado en Desarrollo de Software Asistido por IA
- M2. Generación y Optimización de Código

## 🙏 Agradecimientos

- OpenStreetMap por los datos de mapas
- Leaflet por la librería de mapas
- Prisma por el ORM
- Tailwind CSS por el framework de estilos
- React y Vite por el ecosistema frontend

---

**¡Gracias por usar Smart City Identity Management System!** 🏙️✨
