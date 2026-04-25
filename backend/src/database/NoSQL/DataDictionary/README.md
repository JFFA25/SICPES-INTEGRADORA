# Data Dictionary - NoSQL (Medical Services)

![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white)
![Documentation](https://img.shields.io/badge/Documentation-Reference-green?style=for-the-badge&logo=bookstack&logoColor=white)

Esta carpeta centraliza la documentación técnica del esquema NoSQL utilizado para el módulo de servicios médicos y auditoría del sistema.

## Archivo Principal

*   **[DataDictionary_MS.pdf](./DataDictionary_MS.pdf)**: Documento detallado que describe la estructura de los documentos, colecciones, tipos de datos y la lógica de persistencia en MongoDB.

## Estructura de Datos (Document-Oriented)

A diferencia del esquema relacional (SQL), el diccionario NoSQL se enfoca en una estructura flexible basada en documentos BSON:

*   **Colecciones**: Conjuntos de documentos (equivalente a tablas).
*   **Documentos**: Registros en formato JSON/BSON con esquemas dinámicos.
*   **Sub-documentos**: Objetos anidados para representar relaciones 1:1 o 1:N de forma embebida.

## Entidades Documentadas

El diccionario cubre las siguientes colecciones principales identificadas en el sistema:
*   `valoraciones`: Registros de atención médica, diagnósticos y estudios.
*   `user_details`: Información extendida y perfiles de usuario.
*   `audit_logs`: Trazabilidad de acciones administrativas y de sistema.
*   `notifications`: Historial de alertas y comunicaciones.

## Tipos de Datos Comunes

| Tipo | Uso |
|------|-----|
| `ObjectId` | Identificador único único generado por MongoDB. |
| `String` | Textos, nombres y descripciones. |
| `Number / Double` | Valores numéricos y cálculos médicos. |
| `Boolean` | Flags de estado (ej: `es_grave`). |
| `Date` | Marcas de tiempo ISO para auditoría. |
| `Array` | Listas de estudios, síntomas o etiquetas. |
| `Object` | Estructuras anidadas para datos complejos. |

> **Nota**: El esquema NoSQL está diseñado para alta disponibilidad y escalabilidad. Para entender las validaciones aplicadas a nivel de aplicación, consulte los esquemas de Pydantic en el código fuente.
