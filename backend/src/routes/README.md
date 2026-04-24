# Routes (Rutas) - Backend SICPES

![Express](https://img.shields.io/badge/Express.js-%23404d59.svg?style=for-the-badge&logo=express&logoColor=white)
![API](https://img.shields.io/badge/API-Endpoints-orange?style=for-the-badge)

Esta carpeta define los puntos de entrada (endpoints) de la API y los conecta con sus respectivos controladores.

## Archivos

- `auth.routes.js` → Endpoints de registro, login y sesiones.
- `reservation.routes.js` → Gestión de solicitudes de alojamiento.
- `payment.routes.js` → Procesamiento de pagos y consulta de cuotas.
- `room.routes.js` → Consulta de disponibilidad de habitaciones y pisos.
- `admin.routes.js` → Panel de control exclusivo para administradores.

## Estructura de Endpoint

Cada ruta sigue el patrón:
`MÉTODO /api/recurso` -> `Middleware (opcional)` -> `Controlador`

Ejemplo:
```javascript
router.post('/login', authController.login);
```

## Cómo agregar una nueva ruta

1. Crea o edita un archivo de rutas.
2. Importa el controlador correspondiente.
3. Define el endpoint usando el método de Express (`router.get`, `router.post`, etc.).
4. Exporta el router y regístralo en el archivo principal `app.js`.
