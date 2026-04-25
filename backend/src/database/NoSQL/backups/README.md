# Backups NoSQL – MongoDB

![MongoDB](https://img.shields.io/badge/mongodb-4EA94B?style=for-the-badge\&logo=mongodb\&logoColor=white)
![Backup](https://img.shields.io/badge/backup-data-blue?style=for-the-badge)
![JSON](https://img.shields.io/badge/json-files-orange?style=for-the-badge)


## Descripción

Esta carpeta contiene los **respaldos (backups) de la base de datos NoSQL (MongoDB)** utilizados en el sistema de servicios médicos.

Su propósito es:

* Almacenar copias de seguridad de las colecciones
* Facilitar la restauración de datos
* Permitir pruebas con datasets reales
* Analizar información generada por la API

## Estructura

```bash id="bk1"
database/
└── NoSQL/
    └── backups/
        │── ms_hospital.valoraciones.json
        │── ms_hospital.valoraciones_post.json
```

## Archivos disponibles

###  ms_hospital.valoraciones.json

* Contiene datos de valoraciones clínicas generadas
* Utilizado como respaldo principal
* Permite restaurar el estado base de la colección

### ms_hospital.valoraciones_post.json

* Contiene datos posteriores a inserciones o pruebas
* Representa el estado después de ejecuciones del sistema
* Útil para comparar cambios y rendimiento

## Tecnologías utilizadas

| Componente         | Tecnología                                                                                                         |
| ------------------ | ------------------------------------------------------------------------------------------------------------------ |
| Base de datos      | MongoDB ![MongoDB](https://img.shields.io/badge/mongodb-4EA94B?style=for-the-badge\&logo=mongodb\&logoColor=white) |
| Formato de datos   | JSON ![JSON](https://img.shields.io/badge/json-FF6F00?style=for-the-badge)                                         |
| Gestión de backups | Archivos locales ![Backup](https://img.shields.io/badge/backup-storage-blue?style=for-the-badge)                   |

## Uso de los backups

Estos archivos pueden utilizarse para:

* Restaurar datos en MongoDB
* Ejecutar pruebas de carga
* Comparar resultados entre ejecuciones
* Analizar evolución de datos

## Notas

* Los archivos están en formato `.json` compatible con MongoDB
* Se recomienda mantener respaldos actualizados
* Pueden ser importados usando herramientas como `mongoimport`

### Autores

1. **Jose Francisco Flores Amador** /[@JFFA25](https://github.com/JFFA25)
2. **Edgar Cabrera Velázquez** /[@Edgar-Cbr](https://github.com/Edgar-Cbr)
3. **Edwin Hernández Campos** /[@Edwinhdzcm](https://github.com/Edwinhdzcm)
4. **Giovany Raul Pazos Cruz** /[@giova0412](https://github.com/giova0412)
5. **Uriel Maldonado Bernabe** /[@Urii7895](https://github.com/Urii7895)