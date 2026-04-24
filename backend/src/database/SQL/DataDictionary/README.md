# Data Dictionary - SICPES

![MySQL](https://img.shields.io/badge/MySQL-4479A1?style=for-the-badge&logo=mysql&logoColor=white)
![Documentation](https://img.shields.io/badge/Documentation-Reference-blue?style=for-the-badge&logo=bookstack&logoColor=white)

Esta carpeta centraliza la documentación técnica de la estructura de datos del sistema SICPES.

## Archivo Principal

*   **[DataDictionary_SICPES.pdf](./DataDictionary_SICPES.pdf)**: Documento técnico exhaustivo que detalla cada tabla, campo, restricción y relación del sistema.

## Convenciones de Nombrado

Para mantener la consistencia en el desarrollo, se aplican las siguientes reglas:
*   **Tablas**: Plural en minúsculas (ej: `usuarios`, `pagos`).
*   **Campos**: Formato `snake_case` (ej: `fecha_registro`).
*   **PKs**: Siempre nombradas como `id` (Auto-increment).
*   **FKs**: Formato `tabla_id` (ej: `usuario_id`).

## Entidades Documentadas

El diccionario cubre las siguientes tablas principales:
*   `usuarios`, `reservaciones`, `pagos`, `habitaciones`, `pisos`, `quotas` y `configuraciones`.

## Tipos de Datos Estándar

| Tipo | Uso |
|------|-----|
| `INT` | Identificadores y contadores |
| `VARCHAR` | Cadenas de texto y hashes |
| `DECIMAL(10,2)` | Valores monetarios precisos |
| `ENUM` | Estados predefinidos (activo, pendiente, etc.) |
| `DATETIME` | Marcas de tiempo automáticas |

> **Nota**: Ante cualquier duda sobre la lógica de una columna o sus restricciones, consulte siempre el archivo PDF adjunto.