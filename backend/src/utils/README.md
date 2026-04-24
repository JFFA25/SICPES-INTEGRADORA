# Utils (Utilidades) - Backend SICPES

![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)![Mailer](https://img.shields.io/badge/Mailer-Nodemailer-blue?style=for-the-badge)

Funciones auxiliares y herramientas transversales del sistema.

## Archivos

- `mailer.js` → Configuración y funciones para el envío de correos electrónicos automáticos (Gmail/SMTP).

## Uso rápido

```javascript
const mailer = require('./utils/mailer');
await mailer.sendEmail({ to, subject, html });
```
