 # Components (Componentes) - Frontend SICPES


<img src="https://img.shields.io/badge/React-19.2.4-61DAFB?style=for-the-badge&logo=react&logoColor=black" alt="React"/>

<img src="https://img.shields.io/badge/TypeScript-5.9.3-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript"/>

<img src="https://img.shields.io/badge/TailwindCSS-3.4.4-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white" alt="TailwindCSS"/>

<img src="https://img.shields.io/badge/React_Router-7.14.0-CA4245?style=for-the-badge&logo=reactrouter&logoColor=white" alt="React Router"/>
 

 Esta carpeta (`/src/components/`) contiene los **componentes UI reutilizables** del frontend de SICPES. Son piezas de interfaz independientes que se comparten entre múltiples páginas, garantizando consistencia visual y evitando la duplicación de código. Representan la capa de presentación compartida de la aplicación.
 
## Estructura del Directorio
 
*   **`Navbar.tsx`**:
    *   Barra de navegación superior presente en las vistas públicas de la aplicación.
    *   **Funciones clave**: Muestra el logo de SICPES y los enlaces principales (Inicio, Contacto, Regístrate, Iniciar sesión). Consume el endpoint `/api/session` al montar para detectar si el usuario tiene rol `admin` y en ese caso renderiza dinámicamente el enlace **Panel Admin** hacia `/admin/reservations`. Usa `react-router-dom` para la navegación entre rutas sin recargar la página.
*   **`Hero.tsx`**:
    *   Sección principal de bienvenida visible en la landing page (`Home.tsx`).
    *   **Funciones clave**: Presenta la propuesta de valor del sistema SICPES con un layout de dos columnas: columna izquierda con título principal y descripción del servicio, y columna derecha con la imagen del departamento (`departament.webp`) con animación de entrada (`animate-building-enter`). Fondo con gradiente verde institucional de SICPES.
*   **`Footer.tsx`**:
    *   Pie de página global que aparece en la parte inferior de las vistas públicas.
    *   **Funciones clave**: Layout de tres columnas con fondo degradado verde oscuro institucional. Columna izquierda con enlaces de Aviso de privacidad, Términos de uso y Contacto. Columna central con el nombre SICPES y copyright 2026. Columna derecha con enlaces de Blog, FAQs y Soporte. Diseño responsivo que colapsa a una columna en móvil.
## Arquitectura y Convenciones
 
1. **Reutilización**: Todos los componentes están diseñados para funcionar en cualquier página sin depender de lógica específica de una sola vista.
2. **Tipado**: Cada componente está escrito en TypeScript (`.tsx`).
3. **Estilos**: Se utiliza TailwindCSS con clases utilitarias. No se usan archivos CSS separados por componente.
4. **Exportación**: Cada archivo exporta su componente como `export default NombreComponente`.
5. **Consumo de sesión**: El `Navbar` consume el contexto de sesión vía fetch para adaptar su contenido según el rol del usuario autenticado.
## Cómo agregar un nuevo componente
 
1. Crea un archivo `NombreComponente.tsx` en esta carpeta.
2. Define y exporta el componente como función de flecha.
3. Tipa sus props con una interfaz TypeScript si recibe parámetros.
4. Usa clases de TailwindCSS para los estilos.
5. Impórtalo en las páginas donde sea necesario.
 

 ### Integrantes

1. **Jose Francisco Flores Amador** /[@JFFA25](https://github.com/JFFA25)
2. **Edgar Cabrera Velázquez** /[@Edgar-Cbr](https://github.com/Edgar-Cbr)
3. **Edwin Hernández Campos** /[@Edwinhdzcm](https://github.com/Edwinhdzcm)
4. **Giovany Raul Pazos Cruz** /[@giova0412](https://github.com/giova0412)
5. **Uriel Maldonado Bernabe** /[@Urii7895](https://github.com/Urii7895)
