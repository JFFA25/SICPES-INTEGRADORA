# Backups - SICPES

![MySQL](https://img.shields.io/badge/MySQL-4479A1?style=for-the-badge&logo=mysql&logoColor=white)
![Backup](https://img.shields.io/badge/Backup-Storage-%23333333?style=for-the-badge&logo=googledrive&logoColor=white)

Esta carpeta contiene los scripts de respaldo (backups) de la estructura de la base de datos del sistema SICPES.

## Archivo Principal

| Archivo | Descripción |
|---------|-------------|
| `sicpes_backup_estructure.sql` | Script SQL con la estructura completa de todas las tablas |

## Tipos de Backups

### 1. Backup de Estructura
Contiene únicamente la definición de tablas, índices y relaciones. No incluye datos.

### 2. Backup Completo
Incluye estructura + datos. No se incluye por tamaño.

### 3. Backup Incremental
Contiene solo los cambios desde el último backup.

## Tablas Incluidas

- `usuarios` - Registro de usuarios del sistema
- `reservaciones` - Solicitudes de alojamiento
- `pagos` - Registro de pagos
- `habitaciones` - Inventario de habitaciones
- `pisos` - Definición de pisos
- `quotas` - Prorrateos y mensualidades
- `configuraciones` - Configuraciones globales

## Cómo Usar el Backup

### Restaurar la Estructura

```bash
mysql -u root -p sicpes < sicpes_backup_estructure.sql
```

### Desde MySQL Client

```sql
SOURCE ruta/al/archivo/sicpes_backup_estructure.sql;
```

## Copia de Seguridad Manual

### Exportar estructura

```bash
mysqldump -u root -p --no-data sicpes > estructura.sql
```

### Exportar todo

```bash
mysqldump -u root -p sicpes > backup_completo.sql
```

## Programación de Backups

### Diario
```bash
0 2 * * * mysqldump -u root -p sicpes > /backup/sicpes_$(date +\%Y\%m\%d).sql
```

### Semanal
```bash
0 3 * * 0 mysqldump -u root -p sicpes > /backup/sicpes_semanal.sql
```

## Almacenamiento y Retención

| Tipo | Retención |
|------|----------|
| Diario | 7 días |
| Semanal | 4 semanas |
| Mensual | 12 meses |

## Verificación

```bash
mysql -u root -p -e "USE sicpes; SHOW TABLES;"
```

## Mejores Prácticas

1. **Nunca sobreescribir** - crear nuevo archivo con fecha
2. **Verificar siempre** - después de cada backup
3. **Probar restauración** - mensualmente
4. **Almacenamiento seguro** - mínimo en 2 ubicaciones

## Diferencias

- **Backups**: Script SQL ejecutable para restaurar estructura
- **DataDictionary**: Documentación de referencia (PDF)
- **strucuture/**: Diagramas visuales

## Licencia

ISC