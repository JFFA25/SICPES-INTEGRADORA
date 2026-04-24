# NoSQL Models - MongoDB SICPES

![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white)
![NoSQL](https://img.shields.io/badge/Layer-NoSQL-green?style=for-the-badge)

A diferencia de SQL, donde se definen clases de SQLAlchemy, en NoSQL (MongoDB) la estructura es dinámica. Sin embargo, para mantener la consistencia con el sistema, se utilizan esquemas de Pydantic (`schemas/nosql/`) para validar los datos antes de persistirlos.

## Colecciones Utilizadas

1.  **`user_details`**: Almacena información extendida del perfil de los estudiantes (dirección, contactos de emergencia, hobbies).
2.  **`audit_logs`**: Registro histórico de acciones administrativas sensibles para auditoría.
3.  **`notifications`**: Historial de alertas y mensajes enviados a los usuarios.

## Arquitectura

*   **Esquemas**: Ubicados en `schemas/nosql/` para validación de entrada/salida.
*   **CRUD**: Ubicado en `crud/nosql/` para la lógica de inserción y consulta utilizando `motor`.
*   **Configuración**: La conexión se gestiona en `config/mongodb.py`.
