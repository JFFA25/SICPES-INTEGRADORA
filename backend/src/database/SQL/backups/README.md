# Backups - SICPES

![MySQL](https://img.shields.io/badge/MySQL-4479A1?style=for-the-badge&logo=mysql&logoColor=white)
![Backup](https://img.shields.io/badge/Backup-SQL-success?style=for-the-badge&logo=mysql&logoColor=white)

Esta carpeta contiene los archivos de respaldo necesarios para reconstruir o migrar la base de datos del sistema SICPES.

## Archivo Principal

*   **`sicpes_backup_estructure.sql`**: Script completo que contiene la definición de todas las tablas, relaciones, índices y restricciones de integridad.

## 🛠 Cómo restaurar la base de datos

### Opción 1: Terminal (Línea de comandos)
```bash
mysql -u root -p sicpes < sicpes_backup_estructure.sql
```

### Opción 2: MySQL Workbench / Navicat
1. Abre tu cliente de base de datos.
2. Crea la base de datos `sicpes` si no existe.
3. Ejecuta el archivo `sicpes_backup_estructure.sql` mediante la opción "Run SQL Script".

## Recomendaciones
1. **Verificación**: Después de restaurar, verifica que las tablas (`usuarios`, `reservaciones`, etc.) se hayan creado correctamente.
2. **Estructura vs Datos**: Este backup es de **estructura**. Para poblar el sistema, usa los procedimientos en la carpeta `routines/`.