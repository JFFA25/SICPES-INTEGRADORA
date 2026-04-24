# Models (Modelos) - Backend SICPES

![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)![MySQL](https://img.shields.io/badge/MySQL-4479A1?style=for-the-badge&logo=mysql&logoColor=white)

Esta carpeta contiene la capa de abstracción de datos. Cada archivo encapsula las consultas SQL y la interacción directa con la base de datos MySQL.

## Archivos

- `user.model.js` → Gestión de perfiles y credenciales de usuario.
- `reservation.model.js` → Lógica de persistencia para el ciclo de vida de reservaciones.
- `payment.model.js` → Manejo transaccional de pagos y comprobantes.
- `quota.model.js` → Control de mensualidades y estados financieros.

## Capas de Datos

1.  **Consultas Preparadas**: Se utiliza el pool de conexiones para ejecutar queries seguras contra SQL injection.
2.  **Abstracción**: Los controladores no conocen el SQL; solo llaman a funciones del modelo (ej: `getUserById`).
3.  **Integridad**: Las funciones validan la existencia de registros antes de proceder con mutaciones.

## Cómo agregar un nuevo modelo

1. Crea el archivo `nombre.model.js`.
2. Importa la conexión `db` desde `../database/db`.
3. Exporta un objeto con las funciones asíncronas de consulta.
