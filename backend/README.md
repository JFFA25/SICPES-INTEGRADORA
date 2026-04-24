# Backend SICPES - Sistema de Control de Pensiones Estudiantiles

![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![Express](https://img.shields.io/badge/Express.js-%23404d59.svg?style=for-the-badge&logo=express&logoColor=white)
![MySQL](https://img.shields.io/badge/MySQL-4479A1?style=for-the-badge&logo=mysql&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)

Backend del sistema SICPES (Sistema de Control de Pensiones Estudiantiles), desarrollado con Node.js y Express. Maneja la gestión de reservaciones, pagos, autenticación de usuarios y administración de habitaciones para el sistema de pensiones estudiantiles.

## Requisitos Previos

- Node.js (v18+ recomendado)
- MySQL (v8.0+)
- npm o yarn

## Instalación

```bash
cd backend
npm install
```

## Configuración

1. Copia el archivo `.env.example` a `.env`:
```bash
cp .env.example .env
```

2. Configura las variables de entorno en `.env`:
```env
PORT=3000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=tu_password
DB_NAME=sicpes
SESSION_SECRET=tu_secreto
```

3. Ejecuta los scripts SQL en `src/database/SQL/` para crear la estructura de la base de datos.

## Estructura del Proyecto

```
backend/
├── src/
│   ├── controllers/    # Lógica de negocio
│   ├── routes/         # Definición de rutas API
│   ├── models/         # Modelos de datos
│   ├── middlewares/    # Middlewares Express
│   ├── database/       # Conexión a BD y scripts SQL
│   └── utils/          # Utilidades (mailer, etc.)
├── app.js              # Punto de entrada
└── package.json        # Dependencias
```

## Scripts Disponibles

| Script | Descripción |
|--------|-------------|
| `npm run dev` | Inicia el servidor en modo desarrollo con nodemon |

## API Endpoints

### Autenticación
- `POST /api/auth/register` - Registro de usuarios
- `POST /api/auth/login` - Inicio de sesión
- `POST /api/auth/logout` - Cierre de sesión
- `GET /api/auth/checkSession` - Verificar sesión activa

### Reservaciones
- `POST /api/reservations` - Crear reservación
- `GET /api/reservations` - Obtener reservaciones del usuario
- `DELETE /api/reservations/:id` - Cancelar reservación

### Pagos
- `POST /api/payment/process` - Procesar pago
- `GET /api/payment/history` - Historial de pagos
- `GET /api/payment/quotas` - Listar prorrateos

### Habitaciones
- `GET /api/rooms/floors` - Listar pisos
- `GET /api/rooms/available` - Habitaciones disponibles

### Administración
- `GET /api/admin/reservations` - Todas las reservaciones
- `PUT /api/admin/reservations/:id/status` - Actualizar estado
- `GET /api/admin/settings` - Obtener configuración
- `PUT /api/admin/settings` - Actualizar configuración

## Tecnologías Utilizadas

- **Express.js** - Framework web
- **MySQL2** - Driver MySQL
- **Express-session** - Gestión de sesiones
- **Bcrypt** - Encriptación de contraseñas
- **Nodemailer** - Envío de correos
- **CORS** - Configuración de CORS

## Licencia

ISC