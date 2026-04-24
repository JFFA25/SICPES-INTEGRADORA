# Pages (Páginas) - Frontend SICPES
 
<img src="https://img.shields.io/badge/React-19.2.4-61DAFB?style=for-the-badge&logo=react&logoColor=black" alt="React"/>
<img src="https://img.shields.io/badge/TypeScript-5.9.3-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript"/>
<img src="https://img.shields.io/badge/React_Router-7.14.0-CA4245?style=for-the-badge&logo=reactrouter&logoColor=white" alt="React Router"/>
<img src="https://img.shields.io/badge/TailwindCSS-3.4.4-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white" alt="TailwindCSS"/>
 
 
Esta carpeta (`/src/pages/`) contiene todas las **vistas/páginas** de la aplicación SICPES. Cada archivo representa una ruta específica del sistema y encapsula la lógica y presentación de esa sección. Son los componentes de nivel superior que `react-router-dom` renderiza según la URL activa.
 
## Estructura del Directorio
 
*   **`Home.tsx`**:
    *   Landing page principal y punto de entrada público del sistema.
    *   **Funciones clave**: Renderiza los componentes globales `Navbar`, `Hero` y `Footer`. Establece el título del documento como "SICPES". Es la primera vista que ve cualquier visitante antes de autenticarse.
*   **`Login.tsx`**:
    *   Pantalla de autenticación de usuarios registrados en el sistema.
    *   **Funciones clave**: Formulario con campos de correo y contraseña con validación en tiempo real, toggle para mostrar/ocultar contraseña, consumo del endpoint `/api/login` con cookies de sesión (`credentials: include`), verificación del rol del usuario vía `/api/session` y redirección automática: `admin` → `/admin/reservations`, `usuario` → `/dashboard`.
*   **`Dashboard.tsx`**:
    *   Panel principal del estudiante autenticado con resumen completo de su cuenta.
    *   **Funciones clave**: Visualización del estado de reservación activa (pendiente/aceptada/rechazada/finalizada), cálculo dinámico del próximo pago con lógica de **prorrateo** por semana de ingreso, panel de avisos contextual según el estado de la reservación y navegación rápida a Peticiones y Pagos.
*   **`Register.tsx`**:
    *   Formulario de registro para nuevos estudiantes del sistema.
    *   **Funciones clave**: Captura de datos personales del estudiante y creación de cuenta con asignación de rol `usuario` por defecto.
*   **`Reservation.tsx`**:
    *   Vista para la gestión de solicitudes de reservación de habitaciones.
    *   **Funciones clave**: Selección de fechas con `react-datepicker`, elección de tipo de habitación (individual/compartida) y envío de solicitud al administrador para su aprobación o rechazo.
*   **`Payments.tsx`**:
    *   Historial completo de pagos del estudiante autenticado.
    *   **Funciones clave**: Listado de pagos realizados con estado (pagado/pendiente), procesamiento de nuevos pagos de mensualidades y visualización de prorrateos aplicados.
*   **`Confirm.tsx`**:
    *   Pantalla de confirmación tras realizar una acción importante en el sistema.
    *   **Funciones clave**: Muestra retroalimentación visual al usuario después de operaciones como reservar, pagar o cancelar una solicitud.
*   **`ForgotPassword.tsx`**:
    *   Vista para solicitar la recuperación de contraseña olvidada.
    *   **Funciones clave**: Captura el correo electrónico del usuario y dispara el envío de un enlace de recuperación al correo registrado.
*   **`ResetPassword.tsx`**:
    *   Formulario para establecer una nueva contraseña usando el token recibido por correo.
    *   **Funciones clave**: Valida el token de recuperación y permite al usuario establecer y confirmar su nueva contraseña de forma segura.
*   **`Contact.tsx`**:
    *   Página de información de contacto institucional de SICPES.
    *   **Funciones clave**: Muestra datos de contacto, ubicación y formulario de contacto directo con el equipo administrativo.
*   **`Error.tsx`**:
    *   Página de error 404 para rutas no encontradas.
    *   **Funciones clave**: Renderiza un mensaje de error amigable y redirige al usuario de vuelta al inicio cuando accede a una ruta inexistente.
*   **`AdminReservation.tsx`**:
    *   Panel exclusivo del administrador para gestión global de reservaciones.
    *   **Funciones clave**: Listado de todas las reservaciones del sistema, aprobación o rechazo de solicitudes con motivo y control del ciclo de vida completo de cada reservación.
*   **`AdminPayments.tsx`**:
    *   Panel exclusivo del administrador para revisión y gestión de pagos.
    *   **Funciones clave**: Visualización de todos los pagos registrados en el sistema, verificación de comprobantes y actualización de estados de pago.
*   **`AdminSettings.tsx`**:
    *   Panel de configuración global del sistema exclusivo para administradores.
    *   **Funciones clave**: Configuración de precios de mensualidades, gestión de prorrateos, actualización de datos de correo institucional y ajustes generales del sistema.
## Flujo de Navegación
 
```
Home (/)
├── Login (/login)              → Dashboard (/dashboard)
│                                     ├── Reservation (/reservation)
│                                     │     └── Confirm (/confirm)
│                                     └── Payments (/payments)
├── Register (/register)        → Login
├── ForgotPassword (/forgot-password) → ResetPassword (/reset-password)
└── Contact (/contact)
 
Admin (solo rol admin)
├── AdminReservation (/admin/reservations)
├── AdminPayments (/admin/payments)
└── AdminSettings (/admin/settings)
 
* (/*)  → Error (404)
```
 
## Protección de Rutas
 
1. **Rutas privadas de usuario**: Verifican `req.session.user` vía `/api/session`. Si no hay sesión activa redirigen automáticamente a `/login`.
2. **Rutas de administrador**: Verifican adicionalmente que `rol === "admin"`. Un usuario sin ese rol no puede acceder a los paneles `/admin/*`.
3. **Redirección por rol**: Al hacer login, el sistema detecta el rol y redirige al destino correcto automáticamente.

### Integrantes

1. **Jose Francisco Flores Amador** /[@JFFA25](https://github.com/JFFA25)
2. **Edgar Cabrera Velázquez** /[@Edgar-Cbr](https://github.com/Edgar-Cbr)
3. **Edwin Hernández Campos** /[@Edwinhdzcm](https://github.com/Edwinhdzcm)
4. **Giovany Raul Pazos Cruz** /[@giova0412](https://github.com/giova0412)
5. **Uriel Maldonado Bernabe** /[@Urii7895](https://github.com/Urii7895)
