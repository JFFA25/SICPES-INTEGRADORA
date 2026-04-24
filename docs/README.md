# Documentación SICPES

![Docs](https://img.shields.io/badge/Documentation-SICPES-blue?style=for-the-badge&logo=googledocs&logoColor=white)

Este directorio contiene la documentación técnica y funcional del Sistema Integral de Control de Pensión de Estudiantes (SICPES).

## Estructura de Documentación

### [Contexto](./contexto/)
Contiene las definiciones fundamentales del sistema, requisitos y reglas que rigen el comportamiento de la aplicación.

*   **[BRs (Business Rules)](./contexto/BRs.md)**: Reglas de negocio que definen la lógica permitida (ej: límites de reservación, roles de admin).
*   **[FRs (Functional Requirements)](./contexto/FRs.md)**: Requerimientos funcionales que describen qué debe hacer el sistema.
*   **[NFRs (Non-Functional Requirements)](./contexto/NFRs.md)**: Atributos de calidad como seguridad, rendimiento y disponibilidad.

## Propósito

El objetivo de esta documentación es servir como referencia única para:
1.  **Desarrolladores**: Para entender las reglas que deben implementarse en el backend.
2.  **Stakeholders**: Para validar que el sistema cumple con las necesidades del negocio.
3.  **Mantenimiento**: Para facilitar la escalabilidad del sistema sin violar las restricciones originales.
