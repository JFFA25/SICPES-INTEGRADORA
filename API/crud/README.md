# CRUD (Operaciones) - Backend SICPES

![FastAPI](https://img.shields.io/badge/FastAPI-005571?style=for-the-badge&logo=fastapi&logoColor=white)
![Python](https://img.shields.io/badge/Python-3776AB?style=for-the-badge&logo=python&logoColor=white)
![CRUD](https://img.shields.io/badge/Layer-CRUD-yellow?style=for-the-badge)

Esta carpeta (`/crud/`) contiene la lógica de interacción directa con la base de datos. Es la capa responsable de ejecutar las consultas SQLAlchemy utilizando los modelos y esquemas definidos.

## Estructura del Directorio

*   **`user_crud.py`**:
    *   Consultas para crear, buscar y listar usuarios. Maneja el hashing de contraseñas.
*   **`reservation_crud.py`**:
    *   Lógica para gestionar el ciclo de vida de las reservas en la base de datos.
*   **`room_crud.py`**:
    *   Operaciones para consultar y actualizar el estado de habitaciones y pisos.
*   **`quota_crud.py`**:
    *   Gestión de registros financieros y cuotas de pago.

## Arquitectura

1.  **Desacoplamiento**: Separa la definición de la ruta (`routes/`) de la lógica de acceso a datos.
2.  **Sesiones**: Cada función recibe un objeto `db: Session` para ejecutar las operaciones.
3.  **Eficiencia**: Utiliza consultas optimizadas de SQLAlchemy para interactuar con MySQL.

## Cómo agregar una nueva operación CRUD

1.  Crea o edita un archivo `nombre_crud.py`.
2.  Define una función que reciba el objeto de sesión `db` y los datos (esquemas).
3.  Utiliza `db.add()`, `db.commit()`, `db.refresh()` para mutaciones.
4.  Utiliza `db.query(Model).filter(...)` para consultas.
5.  Retorna el objeto procesado o el resultado de la consulta.
