const fs = require("fs");
const path = require("path");

// Persistencia simple en disco para la configuración de la app (precios, correo admin).
// Antes vivía solo en una variable de memoria y se perdía en cada reinicio del servidor.
// No requiere una migración de base de datos; si más adelante se agrega una tabla
// tbd_configuracion, este módulo se puede reemplazar sin tocar los controladores.

const DATA_DIR = path.resolve(__dirname, "../database/data");
const SETTINGS_FILE = path.join(DATA_DIR, "settings.json");

const DEFAULT_SETTINGS = {
  precioIndividual: 2500,
  precioCompartida: 1800,
  emailAdmin: "admin@sicpes.com",
};

const ensureDataDir = () => {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
};

const readSettings = () => {
  try {
    ensureDataDir();
    if (!fs.existsSync(SETTINGS_FILE)) {
      fs.writeFileSync(SETTINGS_FILE, JSON.stringify(DEFAULT_SETTINGS, null, 2));
      return { ...DEFAULT_SETTINGS };
    }
    const raw = fs.readFileSync(SETTINGS_FILE, "utf-8");
    return { ...DEFAULT_SETTINGS, ...JSON.parse(raw) };
  } catch (err) {
    console.error("No se pudo leer settings.json, usando valores por defecto:", err.message);
    return { ...DEFAULT_SETTINGS };
  }
};

const writeSettings = (settings) => {
  ensureDataDir();
  fs.writeFileSync(SETTINGS_FILE, JSON.stringify(settings, null, 2));
  return settings;
};

module.exports = { readSettings, writeSettings, DEFAULT_SETTINGS };
