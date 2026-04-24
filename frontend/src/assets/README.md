# Assets (Recursos Estáticos) - Frontend SICPES

 
<img src="https://img.shields.io/badge/PNG-Imágenes-4CAF50?style=for-the-badge&logo=files&logoColor=white" alt="PNG"/>
<img src="https://img.shields.io/badge/JPG-Fotografías-FF6B6B?style=for-the-badge&logo=image&logoColor=white" alt="JPG"/>
<img src="https://img.shields.io/badge/SVG-Vectores-FFB300?style=for-the-badge&logo=svg&logoColor=white" alt="SVG"/>
<img src="https://img.shields.io/badge/WEBP-Optimizadas-0052cc?style=for-the-badge&logo=image&logoColor=white" alt="WEBP"/>

Esta carpeta (`/src/assets/`) centraliza todos los **recursos visuales estáticos** del frontend de SICPES: fotografías del equipo, imágenes institucionales, íconos, diagramas y gráficos de la marca. Son importados directamente en los componentes y páginas que los necesitan.
 
## Estructura del Directorio
 
*   **`images/colors_scipes.png`**:
    *   Paleta de colores oficial del sistema SICPES para referencia de diseño.
*   **`images/compartido.png`**:
    *   Imagen representativa de los espacios o habitaciones compartidas del sistema.
*   **`images/departament.webp`**:
    *   Fotografía principal del departamento/instalaciones. Usada en el componente `Hero.tsx` como imagen destacada de la landing page con animación de entrada.
*   **`images/Diagrama_Gantt_SICPES.jpeg`**:
    *   Diagrama de Gantt oficial del proyecto SICPES. Referenciado en el README principal del frontend.
*   **`images/edgar_cabrera.jpg`**:
    *   Fotografía de perfil del integrante Edgar Cabrera Velázquez.
*   **`images/edwin_hernandez.jpg`**:
    *   Fotografía de perfil del integrante Edwin Hernández Campos.
*   **`images/giovany_pazos.jpg`**:
    *   Fotografía de perfil del integrante Giovany Raul Pazos Cruz.
*   **`images/icon.ico`**:
    *   Favicon de la aplicación. Referenciado en `index.html` como ícono del navegador.
*   **`images/icon.png`**:
    *   Ícono principal del sistema en formato PNG. Usado en `Dashboard.tsx` y `Login.tsx` como logo de la barra de navegación interna.
*   **`images/individual.png`**:
    *   Imagen representativa de los cuartos/habitaciones individuales del sistema.
*   **`images/jose_flores.jpg`**:
    *   Fotografía de perfil del integrante Jose Francisco Flores Amador.
*   **`images/Organigrama-SICPES.png`**:
    *   Organigrama institucional del sistema SICPES con la estructura organizacional del proyecto.
*   **`images/SICPES_Empresa.png`**:
    *   Imagen corporativa de SICPES para secciones de presentación institucional.
*   **`images/SICPES_Producto.png`**:
    *   Imagen del producto/servicio SICPES. Usada en el README principal del proyecto.
*   **`images/SICPES.png`**:
    *   Logo principal de SICPES. Referenciado en el README principal del frontend.
*   **`images/uriel_maldonado.jpg`**:
    *   Fotografía de perfil del integrante Uriel Maldonado Bernabe.
*   **`hero.png`**:
    *   Imagen principal del banner de la landing page.
*   **`react.svg`**:
    *   Logo de React en formato vectorial, generado por defecto con Vite.
*   **`vite.svg`**:
    *   Logo de Vite en formato vectorial, generado por defecto con Vite.
## Cómo importar un asset
 
```tsx
import logo from '../assets/images/SICPES.png';
import hero from '../assets/hero.png';
 
<img src={logo} alt="Logo SICPES" />
<img src={hero} alt="Banner principal" />
```
 
## Formatos utilizados
 
| Formato | Uso |
|---|---|
| `.png` | Logos, íconos y gráficos con transparencia |
| `.jpg` | Fotografías del equipo e instalaciones |
| `.webp` | Imágenes optimizadas para web |
| `.jpeg` | Diagramas y documentos visuales |
| `.svg` | Íconos vectoriales escalables |
| `.ico` | Favicon del navegador |
 
 ### Integrantes

1. **Jose Francisco Flores Amador** /[@JFFA25](https://github.com/JFFA25)
2. **Edgar Cabrera Velázquez** /[@Edgar-Cbr](https://github.com/Edgar-Cbr)
3. **Edwin Hernández Campos** /[@Edwinhdzcm](https://github.com/Edwinhdzcm)
4. **Giovany Raul Pazos Cruz** /[@giova0412](https://github.com/giova0412)
5. **Uriel Maldonado Bernabe** /[@Urii7895](https://github.com/Urii7895)
  