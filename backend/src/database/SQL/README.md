# Base de Datos SQL - SICPES

![MySQL](https://img.shields.io/badge/MySQL-4479A1?style=for-the-badge&logo=mysql&logoColor=white)
![Database](https://img.shields.io/badge/Database-SQL-CC2927?style=for-the-badge&logo=microsoftsqlserver&logoColor=white)

Esta carpeta contiene el núcleo de persistencia del sistema SICPES basado en MySQL. Aquí se gestionan los scripts de estructura, procedimientos almacenados y documentación técnica del modelo relacional.

## Estructura del Directorio

*   **`backups/`**: Scripts SQL para restauración completa de la estructura.
*   **`dashboard/`**: Métricas visuales y capturas de la salud del sistema.
*   **`DataDictionary/`**: Diccionario de datos detallado (Tablas, campos y tipos).
*   **`routines/`**: Stored Procedures para limpieza y generación masiva de datos.
*   **`strucuture/`**: Diagramas EER y script de creación inicial.
*   **`tests/`**: Resultados de pruebas de carga y métricas de rendimiento.

## Entidades Principales

El sistema se basa en 5 pilares relacionales:
1.  **Usuarios**: Control de acceso y roles.
2.  **Reservaciones**: Ciclo de vida de la estancia.
3.  **Habitaciones**: Inventario físico y disponibilidad.
4.  **Pagos**: Registro transaccional de cobros.
5.  **Cuotas**: Programación financiera de deudas.

## Configuración Rápida

1.  Asegúrate de tener MySQL 8.0+ instalado.
2.  Ejecuta el script de estructura en `strucuture/`.
3.  Configura las credenciales en el archivo `.env` del backend.
4.  Usa los procedimientos en `routines/` para poblar el sistema con datos de prueba.

> **Nota**: Para ver el diagrama de relaciones detallado, consulta [strucuture/README.md](./strucuture/README.md).
