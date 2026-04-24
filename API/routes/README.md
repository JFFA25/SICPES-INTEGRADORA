# Routes (Rutas) - FastAPI SICPES

![FastAPI](https://img.shields.io/badge/FastAPI-005571?style=for-the-badge&logo=fastapi&logoColor=white)
![Python](https://img.shields.io/badge/Python-3776AB?style=for-the-badge&logo=python&logoColor=white)
![Routes](https://img.shields.io/badge/Layer-Routes-orange?style=for-the-badge)

Esta carpeta (`/routes/`) contiene la definición de los endpoints de la API administrativa. Utiliza `APIRouter` de FastAPI para modularizar las rutas y conectarlas con la lógica de negocio en la capa CRUD.

## Estructura del Directorio

*   **`auth_routes.py`**:
    *   Gestiona el acceso y seguridad.
    *   **Endpoints**: Login y obtención de tokens JWT.
*   **`user_routes.py`**:
    *   Administración de usuarios del sistema.
    *   **Endpoints**: CRUD de usuarios, asignación de roles y perfiles.
*   **`reservation_routes.py`**:
    *   Control del ciclo de vida de las reservaciones.
    *   **Endpoints**: Creación, cancelación y listado de solicitudes de alojamiento.
*   **`room_routes.py`**:
    *   Gestión del inventario de habitaciones.
    *   **Endpoints**: Consulta de disponibilidad por piso y habitación.
*   **`quota_routes.py`**:
    *   Administración financiera.
    *   **Endpoints**: Gestión de cuotas, mensualidades y estados de pago.
*   **`seed_routes.py`**:
    *   Utilidad para desarrollo.
    *   **Endpoints**: Inyección de datos de prueba (Mock Data) para poblar la base de datos.

## Arquitectura y Seguridad

1.  **Protección de Rutas**: Los endpoints sensibles utilizan `HTTPBearer` para validar el token JWT antes de procesar la solicitud.
2.  **Validación**: Cada ruta utiliza esquemas de Pydantic (`schemas/`) para validar los datos de entrada y salida.
3.  **Inyección de Dependencias**: Se utiliza la sesión de base de datos inyectada desde `config/database.py`.

## Cómo agregar una nueva ruta

1.  Crea un nuevo archivo o añade a uno existente un objeto `APIRouter`.
2.  Define el decorador del método HTTP (`@router.post`, `@router.get`, etc.).
3.  Asocia un esquema de Pydantic para el `response_model`.
4.  Llama a la función correspondiente en la capa `crud/`.
5.  Registra el router en `main.py` usando `app.include_router()`.
