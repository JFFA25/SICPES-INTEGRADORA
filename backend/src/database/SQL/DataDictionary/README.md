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

## Ejemplo de Estructura de Tabla

### tabla usuarios

| Campo | Tipo | Nullable | Default | Descripción |
|-------|------|----------|---------|--------------|
| id | INT | NO | AUTO_INCREMENT | PK |
| nombre | VARCHAR(100) | NO | - | Nombre completo |
| email | VARCHAR(255) | NO | - | Correo único |
| password | VARCHAR(100) | NO | - | Contraseña encriptada |
| rol | ENUM | NO | 'estudiante' | rol del usuario |
| estado | ENUM | NO | 'activo' | Estado del usuario |
| telefono | VARCHAR(20) | SI | NULL | Teléfono de contacto |
| fecha_registro | DATETIME | NO | CURRENT_TIMESTAMP | Fecha de creación |
| fecha_actualizacion | DATETIME | SI | NULL | Última modificación |

### tabla reservaciones

| Campo | Tipo | Nullable | Default | Descripción |
|-------|------|----------|---------|--------------|
| id | INT | NO | AUTO_INCREMENT | PK |
| usuario_id | INT | NO | - | FK -> usuarios.id |
| habitacion_id | INT | SI | NULL | FK -> habitaciones.id |
| fecha_inicio | DATE | NO | - | Fecha de ingreso |
| fecha_fin | DATE | SI | NULL | Fecha de salida |
| estado | ENUM | NO | 'pendiente' | Estado de reservación |
| precio_total | DECIMAL(10,2) | NO | 0.00 | Monto total |
| observaciones | TEXT | SI | NULL | Notas adicionales |
| fecha_solicitud | DATETIME | NO | CURRENT_TIMESTAMP | Fecha de creación |

### tabla pagos

| Campo | Tipo | Nullable | Default | Descripción |
|-------|------|----------|---------|--------------|
| id | INT | NO | AUTO_INCREMENT | PK |
| reservacion_id | INT | NO | - | FK -> reservaciones.id |
| usuario_id | INT | NO | - | FK -> usuarios.id |
| monto | DECIMAL(10,2) | NO | - | Monto del pago |
| fecha_pago | DATETIME | NO | CURRENT_TIMESTAMP | Fecha de pago |
| metodo_pago | ENUM | NO | 'transferencia' | Método utilizado |
| estado | ENUM | NO | 'pendiente' | Estado del pago |
| referencia | VARCHAR(100) | SI | NULL | Referencia bancaria |

### tabla habitaciones

| Campo | Tipo | Nullable | Default | Descripción |
|-------|------|----------|---------|--------------|
| id | INT | NO | AUTO_INCREMENT | PK |
| piso_id | INT | NO | - | FK -> pisos.id |
| numero | VARCHAR(10) | NO | - | Número de cuarto |
| capacidad | INT | NO | 1 | Capacidad máxima |
| precio_mensual | DECIMAL(10,2) | NO | - | Precio de renta |
| estado | ENUM | NO | 'disponible' | Estado de habitación |
| descripcion | VARCHAR(255) | SI | NULL | Descripción del cuarto |

### tabla pisos

| Campo | Tipo | Nullable | Default | Descripción |
|-------|------|----------|---------|--------------|
| id | INT | NO | AUTO_INCREMENT | PK |
| numero | INT | NO | - | Número de piso |
| nombre | VARCHAR(50) | SI | NULL | Nombre del piso |
| descripcion | VARCHAR(255) | SI | NULL | Descripción |

## Índices delSistema

### Índices Primarios

- usuarios: id
- reservaciones: id
- pagos: id
- habitaciones: id
- pisos: id
- quotas: id

### Índices Únicos

- usuarios: email (único)
- habitaciones: numero + piso_id (compuesto)

### Índices de Búsqueda

- reservaciones: usuario_id, estado
- pagos: usuario_id, reservacion_id, estado

## Restricciones (Constraints)

### Foreign Keys

```sql
-- Reservaciones
FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
FOREIGN KEY (habitacion_id) REFERENCES habitaciones(id)

-- Pagos
FOREIGN KEY (reservacion_id) REFERENCES reservaciones(id)
FOREIGN KEY (usuario_id) REFERENCES usuarios(id)

-- Habitaciones
FOREIGN KEY (piso_id) REFERENCES pisos(id)
```

### Constraints de Validación

- CHECK (precio_total >= 0)
- CHECK (capacidad > 0 AND capacidad <= 4)
- CHECK (monto > 0)

## Referencias Externas

- **PDF completo**: `DataDictionary_SICPES.pdf`
- **Script de estructura**: `backups/sicpes_backup_estructure.sql`
- **Diagrama ER**: `strucuture/SICPES_Estrucuture.png`

## Licencia

ISC