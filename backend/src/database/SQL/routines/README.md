# SQL Routines (Rutinas) - SICPES

![MySQL](https://img.shields.io/badge/MySQL-4479A1?style=for-the-badge&logo=mysql&logoColor=white)
![Stored Procedures](https://img.shields.io/badge/SQL-Stored%20Procedures-CC2927?style=for-the-badge&logo=microsoftsqlserver&logoColor=white)

Este módulo contiene los **Procedimientos Almacenados (Stored Procedures)** diseñados para la automatización de tareas, limpieza de datos e inyección de Mock Data en el sistema SICPES.

## Archivos

*   **`sp_generar_datos_aleatorios.sql`**: Generador automático de datos de prueba (usuarios, reservaciones, pagos).
*   **`sp_generar_datos_aleatorios_parametros.sql`**: Generador avanzado que permite filtrar por cantidad, estados y roles específicos.
*   **`sp_limpiar_tablas.sql`**: Script de mantenimiento para vaciar las tablas principales y reiniciar los contadores ID.

## Funcionalidad Clave

1.  **Hidratación de Datos**: Permite poblar el sistema rápidamente para pruebas de estrés o demostraciones.
2.  **Lógica Híbrida**: Los generadores respetan las llaves foráneas y la integridad referencial del diagrama EER.
3.  **Mantenimiento**: Facilita el reseteo del entorno de desarrollo sin borrar la estructura de la base de datos.

## Uso

1.  Ejecuta el script SQL en tu cliente (MySQL Workbench, Navicat, etc.) para crear el procedimiento.
2.  Llamada al generador básico:
    ```sql
    CALL sp_generar_datos_aleatorios();
    ```
3.  Llamada al limpiador:
    ```sql
    CALL sp_limpiar_tablas();
    ```

> **Nota**: Se recomienda ejecutar la limpieza antes de realizar una inyección masiva de datos para evitar duplicados o conflictos de lógica.
