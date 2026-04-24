# SICPES - REST API

![Python](https://img.shields.io/badge/python-3670A0?style=for-the-badge&logo=python&logoColor=ffdd54)
![FastAPI](https://img.shields.io/badge/FastAPI-005571?style=for-the-badge&logo=fastapi)
![JWT](https://img.shields.io/badge/JWT-black?style=for-the-badge&logo=JSON%20web%20tokens)
![MySQL](https://img.shields.io/badge/mysql-4479A1.svg?style=for-the-badge&logo=mysql&logoColor=white)
![Swagger](https://img.shields.io/badge/swagger-85EA2D.svg?style=for-the-badge&logo=swagger&logoColor=black)
![API REST](https://img.shields.io/badge/API-REST-blue?style=for-the-badge)
![CORS](https://img.shields.io/badge/CORS-enabled-green?style=for-the-badge)

## Descripción General
Esta es la API administrativa oficial de **SICPES** diseñada para gestionar de manera robusta toda la operativa de reservaciones, habitaciones, usuarios y control de cuotas financieras. Está construida sobre el ecosistema moderno de **FastAPI** con conexión a una base de datos relacional **MySQL** a través del ORM **SQLAlchemy**.

## Arquitectura de Seguridad
Todo el ecosistema está rigurosamente protegido utilizando el estándar de seguridad **JSON Web Tokens (JWT)**.
1. Identificación y redirección basada en roles (`admin` y `usuario`). Solo el personal autorizado puede realizar operaciones CRUD sobre datos sensibles.
2. La llave de acceso central es el endpoint público de `Login`.
3. Una vez autorizado, las llamadas viajan con un Token portador (HTTPBearer) validado por seguridad al vuelo mediante middlewares.
4. Las contraseñas en bases de datos jamás tocan texto plano; son inyectadas usando hashes segurizados por `Passlib`.
5. Políticas dinámicas **CORS** que garantizan compatibilidad transparente para el frontend.

## Modelos de Dominio
El backend de SICPES incluye el flujo integrado de la administración:
1. **Usuarios (Autenticación)**: Registro protegido, asignación de roles (`admin`/`usuario`) y Login global.
2. **Reservaciones**: Ciclo de vida completo del sistema de reservas, incluyendo control de solicitudes y loops de retroalimentación de rechazos.
3. **Habitaciones y Pisos**: Gestión de la estructura inmobiliaria mediante controles dinámicos para la selección de espacios.
4. **Pagos y Finanzas**: Gestión del sistema de cobros y administración de cuotas financieras alineado con las reservaciones.

## Diagrama EER
![EER](/backend/src/database/SQL/strucuture/SICPES_Estrucuture.png) *(Puedes actualizar esta ruta a la de tu imagen del diagrama)*

## Guía de Inicialización Rápida
Hidrata tu entorno virtual o instala las dependencias directamente así:
```bash
py -r requirements.txt
```
Ejecuta tu terminal local utilizando Uvicorn como servidor ASGI:
```bash
py -m uvicorn app:app --reload
```
*(Nota: Asegúrate de tener tus variables de entorno configuradas para la conexión a MySQL).*

## Documentación Viva
Visita la increíble interfaz gráfica autogenerada para ejecutar e interactuar con la API abriendo la consola en tu entorno local:  
**[http://127.0.0.1:8000/docs](http://127.0.0.1:8000/docs)**


### Integrantes

1. **Jose Francisco Flores Amador** /[@JFFA25](https://github.com/JFFA25)
2. **Edgar Cabrera Velázquez** /[@Edgar-Cbr](https://github.com/Edgar-Cbr)
3. **Edwin Hernández Campos** /[@Edwinhdzcm](https://github.com/Edwinhdzcm)
4. **Giovany Raul Pazos Cruz** /[@giova0412](https://github.com/giova0412)
5. **Uriel Maldonado Bernabe** /[@Urii7895](https://github.com/Urii7895)
