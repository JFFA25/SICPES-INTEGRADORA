# <p align="center">SICPES</p>
<p align="center">
  <strong>Sistema Integral de Control de Pensión de Estudiantes</strong><br>
  <em>"Conectando estudiantes con hogares seguros, digitalizando la gestión de pensiones."</em>
</p>

<p align="center">
  <img src="/frontend/src/assets/images/SICPES_Producto.png" alt="SICPES Logo" width="250"/>
</p>

<p align="center">
  <a href="#tecnologías">
    <img src="https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB" alt="React"/>
  </a>
  <a href="#tecnologías">
    <img src="https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript"/>
  </a>
  <a href="#tecnologías">
    <img src="https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white" alt="Node.js"/>
  </a>
  <a href="#tecnologías">
    <img src="https://img.shields.io/badge/mysql-4479A1.svg?style=for-the-badge&logo=mysql&logoColor=white" alt="MySQL"/>
  </a>
  <a href="#tecnologías">
    <img src="https://img.shields.io/badge/FastAPI-009688.svg?style=for-the-badge&logo=fastapi&logoColor=white" alt="FastAPI"/>
  </a>
  <a href="#web-services-y-apis-externas">
    <img src="https://img.shields.io/badge/OpenStreetMap-74ACDF?style=for-the-badge&logo=openstreetmap&logoColor=white" alt="OSRM"/>
  </a>
</p>

## Resumen Ejecutivo

SICPES es una innovadora plataforma web diseñada para proporcionar a los estudiantes un acceso simplificado a la gestión y búsqueda de alojamiento en pensiones. Nuestra misión es conectar a estudiantes con espacios seguros y accesibles, y brindar a los administradores una herramienta eficiente para el control de sus inmuebles.

### Por qué SICPES
*   **Automatización:** Control centralizado de disponibilidad sin procesos manuales.
*   **Seguridad:** Conexión con espacios seguros y verificación de identidad.
*   **Finanzas Claras:** Gestión de pagos, cuotas y deudores sin errores técnicos.
*   **UX Intuitiva:** Dashboards modernos diseñados para la facilidad de uso.

## Problemática vs Solución

| El Problema | La Solución (SICPES) |
| :--- | :--- |
| Procesos informales y desorganizados en la búsqueda de pensión. | Plataforma intuitiva para visualizar disponibilidad y solicitar reservaciones. |
| Administración manual en libretas propensa a errores y pérdida de datos. | Administrador digital que estandariza cobros y automatiza registros. |
| Dificultad para validar pagos y empalme de reservaciones. | Sistema de validación en tiempo real y dashboards administrativos claros. |

## Tecnologías

| Capa | Herramientas |
| :--- | :--- |
| **Frontend** | React, TypeScript, TailwindCSS ![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB) ![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white) ![TailwindCSS](https://img.shields.io/badge/tailwindcss-%2338B2AC.svg?style=for-the-badge&logo=tailwind-css&logoColor=white) |
| **Backend** | Node.js, Express, FastAPI (Python) ![Node.js](https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white) ![Express](https://img.shields.io/badge/express.js-%23404d59.svg?style=for-the-badge&logo=express&logoColor=%2361DAFB) ![FastAPI](https://img.shields.io/badge/FastAPI-009688.svg?style=for-the-badge&logo=fastapi&logoColor=white) |
| **Bases de Datos** | MySQL, MongoDB ![MySQL](https://img.shields.io/badge/mysql-4479A1.svg?style=for-the-badge&logo=mysql&logoColor=white) ![MongoDB](https://img.shields.io/badge/MongoDB-%234ea94b.svg?style=for-the-badge&logo=mongodb&logoColor=white) |
| **Documentación** | Swagger/OpenAPI, Markdown ![Markdown](https://img.shields.io/badge/markdown-%23000000.svg?style=for-the-badge&logo=markdown&logoColor=white) |

## Web Services y APIs Externas

Para robustecer la automatización de procesos, garantizar la seguridad en el acceso y optimizar la experiencia de usuario, SICPES se integra con un ecosistema de servicios web especializados:

| Servicio / API | Propósito en el Proyecto | Tags |
| :--- | :--- | :--- |
| **Mailtrap API** | Pasarela para el envío y validación de correos electrónicos transaccionales automatizados durante el registro y confirmación de cuentas de nuevos usuarios. | ![Mailtrap](https://img.shields.io/badge/Mailtrap-Email_Service-22D3EE?style=flat-square&logo=mailtrap&logoColor=white) |
| **Twilio API** | Envío automatizado de códigos de verificación y alertas de seguridad directo al **WhatsApp** del estudiante para la validación de identidad en dos pasos. | ![Twilio](https://img.shields.io/badge/Twilio-WhatsApp_API-F22F46?style=flat-square&logo=twilio&logoColor=white) |
| **PDFmonkey API** | Generación dinámica y automatizada en formato PDF de contratos de arrendamiento, recibos de pago y reportes financieros generales desde el backend. | ![PDFmonkey](https://img.shields.io/badge/PDFmonkey-Document_Automation-00C4B4?style=flat-square) |
| **OSRM API** *(Open Source Routing Machine)* | Cálculo en tiempo real de rutas óptimas a pie, devolviendo la distancia exacta (en kilómetros) desde la ubicación del estudiante hasta la pensión. | ![OSRM](https://img.shields.io/badge/OSRM-Routing_API-74ACDF?style=flat-square&logo=openstreetmap&logoColor=white) |
| **HTML5 Geolocation API** | Obtención nativa y segura de las coordenadas geográficas (`latitud` y `longitud`) del dispositivo del usuario (previo consentimiento). | ![HTML5](https://img.shields.io/badge/HTML5-Geolocation-orange?style=flat-square) |
| **Google Maps Embed API** | Renderizado de mapas interactivos dinámicos para la visualización espacial del entorno de la UT Xicotepec de Juárez y la pensión. | ![Google Maps](https://img.shields.io/badge/Google_Maps-Embed_API-red?style=flat-square&logo=googlemaps&logoColor=white) |

>**Impacto de la solución:** Estas integraciones forman el núcleo de automatización del proyecto. Mientras **Mailtrap** y **Twilio** blindan el acceso y validación de los datos del estudiante, **PDFmonkey** elimina el uso de papelería física en la administración y **OSRM** asiste de forma interactiva en la llegada del alumno foráneo a su nuevo hogar.

## Identidad Visual

### Logos del Proyecto
<p align="center">
  <img src="/frontend/src/assets/images/SICPES_Empresa.png" alt="Logo Empresa" width="300"/>
  <img src="/frontend/src/assets/images/SICPES_Producto.png" alt="Logo Producto" width="300"/>
</p>

### Paleta de Colores
<p align="center">
  <img src="/frontend/src/assets/images/colors_scipes.png" alt="Colores" width="600"/>
</p>

## Gestión del Proyecto

### Estructura Organizacional
![Organigrama](/frontend/src/assets/images/Organigrama-SIPCES.png)

### Cronograma (Gantt)
![Gantt](/frontend/src/assets/images/Diagrama_Gantt_SICPES.jpeg)

## Nuestro Equipo

| Desarrollador | Rol | GitHub |
| :--- | :--- | :--- |
| **Jose Francisco Flores Amador** | Líder de Proyecto / Fullstack / Documentación | [@JFFA25](https://github.com/JFFA25) |
| **Edgar Cabrera Velázquez** | Backend / Lógica del sistema | [@Edgar-Cbr](https://github.com/Edgar-Cbr) |
| **Edwin Hernández Campos** | Base de datos / Estructura | [@Edwinhdzcm](https://github.com/Edwinhdzcm) |
| **Giovany Raul Pazos Cruz** | Frontend / Interfaz | [@giova0412](https://github.com/giova0412) |
| **Brisa Nallely Garcia Gregorio** | Pruebas / Soporte / Documentación | [@Brisgregorio](https://github.com/Brisgregorio) |