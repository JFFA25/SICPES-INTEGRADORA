# Config (Configuración) - API SICPES

![Python](https://img.shields.io/badge/Python-3776AB?style=for-the-badge&logo=python&logoColor=white)
![MySQL](https://img.shields.io/badge/MySQL-4479A1?style=for-the-badge&logo=mysql&logoColor=white)
![Config](https://img.shields.io/badge/Layer-Config-red?style=for-the-badge)

Esta carpeta (`/config/`) contiene la configuración central de la infraestructura de la API, principalmente la conexión a la base de datos y variables de entorno.

## Estructura del Directorio

*   **`database.py`**:
    *   Configura el `engine` de SQLAlchemy para MySQL.
    *   Define la `SessionLocal` para la gestión de sesiones de base de datos.
    *   Proporciona la función `get_db()` para inyección de dependencias en las rutas.

## Arquitectura y Seguridad

1.  **Pool de Conexiones**: Gestiona eficientemente las conexiones a MySQL para evitar sobrecargas.
2.  **Inyección de Dependencias**: La función `get_db` asegura que cada solicitud tenga su propia sesión y que esta se cierre correctamente al finalizar.
3.  **Variables de Entorno**: Centraliza la URL de conexión (se recomienda usar `.env`).

## Cómo usar la configuración

1.  Importa `get_db` en tus archivos de rutas.
2.  Úsala como una dependencia en tus endpoints: `db: Session = Depends(get_db)`.
3.  Para añadir nuevas configuraciones globales, crea archivos adicionales en esta carpeta.
