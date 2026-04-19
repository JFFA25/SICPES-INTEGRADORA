const nodemailer = require("nodemailer");

// CONFIGURACIÓN
const transporter = nodemailer.createTransport({
  host: process.env.MAIL_HOST,
  port: Number(process.env.MAIL_PORT),
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
});

// FUNCIÓN DE ENVÍO
const sendConfirmationEmail = async (email, token) => {
  const verificationUrl = `http://localhost:3000/api/confirm/${token}`;

  await transporter.sendMail({
    from: `"SICPES" <${process.env.MAIL_FROM}>`,
    to: email,
    subject: "Verifica tu correo",
    html: `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; border: 1px solid #e0e0e0; border-radius: 8px; overflow: hidden;">
      
      <!-- HEADER -->
      <div style="background-color: #2e7d32; color: white; text-align: center; padding: 30px;">
        <h1 style="margin: 0;">SICPES</h1>
        <p style="margin: 5px 0 0 0;">Verifica tu cuenta</p>
      </div>

      <!-- BODY -->
      <div style="padding: 30px; color: #333;">
        
        <p style="font-size: 16px;">
          Hola,
        </p>

        <p style="font-size: 15px; line-height: 1.6;">
          Gracias por registrarte en el <strong>Sistema Integral de Control de Pensión de Estudiantes</strong>.
        </p>

        <p style="font-size: 15px;">
          Para completar tu registro, confirma tu correo electrónico:
        </p>

        <!-- BOTÓN -->
        <div style="text-align: center; margin: 30px 0;">
          <a href="${verificationUrl}"
             style="background-color: #2e7d32; color: white; padding: 14px 30px; 
                    text-decoration: none; border-radius: 6px; font-size: 16px;">
            Confirmar cuenta
          </a>
        </div>

        <!-- FALLBACK -->
        <p style="font-size: 13px; color: #777;">
          Si el botón no funciona, copia y pega este enlace en tu navegador:
        </p>

        <p style="font-size: 12px; word-break: break-all; color: #2e7d32;">
          ${verificationUrl}
        </p>

      </div>

      <!-- FOOTER -->
      <div style="background-color: #f5f7fa; padding: 20px; text-align: center; font-size: 12px; color: #777;">
        <p style="margin: 5px;">© 2025 SICPES</p>
        <p style="margin: 5px;">Todos los derechos reservados</p>
      </div>

    </div>
    `,
  });
};

const sendForgotPasswordEmail = async (email, token) => {
  const resetUrl = `http://localhost:5173/reset-password/${token}`;

  await transporter.sendMail({
    from: `"SICPES" <${process.env.MAIL_FROM}>`,
    to: email,
    subject: "Recuperación de contraseña",
    html: `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; border: 1px solid #e0e0e0; border-radius: 8px; overflow: hidden;">
      <div style="background-color: #2e7d32; color: white; text-align: center; padding: 30px;">
        <h1 style="margin: 0;">SICPES</h1>
        <p style="margin: 5px 0 0 0;">Recuperación de contraseña</p>
      </div>
      <div style="padding: 30px; color: #333;">
        <p style="font-size: 16px;">Hola,</p>
        <p style="font-size: 15px; line-height: 1.6;">
          Has solicitado restablecer tu contraseña. Haz clic en el botón de abajo para poder actualizar tu cuenta con una nueva contraseña. Si no lo solicitaste, puedes ignorar este mensaje.
        </p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${resetUrl}"
             style="background-color: #2e7d32; color: white; padding: 14px 30px; text-decoration: none; border-radius: 6px; font-size: 16px;">
            Cambiar Contraseña
          </a>
        </div>
        <p style="font-size: 13px; color: #777;">Si el botón no funciona, copia y pega este enlace:</p>
        <p style="font-size: 12px; word-break: break-all; color: #2e7d32;">${resetUrl}</p>
      </div>
    </div>
    `,
  });
};

module.exports = {
  sendConfirmationEmail,
  sendForgotPasswordEmail
};