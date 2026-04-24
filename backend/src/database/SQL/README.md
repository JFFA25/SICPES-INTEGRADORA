# Base de Datos SQL - SICPES

![MySQL](https://img.shields.io/badge/MySQL-4479A1?style=for-the-badge&logo=mysql&logoColor=white)
![Database](https://img.shields.io/badge/Database-SQL-CC2927?style=for-the-badge&logo=microsoftsqlserver&logoColor=white)

Esta carpeta contiene todo lo relacionado con la base de datos MySQL del proyecto SICPES: estructura, rutinas, dashboards, backups y diccionario de datos.

## Estructura del Directorio

```
SQL/
├── backups/           # Respaldo de la estructura de la base de datos
├── dashboard/         # Dashboard visual de Navicat
├── DataDictionary/    # Diccionario de datos en formato PDF
├── routines/         # Stored Procedures y scripts de datos
├── strucuture/        # Diagrama de la estructura de tablas
└── tests/            # Pruebas y métricas de rendimiento
```

## Descripción de Subcarpetas

| Carpeta | Descripción |
|---------|-------------|
| `backups/` | Scripts SQL con la estructura completa para respaldo y restauración |
| `dashboard/` | Dashboard de Navicat con métricas visuales del sistema |
| `DataDictionary/` | Documentación de tablas, campos, tipos y relaciones |
| `routines/` | Stored procedures para limpieza y generación de datos |
| `strucuture/` | Diagrama visual de la arquitectura de tablas |
| `tests/` | Scripts y resultados de pruebas de carga |

## Primeros Pasos

1. Configura MySQL 8.0+ en tu equipo
2. Ejecuta el script de estructura en `strucuture/`
3. Configura las credenciales en `.env` del backend
4. Verifica la conexión iniciando el servidor

## Tablas Principales

El sistema cuenta con las siguientes entidades principales:

- **usuarios**: Registro de usuarios del sistema
- **reservaciones**: Solicitudes de alojamiento de estudiantes
- **pagos**: Registro de pagos de mensualidades
- **habitaciones**: Inventario de habitaciones/pisos
- **quotas**: Prorrateos y mensualidades
- **configuraciones**: Configuraciones globales del sistema

## Información Técnica

- **Motor**: MySQL 8.0+
- **Codificación**: utf8mb4
- **Collation**: utf8mb4_unicode_ci
- **Puerto default**: 3306

## Scripts Disponibles

En `routines/` encontrarás:

- `sp_generar_datos_aleatorios.sql` - Genera datos de prueba
- `sp_generar_datos_aleatorios_parametros.sql` - Generación con parámetros personalizados
- `sp_limpiar_tablas.sql` - Limpieza de datos de prueba

## Diagramas

El diagrama de estructura se encuentra en `strucuture/SICPES_Estrucuture.png`

## Dashboard

El dashboard de Power BI se encuentra en `dashboard/Dashboard - SICPES.png`

##Diccionario de Datos

Consulta `DataDictionary/DataDictionary_SICPES.pdf` para referencia completa de campos y relaciones.

## Respaldos

El script de respaldo de estructura está en `backups/sicpes_backup_estructure.sql`

## Licencia

ISC