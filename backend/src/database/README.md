# Database (Base de Datos) - SICPES

![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)![MySQL](https://img.shields.io/badge/MySQL-4479A1?style=for-the-badge&logo=mysql&logoColor=white)

Esta carpeta centraliza la configuración de las conexiones y la persistencia de datos del sistema SICPES, soportando tanto modelos relacionales como no relacionales.

## Estructura

*   **`SQL/`**: Contiene la estructura, rutinas, backups y diccionarios de la base de datos MySQL. [Ver README](./SQL/README.md).
*   **`NoSQL/`**: Espacio reservado para integraciones con bases de datos documentales (MongoDB).
*   **`db.js`**: Archivo central de conexión que exporta el `pool` de hilos para MySQL utilizando el driver `mysql2`.

## Conexión Principal

La conexión se gestiona mediante variables de entorno y utiliza un patrón de pool para optimizar el rendimiento:

```javascript
const mysql = require('mysql2/promise');
const pool = mysql.createPool({ ... });
module.exports = pool;
```

## Uso

Para realizar consultas en los modelos:
1. Importa el objeto `db` desde este directorio.
2. Ejecuta sentencias SQL asíncronas.
3. Asegúrate de manejar los cierres de conexión implícitos del pool.
