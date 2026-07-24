-- Migración: agrega la columna `telefono` a `tbd_usuarios`.
-- El código (registro, notificaciones de WhatsApp/SMS) ya la usaba,
-- pero la tabla en la base de datos nunca la tuvo, causando 500 al registrar.
--
-- Ejecutar UNA sola vez contra tu base de datos existente (no borra datos):
--   mysql -u root -p -P 3307 sicpes < 2026-07-20_add_telefono_a_usuarios.sql
-- o pega el ALTER TABLE directamente en tu cliente de MySQL (Workbench, DBeaver, etc.)

ALTER TABLE `tbd_usuarios`
  ADD COLUMN `telefono` varchar(30) DEFAULT NULL
  COMMENT 'Teléfono con prefijo whatsapp: para notificaciones por WhatsApp/SMS'
  AFTER `token`;
