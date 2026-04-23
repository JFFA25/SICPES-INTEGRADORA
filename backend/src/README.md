# Código Fuente (src/)

Esta carpeta contiene todo el código fuente del backend de SICPES.

## Estructura de Directorios

```
src/
├── controllers/    # Lógica de negocio - Manejan las solicitudes HTTP
├── routes/         # Definición de endpoints y mapeo a controladores
├── models/         # Modelos de datos y consultas SQL
├── middlewares/    # Funciones intermedias (autenticación, validación)
├── database/       # Conexión a MySQL y scripts SQL
└── utils/          # Utilidades auxiliares (envío de correos)
```

## Capas de la Arquitectura

| Carpeta | Función |
|---------|---------|
| `controllers/` | Procesan la lógica de negocio y responden al cliente |
| `routes/` | Definen las rutas URL y conectan con los controladores |
| `models/` | Interactúan con la base de datos |
| `middlewares/` | Validaciones previas a los controladores |
| `database/` | Configuración de conexión y scripts SQL |
| `utils/` | Funciones helper (email, helpers varios) |

## Flujo de una Solicitud

```
Cliente → Routes → Middlewares → Controllers → Models → Base de Datos
                ↑                                              ↓
                └──────────── Respuesta JSON ←─────────────────┘
```