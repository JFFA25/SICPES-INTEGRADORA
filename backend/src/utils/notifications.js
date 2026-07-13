const twilio = require("twilio");

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const fromNumber = process.env.TWILIO_FROM_NUMBER;
const whatsappFrom = process.env.TWILIO_WHATSAPP_FROM;

let client = null;

if (accountSid && authToken && (fromNumber || whatsappFrom)) {
  client = twilio(accountSid, authToken);
}

const log = (message, detail) => {
  if (detail) {
    console.log(`[notifications] ${message}`, detail);
    return;
  }
  console.log(`[notifications] ${message}`);
};

const sendSms = async ({ to, body }) => {
  if (!to) {
    return { ok: false, simulated: true, reason: "No phone number configured" };
  }

  if (!client || !fromNumber) {
    log(`SIMULATED SMS to ${to}: ${body}`);
    return { ok: true, simulated: true, provider: "console" };
  }

  try {
    const message = await client.messages.create({
      body,
      from: fromNumber,
      to,
    });
    log(`SMS sent to ${to}`, message.sid);
    return { ok: true, simulated: false, sid: message.sid };
  } catch (error) {
    log(`SMS failed for ${to}`, error.message);
    return { ok: false, simulated: true, reason: error.message };
  }
};

const sendWhatsApp = async ({ to, body }) => {
  if (!to) {
    return { ok: false, simulated: true, reason: "No WhatsApp recipient configured" };
  }

  if (!client || !whatsappFrom) {
    log(`SIMULATED WhatsApp to ${to}: ${body}`);
    return { ok: true, simulated: true, provider: "console" };
  }

  try {
    const recipient = to.startsWith("whatsapp:") ? to : `whatsapp:${to}`;
    const sender = whatsappFrom ? `whatsapp:${whatsappFrom}` : `whatsapp:${fromNumber}`;

    const message = await client.messages.create({
      body,
      from: sender,
      to: recipient,
    });

    log(`WhatsApp sent to ${to}`, message.sid);
    return { ok: true, simulated: false, sid: message.sid };
  } catch (error) {
    log(`WhatsApp failed for ${to}`, error.message);
    return { ok: false, simulated: true, reason: error.message };
  }
};

const sendOtpCode = async ({ to, code, channel = "sms" }) => {
  const body = `Tu código de verificación de SICPES es ${code}. Válido por 10 minutos.`;

  if (channel === "whatsapp") {
    return sendWhatsApp({ to, body });
  }

  return sendSms({ to, body });
};

module.exports = {
  sendSms,
  sendWhatsApp,
  sendOtpCode,
};
