# Models (Modelos) - SQLAlchemy SICPES

![SQLAlchemy](https://img.shields.io/badge/SQLAlchemy-D71F00?style=for-the-badge&logo=sqlalchemy&logoColor=white)
![MySQL](https://img.shields.io/badge/MySQL-4479A1?style=for-the-badge&logo=mysql&logoColor=white)
![Models](https://img.shields.io/badge/Layer-Models-blue?style=for-the-badge)

Esta carpeta (`/models/`) contiene las definiciones de las tablas de la base de datos utilizando el ORM SQLAlchemy. Estos archivos representan la estructura de datos pura y sus relaciones.

## Estructura del Directorio

*   **`user_model.py`**:
    *   Define la tabla `usuarios`.
    *   Campos: ID, nombre, email, password (hash), rol y timestamps.
*   **`reservation_model.py`**:
    *   Define la tabla `reservaciones`.
    *   Relaciona usuarios con habitaciones y maneja los estados de la solicitud.
*   **`room_model.py`**:
    *   Define las tablas `habitaciones` y `pisos`.
    *   Mapea la infraestructura física del inmueble.
*   **`quota_model.py`**:
    *   Define la tabla `quotas`.
    *   Almacena información sobre mensualidades y montos financieros.

## Arquitectura

1.  **Base Declarativa**: Todos los modelos heredan de la `Base` configurada en `config/database.py`.
2.  **Relaciones**: Se utilizan `relationship` y `ForeignKey` para mantener la integridad referencial definida en el diagrama EER.
3.  **Tipado**: Cada columna está estrictamente tipada (Integer, String, DateTime, etc.) para coincidir con la base de datos MySQL.

## Cómo agregar un nuevo modelo

1.  Crea un archivo `nombre_model.py`.
2.  Importa `Base` de `config.database`.
3.  Define la clase heredando de `Base` y especifica `__tablename__`.
4.  Define las columnas usando `Column`.
5.  Importa el modelo en `main.py` o en el archivo de inicialización de DB para que SQLAlchemy lo reconozca.
