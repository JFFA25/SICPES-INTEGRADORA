# Código Fuente (src/)

Esta carpeta contiene todo el código fuente del backend de SICPES.

## Estructura de Directorios

```
src/
├── controllers/    # Lógica de negocio - Manejan las solicitudes HTTP
├── routes/         # Definición de endpoints y mapeo a controladores
├── models/         # Modelos de datos y consultas SQL
├── middlewares/    # Funciones intermedias (autenticación, validación)
├── database/       # Conexión a MySQL y scripts SQL
└── utils/          # Utilidades auxiliares (envío de correos)
```

## Capas de la Arquitectura

| Carpeta | Función |
|---------|---------|
| `controllers/` | Procesan la lógica de negocio y responden al cliente |
| `routes/` | Definen las rutas URL y conectan con los controladores |
| `models/` | Interactúan con la base de datos |
| `middlewares/` | Validaciones previas a los controladores |
| `database/` | Configuración de conexión y scripts SQL |
| `utils/` | Funciones helper (email, helpers varios) |

## Subcarpetas Detalladas

### `routes/` - Rutas API
Archivos que definen los endpoints del servidor y los mapean a los controladores correspondientes.

| Archivo | Descripción |
|---------|-------------|
| `auth.routes.js` | Rutas de autenticación (login, register, logout) |
| `reservation.routes.js` | Rutas para gestión de reservaciones |
| `payment.routes.js` | Rutas para procesamiento de pagos |
| `room.routes.js` | Rutas para consulta de habitaciones y pisos |
| `admin.routes.js` | Rutas del panel de administración |

### `models/` - Modelos de Datos
Consultas SQL y funciones de acceso a la base de datos.

- `user.model.js` - Operaciones de usuarios
- `reservation.model.js` - Operaciones de reservaciones
- `payment.model.js` - Operaciones de pagos
- `quota.model.js` - Gestión de prorrateos/mensualidades

### `middlewares/` - Middlewares
Funciones intermedias que se ejecutan antes de los controladores.

- `auth.middleware.js` - Validación de sesión y roles de usuario

### `database/` - Base de Datos
- `db.js` - Conexión a MySQL mediante mysql2
- `SQL/` - Scripts, estructura, backups y diccionario de datos

### `utils/` - Utilidades
- `mailer.js` - Configuración de Nodemailer para envío de correos

### `controllers/` - Controladores
Lógica de negocio del sistema. Cada archivo maneja un dominio específico.

- `admin.controller.js` - Funciones del panel de administrador
- `auth.controller.js` - Autenticación y sesiones de usuarios
- `payment.controller.js` - Procesamiento de pagos
- `reservation.controller.js` - Gestión de reservaciones
- `room.controller.js` - Inventario de habitaciones

> **Nota**: Para documentación detallada de cada controlador, consulta [`controllers/README.md`](./controllers/README.md)

## Endpoints API Principales

### Autenticación
- `POST /api/auth/register` - Registro de nuevo usuario
- `POST /api/auth/login` - Inicio de sesión
- `POST /api/auth/logout` - Cierre de sesión
- `GET /api/auth/checkSession` - Verificar sesión activa

### Reservaciones
- `GET /api/reservations` - Listar reservaciones del usuario
- `POST /api/reservations` - Crear nueva reservación
- `DELETE /api/reservations/:id` - Cancelar reservación

### Pagos
- `POST /api/payment/process` - Procesar pago
- `GET /api/payment/history` - Historial de pagos
- `GET /api/payment/quotas` - Listar mensualidades

### Habitaciones
- `GET /api/rooms/floors` - Listar todos los pisos
- `GET /api/rooms/available` - Listar habitaciones disponibles

### Administración
- `GET /api/admin/reservations` - Todas las reservaciones
- `PUT /api/admin/reservations/:id/status` - Actualizar estado
- `GET /api/admin/users` - Listar usuarios
- `GET /api/admin/stats` - Estadísticas del sistema
- `GET /api/admin/settings` - Configuraciones globales
- `PUT /api/admin/settings` - Actualizar configuraciones

## Middlewares

### `auth.middleware.js`
Protege las rutas verificando la sesión del usuario.

```javascript
// Verifica que exista sesión
const requireAuth = (req, res, next) => {
  if (!req.session.user) {
    return res.status(401).json({ error: 'No autorizado' });
  }
  next();
};

// Verifica que sea administrador
const requireAdmin = (req, res, next) => {
  if (!req.session.user || req.session.user.rol !== 'admin') {
    return res.status(403).json({ error: 'Acceso denegado' });
  }
  next();
};
```

## Conexión a Base de Datos

La conexión se encuentra en `database/db.js` y utiliza el patrón singleton:

```javascript
const mysql = require('mysql2/promise');
const pool = mysql.createPool({...});
module.exports = pool;
```

## Configuración de Sesión

Express-session está configurado en `app.js` con opciones de seguridad básicas.

## Flujo de una Solicitud

```
Cliente → Routes → Middlewares → Controllers → Models → Base de Datos
                ↑                                              ↓
                └──────────── Respuesta JSON ←─────────────────┘
```