# Data Dictionary - SICPES

![MySQL](https://img.shields.io/badge/MySQL-4479A1?style=for-the-badge&logo=mysql&logoColor=white)
![Documentation](https://img.shields.io/badge/Documentation-Book-%23F7DF1E?style=for-the-badge&logo=bookstack&logoColor=white)

Esta carpeta contiene el diccionario de datos del sistema SICPES, documentando todas las tablas, campos, tipos de datos y relaciones de la base de datos.

## Archivo Principal

- **DataDictionary_SICPES.pdf**: Documentación completa en formato PDF con todas las tablas y campos.

## Descripción General

El diccionario de datos es la referencia técnica definitiva para:

- Nombres de tablas y campos
- Tipos de datos MySQL
- Restricciones (constraints)
- Relaciones entre entidades
- Valores permitidos (enums)

## Tablas del Sistema

### Entidades Principales

| Tabla | Descripción |
|-------|-------------|
| `usuarios` | Registro de usuarios (estudiantes y administradores) |
| `reservaciones` | Solicitudes de alojamiento |
| `pagos` | Registro de pagos de mensualidades |
| `habitaciones` | Inventario de habitaciones por piso |
| `quotas` | Prorrateos y mensualidades |
| `configuraciones` | Configuraciones globales del sistema |
| `pisos` | Definición de pisos del edificio |

### Relaciones entre Tablas

```
usuarios (1) ────── (N) reservaciones
usuarios (1) ────── (N) pagos
habitaciones (1) ────── (N) reservaciones
reservaciones (1) ────── (N) pagos
reservaciones (1) ────── (N) quotas
pisos (1) ────── (N) habitaciones
```

## Convenciones de Nombrado

- **Tablas**: Plural en minúsculas (usuarios, reservaciones)
- **Campos**: snake_case (fecha_nacimiento, numero_habitacion)
- **Claves primarias**: id (AUTO_INCREMENT)
- **Claves foráneas**: nombreTabla_id (usuario_id, habitacion_id)

## Tipos de Datos Comunes

| Tipo | Uso |
|------|-----|
| INT | IDs numéricos |
| VARCHAR(255) | Nombres, emails |
| VARCHAR(100) | Contraseñas hasheadas |
| DATE | Fechas |
| DATETIME | Fechas con hora |
| ENUM | Estado valores |
| DECIMAL(10,2) | Montos monetarios |
| TEXT | Descripciones largas |
| BOOLEAN | Flags binarios |

## Estados de Registros

### Reservaciones
- pendiente
- activa
- cancelada
- rechazada
- completada

### Pagos
- pendiente
- verificado
- rechazado

### Usuarios
- activo
- inactivo
- suspendido

## Uso del Diccionario

1. Consulta el PDF para referencia completa de campos
2. Verifica los tipos antes de realizar consultas
3. Revisa las restricciones antes de inserts/updates
4. Consulta los enums para valores válidos

## Documentación PDF

El archivo `DataDictionary_SICPES.pdf` contiene:

- Portada con información del proyecto
- Índice de tablas
- Descripción de cada tabla
- Lista de campos con tipos
- Valores por defecto
- Restricciones
- Índice de relaciones

## Actualización del Diccionario

Cuando se modifica la estructura de la base de datos:

1. Actualiza el script SQL correspondiente
2. Regenera el diccionario PDF
3. Versiona el cambio en git

## Licencia

ISC