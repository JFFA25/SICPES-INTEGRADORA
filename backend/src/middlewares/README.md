# Middlewares - Backend SICPES

![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)![Express](https://img.shields.io/badge/Express.js-%23404d59.svg?style=for-the-badge&logo=express&logoColor=white)

Esta carpeta contiene las funciones intermedias del servidor encargadas de la validación de seguridad y control de acceso.

## Archivos

- `auth.middleware.js` → Validación de sesiones de usuario y control de roles (Admin/Usuario).

## Funciones Clave

*   **`requireAuth`**: Verifica que el usuario tenga una sesión activa antes de permitir el acceso a rutas protegidas.
*   **`requireAdmin`**: Restringe el acceso exclusivamente a usuarios con privilegios de administrador.

## Uso

Los middlewares se inyectan en las rutas de la siguiente manera:
```javascript
router.get('/admin-only', requireAuth, requireAdmin, controller.function);
```
