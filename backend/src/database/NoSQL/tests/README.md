# Test NoSQL – Generación de Datos Hospitalarios![Node.js](https://img.shields.io/badge/node.js-339933?style=for-the-badge&logo=Node.js&logoColor=white)![Express](https://img.shields.io/badge/express.js-000000?style=for-the-badge&logo=express&logoColor=white)![MongoDB](https://img.shields.io/badge/mongodb-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white)![Mongoose](https://img.shields.io/badge/mongoose-880000?style=for-the-badge&logo=mongoose&logoColor=white)![Swagger](https://img.shields.io/badge/swagger-85EA2D.svg?style=for-the-badge&logo=swagger&logoColor=black)

##  Descripción

Este módulo corresponde a las pruebas realizadas sobre el **esquema NoSQL (MongoDB)** del sistema de servicios médicos.

El objetivo es validar la correcta inserción, estructura y comportamiento de documentos dentro de la colección

##  Ejemplo de solicitud

```json
{
  "cantidad": 1000,
  "es_grave": false
}
```

Cada documento representa una valoración clínica asociada a un paciente, incluyendo información médica, estudios solicitados y auditoría.

## Endpoint utilizado

```
POST /api/poblar-nosql
```

### Dashboard Inicial con el Primer Test de 1k de Registros

![NoSQL](/backend/src/database/NoSQL/dashboard/Dashboard_NoSQL.jpg)

### Evidencia del Test

### 1.Insercion basica de valoraciones 1k de Registros

![NoSQL](/backend/src/database/NoSQL/tests/1.Inserción%20básica%20de%20valoraciones%20(1,000%20registros).png)

### 2.Insercion de valoraciones criticas 3k de Registros

![NoSQL](/backend/src/database/NoSQL/tests/2.Insercion%20de%20valoraciones%20criticas3k.png)

### 3.Inserción masiva de valoraciones 5k de Registros

![NoSQL](/backend/src/database/NoSQL/tests/3.Inserción%20masiva%20de%20valoraciones%20(5,000%20registros).png)

### 4.Inserción masiva de valoraciones críticas 5k de Registros

![NoSQL](/backend/src/database/NoSQL/tests/4.Inserción%20masiva%20de%20valoraciones%20críticas%205k.png)

### 5.Inserción intensiva de valoraciones 10k de Registros

![NoSQL](/backend/src/database/NoSQL/tests/5.Inserción%20intensiva%20de%20valoraciones%2010k%20de%20Registros.png)


### Dashboard Actual con 22K de registros previos a los tests

![SQL](/backend/src/database/NoSQL/dashboard/Upgrade_Dashboard_NoSQL.jpg)

### Autores

1. **Jose Francisco Flores Amador** /[@JFFA25](https://github.com/JFFA25)
2. **Edgar Cabrera Velázquez** /[@Edgar-Cbr](https://github.com/Edgar-Cbr)
3. **Edwin Hernández Campos** /[@Edwinhdzcm](https://github.com/Edwinhdzcm)
4. **Giovany Raul Pazos Cruz** /[@giova0412](https://github.com/giova0412)
5. **Uriel Maldonado Bernabe** /[@Urii7895](https://github.com/Urii7895)