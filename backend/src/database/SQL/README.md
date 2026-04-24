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

El dashboard de Navicat  se encuentra en `dashboard/Dashboard - SICPES.png`

##Diccionario de Datos

Consulta `DataDictionary/DataDictionary_SICPES.pdf` para referencia completa de campos y relaciones.

## Respaldos

El script de respaldo de estructura está en `backups/sicpes_backup_estructure.sql`

## Conexión desde Backend

La conexión se configura en `backend/src/database/db.js`:

```javascript
const mysql = require('mysql2/promise');

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'sicpes',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

module.exports = pool;
```

## Configuración de Variables de Entorno

En el archivo `.env` del backend:

```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=tu_password
DB_NAME=sicpes
PORT=3306
```

## Ejemplo de Consulta SQL

```sql
-- Obtener todas las reservaciones activas
SELECT r.*, u.nombre, u.email, h.numeroHabitacion
FROM reservaciones r
JOIN usuarios u ON r.usuarioId = u.id
JOIN habitaciones h ON r.habitacionId = h.id
WHERE r.estado = 'activa';
```

## Mantenimiento

### Respaldos periódicos
Se recomienda realizar backups diarios de la estructura y datos:

```bash
mysqldump -u root -p sicpes > backup_$(date +%Y%m%d).sql
```

### Optimización
Ejecuta análisis periódico de tablas:

```sql
ANALYZE TABLE usuarios;
ANALYZE TABLE reservaciones;
ANALYZE TABLE pagos;
```

## Resolución de Problemas

### Error de conexión
1. Verifica que MySQL esté ejecutándose
2. Confirma credenciales en `.env`
3. Verifica que la base de datos exista

### Error de codificación
Asegurate de usar utf8mb4 en la creación de la base de datos:

```sql
CREATE DATABASE sicpes CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

## Documentación Adicional

- **Diccionario de datos**: Consulta `DataDictionary/DataDictionary_SICPES.pdf`
- **Diagrama de estructura**: Ver `strucuture/SICPES_Estrucuture.png`
- **Dashboard visual**: Ver `dashboard/Dashboard - SICPES.png`

## Licencia

ISC