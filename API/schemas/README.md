# Schemas (Esquemas) - Pydantic SICPES

![Pydantic](https://img.shields.io/badge/Pydantic-%23E32F31?style=for-the-badge&logo=pydantic&logoColor=white)
![JSON](https://img.shields.io/badge/Data-Validation-green?style=for-the-badge)
![Schemas](https://img.shields.io/badge/Layer-Schemas-lightgrey?style=for-the-badge)

Esta carpeta (`/schemas/`) contiene los modelos de Pydantic utilizados para la validación de datos, serialización y documentación automática (Swagger/OpenAPI).

## Estructura del Directorio

*   **`user_schema.py`**:
    *   Esquemas para creación, actualización y respuesta de usuarios.
*   **`reservation_schema.py`**:
    *   Define la estructura de datos requerida para solicitar o listar reservas.
*   **`room_schema.py`**:
    *   Validaciones para el inventario de habitaciones y pisos.
*   **`quota_schema.py`**:
    *   Estructura de datos para la gestión financiera y de cuotas.

## Arquitectura

1.  **Validación**: Garantizan que los datos recibidos del frontend cumplan con los formatos esperados (email válido, longitud de strings, etc.).
2.  **Serialización**: Controlan qué campos se envían de vuelta al cliente (ej: omitir el hash de la contraseña en las respuestas).
3.  **Tipado Estático**: Proporcionan autocompletado y detección de errores durante el desarrollo.

##  Cómo agregar un nuevo esquema

1.  Crea un archivo `nombre_schema.py`.
2.  Hereda de `BaseModel` de `pydantic`.
3.  Define los campos y sus tipos.
4.  Para esquemas de respuesta que leen de SQLAlchemy, añade `model_config = {"from_attributes": True}` (o `orm_mode = True` en versiones antiguas).
