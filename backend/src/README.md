# Código Fuente (src/) - Backend SICPES

![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)![Express](https://img.shields.io/badge/Express.js-%23404d59.svg?style=for-the-badge&logo=express&logoColor=white)
![MySQL](https://img.shields.io/badge/MySQL-4479A1?style=for-the-badge&logo=mysql&logoColor=white)

Esta carpeta contiene el núcleo del servidor de SICPES, organizado bajo una arquitectura modular y escalable.

## Estructura de Directorios

| Carpeta | Función | Documentación |
|---------|---------|---------------|
| `controllers/` | Lógica de negocio y respuestas HTTP | [README](./controllers/README.md) |
| `routes/` | Definición de endpoints API | [README](./routes/README.md) |
| `models/` | Consultas SQL y acceso a datos | [README](./models/README.md) |
| `middlewares/` | Seguridad y control de acceso | [README](./middlewares/README.md) |
| `database/` | Conexión y scripts de base de datos | [README](./database/SQL/README.md) |
| `utils/` | Herramientas auxiliares (Mailer) | [README](./utils/README.md) |

## Flujo de Trabajo

1.  **Ruta**: El cliente hace una petición a un endpoint definido en `routes/`.
2.  **Middleware**: Se valida la sesión y roles en `middlewares/`.
3.  **Controlador**: Se procesa la lógica en `controllers/`.
4.  **Modelo**: Se interactúa con MySQL mediante los `models/`.
5.  **Respuesta**: El controlador devuelve un JSON al cliente.

## Cómo agregar funcionalidades

Para mantener la consistencia, cada capa tiene su propia guía de extensión. Consulte los archivos **README** dentro de cada subcarpeta para ver instrucciones específicas de implementación.
