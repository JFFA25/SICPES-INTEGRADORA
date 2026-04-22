CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_limpiar_tablas`()
BEGIN
    -- Se puede agregar el nombre de otra tabla si es que se agrega una nueva tabla , tambien se limpiara
    -- Desactivar restricciones de claves foráneas
    SET FOREIGN_KEY_CHECKS = 0;

    -- Limpiar tablas
    TRUNCATE TABLE tbd_pagos;
    TRUNCATE TABLE tbd_reservaciones;
    TRUNCATE TABLE tbd_cuotas;

    -- Reactivar restricciones
    SET FOREIGN_KEY_CHECKS = 1;
END