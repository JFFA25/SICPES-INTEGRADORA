# Controllers (Controladores) - Backend SICPES

![Layer Controllers](https://img.shields.io/badge/Layer-Controllers-0052cc?style=for-the-badge&logo=codeigniter&logoColor=white)
![Express](https://img.shields.io/badge/Express.js-%23404d59.svg?style=for-the-badge&logo=express&logoColor=white)![NodeJS](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![MySQL](https://img.shields.io/badge/MySQL-4479A1?style=for-the-badge&logo=mysql&logoColor=white)

Esta carpeta (`/src/controllers/`) contiene la **lógica de negocio** (Business Logic) principal del sistema administrativo SICPES (Backend de Node.js / Express). Es la capa intermediaria responsable de procesar la entrada del usuario proveniente de las rutas, interactuar con la Base de Datos y devolver una respuesta HTTP al cliente.

## Estructura del Directorio

*   **`admin.controller.js`**:
    *   Gestiona las funcionalidades exclusivas del panel de administrador.
    *   **Funciones clave**: Listar todas las reservaciones/pagos de todos los usuarios, aprobar/rechazar solicitudes, actualizar configuraciones globales de precios y correos, y cuenta con un generador de **Mock Data** (`generateMockData`) para inyección de datos de prueba aleatorios/híbridos.
*   **`auth.controller.js`**:
    *   Responsable del sistema de autenticación de usuarios y sesiones.
    *   **Funciones clave**: Registro de usuarios (`register`), inicio de sesión (`login`), cierre de sesión (`logout`) y verificación de integridad de sesión del frontend (`checkSession`).
*   **`payment.controller.js`**:
    *   Administra toda la logística financiera y de pagos de rentas.
    *   **Funciones clave**: Simulación/procesamiento de la pasarela de pagos temporal, verificación y listado del historial de pagos realizados por un usuario y control del catálogo de prorrateos/mensualidades.
*   **`reservation.controller.js`**:
    *   Contiene el ciclo interactivo de una reservación desde la perspectiva de un inquilino/estudiante.
    *   **Funciones clave**: Creación de nuevas solicitudes de alojamiento por fecha, obtención del historial individual de reservaciones de un estudiante en sesión y cancelación por parte del usuario.
*   **`room.controller.js`**:
    *   Se encarga de interactuar con la infraestructura e inventario físico (cuartos/pisos).
    *   **Funciones clave**: Envío dinámico de los pisos y listado reactivo de qué habitaciones específicas están disponibles o ocupadas en tiempo real.

## Arquitectura y Seguridad

1.  **Validación de Sesión:** Cada controlador está protegido por verificaciones de roles directas o *Middlewares*. Se valida que `req.session.user` exista. Si un controlador pertenece a un **Admin**, adicionalmente se forza que `req.session.user.rol === "admin"`.
2.  **Manejo de Errores DB:** Los bloques de ejecución asíncrona hacia la base de datos MySQL atrapan de forma segura los errores y en general devuelven estatus `500 Server Error` evitando crashear el servidor principal.
3.  **Modularidad:** Cada archivo finaliza exportando un bloque único `module.exports = { ... }` para ser empalmado eficientemente como "Callbacks" dentro de su contraparte en la carpeta `routes/`.

## 🛠 Cómo agregar un nuevo controlador

1.  Crea tu función asíncrona (con parámetros `req` y `res`).
2.  Extrae información del `req.body`, `req.params` o `req.session`.
3.  Importa el objeto `db` (conexión a la base de datos).
4.  Realiza tu consulta SQL procesando la respuesta.
5.  Asegúrate de retornar un `res.status(200).json(...)`.
6.  Añádelo al `module.exports` al final del archivo.
