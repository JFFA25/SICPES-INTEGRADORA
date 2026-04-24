## SICPES - Frontend

<p align="center">
  <img src="/frontend/src/assets/images/SICPES.png" alt="SICPES Logo" width="200"/>
</p>

<h1 align="center">SICPES - Frontend</h1>
<p align="center">
  <strong>Sistema Integral de Control de Pensión de Estudiantes</strong><br>
  <em>"Interfaz moderna para la gestión de reservaciones y pagos de estancias estudiantiles."</em>
</p>

<img src="https://img.shields.io/badge/React-19.2.4-61DAFB?style=for-the-badge&logo=react&logoColor=black" alt="React"/>
<img src="https://img.shields.io/badge/TypeScript-5.9.3-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript"/>
<img src="https://img.shields.io/badge/Vite-8.0.1-646CFF?style=for-the-badge&logo=vite&logoColor=white" alt="Vite"/>
<img src="https://img.shields.io/badge/TailwindCSS-3.4.4-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white" alt="TailwindCSS"/>
<img src="https://img.shields.io/badge/React_Router-7.14.0-CA4245?style=for-the-badge&logo=reactrouter&logoColor=white" alt="React Router"/>
<img src="https://img.shields.io/badge/ESLint-9.39.4-4B32C3?style=for-the-badge&logo=eslint&logoColor=white" alt="ESLint"/>

## Descripción General
Este es el Frontend oficial de **SICPES** diseñado para ofrecer una interfaz moderna, responsiva y completamente tipada que conecta a estudiantes y administradores con toda la operativa del sistema: reservaciones de habitaciones, gestión de pagos, control de accesos y administración general de estancias estudiantiles. Está construido sobre el ecosistema moderno de **React 19** con **TypeScript**, empaquetado mediante **Vite** como herramienta de build ultrarrápida y estilizado con **TailwindCSS** como framework de utilidades CSS.
 
## Arquitectura de la Interfaz
Toda la navegación está gestionada mediante **React Router DOM** con separación clara de responsabilidades por capas.
1. Identificación y redirección basada en roles (`admin` y `usuario`). Solo el personal autorizado puede acceder a los paneles de administración.
2. El punto de acceso central es la vista pública de `Login`.
3. Una vez autenticado, el contexto global de sesión mantiene el estado del usuario disponible en toda la aplicación.
4. Las rutas privadas verifican la existencia de sesión activa antes de renderizar; en caso contrario redirigen automáticamente a `/login`.
5. La comunicación con el backend viaja a través de un **proxy inverso** configurado en Vite que redirige todas las llamadas `/api/*` al servidor Node.js en `localhost:3000`.
## Vistas del Sistema
El frontend de SICPES incluye el flujo completo de la experiencia del usuario:
1. **Autenticación**: Registro de nuevos estudiantes, inicio de sesión global y recuperación de contraseña por correo electrónico.
2. **Reservaciones**: Ciclo de vida completo de la reserva desde la perspectiva del estudiante, incluyendo selección de fechas y habitación disponible.
3. **Pagos**: Historial de pagos individuales y procesamiento de mensualidades y prorrateos desde el panel del usuario.
4. **Panel de Administración**: Gestión global de reservaciones, pagos y configuración del sistema exclusiva para el rol `admin`.
## Wireframes
El proyecto cuenta con los wireframes de las pantallas principales del sistema ubicados en la carpeta `/wireframes/`:
 
| Wireframe | Descripción |
|---|---|
| `inicio.png` | Diseño de la landing page / página de inicio |
| `login.png` | Diseño de la pantalla de inicio de sesión |
| `registro.png` | Diseño del formulario de registro general |
| `registro estudiante.png` | Diseño del registro específico para estudiantes |
| `au.png` | Diseño del panel de autenticación de usuario |
| `contacto.png` | Diseño de la página de contacto |
| `gestion de pagos.png` | Diseño del panel de gestión de pagos |
| `seguimiento.png` | Diseño de la vista de seguimiento de reservaciones |
 
## Diagrama del Proyecto
![Gantt](/frontend/src/assets/images/Diagrama_Gantt_SICPES.jpeg)
 
## Guía de Inicialización Rápida
Instala las dependencias del proyecto directamente así:
```bash
npm install
```
Ejecuta el servidor de desarrollo local con Vite:
```bash
npm run dev
```
*(Nota: Asegúrate de tener el backend corriendo en `localhost:3000` para que el proxy funcione correctamente).*
 
## Documentación Viva
Visita la aplicación corriendo localmente en tu navegador:  
**[http://localhost:5173](http://localhost:5173)**
 
### Integrantes
 
1. **Jose Francisco Flores Amador** /[@JFFA25](https://github.com/JFFA25)
2. **Edgar Cabrera Velázquez** /[@Edgar-Cbr](https://github.com/Edgar-Cbr)
3. **Edwin Hernández Campos** /[@Edwinhdzcm](https://github.com/Edwinhdzcm)
4. **Giovany Raul Pazos Cruz** /[@giova0412](https://github.com/giova0412)
5. **Uriel Maldonado Bernabe** /[@Urii7895](https://github.com/Urii7895)
 