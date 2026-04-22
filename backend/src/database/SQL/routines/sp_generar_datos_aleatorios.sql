CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_generar_sicpes_aleatorios`(IN num_registros INT)
BEGIN
    DECLARE i INT DEFAULT 1;
    DECLARE v_uid INT;
    DECLARE v_rid INT;
    DECLARE v_nombre VARCHAR(50);
    DECLARE v_apellido VARCHAR(50);
    DECLARE v_estado_res VARCHAR(20);
    DECLARE v_estado_pago VARCHAR(20);
    DECLARE v_estado_cuota VARCHAR(20);
    DECLARE v_tipo_res VARCHAR(20);
    DECLARE v_metodo_pago VARCHAR(20);
    DECLARE v_monto DECIMAL(10,2);
    
    SET FOREIGN_KEY_CHECKS = 0;
    SET SQL_SAFE_UPDATES = 0;

    WHILE i <= num_registros DO
        -- Generar Nombres Reales Aleatorios
        SET v_nombre = ELT(FLOOR(1 + RAND() * 8), 'Ana', 'Luis', 'Sofia', 'Diego', 'Carla', 'Javier', 'Maria', 'Fernando');
        SET v_apellido = ELT(FLOOR(1 + RAND() * 8), 'Gomez', 'Lopez', 'Perez', 'Diaz', 'Ruiz', 'Hernandez', 'Garcia', 'Martinez');
        
        -- Aleatorizar montos y estados según los ENUM de la base de datos
        SET v_monto = FLOOR(1000 + RAND() * 4000); -- Monto entre 1000 y 5000
        SET v_estado_res = ELT(FLOOR(1 + RAND() * 6), 'solicitud', 'confirmada', 'activa', 'terminada', 'cancelada', 'rechazada');
        SET v_tipo_res = ELT(FLOOR(1 + RAND() * 5), 'individual', 'compartida', 'estudiante', 'profesor', 'corporativo');
        SET v_estado_pago = ELT(FLOOR(1 + RAND() * 3), 'Pendiente', 'Pagado', 'Atrasado');
        SET v_estado_cuota = ELT(FLOOR(1 + RAND() * 3), 'generada', 'pendiente', 'pagada');
        SET v_metodo_pago = ELT(FLOOR(1 + RAND() * 3), 'transferencia', 'efectivo', 'tarjeta_credito');

        -- 1. Insertar Usuario
        INSERT INTO tbd_usuarios (nombre, email, password, rol, confirmado)
        VALUES (
            CONCAT(v_nombre, ' ', v_apellido), 
            CONCAT(LOWER(v_nombre), '.', LOWER(v_apellido), i, FLOOR(RAND()*10000), '@ejemplo.com'), 
            '$5$rounds=535000$A/O2YQkV$QO2$5$r', -- Simulación de un Hash Passlib
            'user', 
            1
        );
        SET v_uid = LAST_INSERT_ID();

        -- 2. Insertar Reservación
        INSERT INTO tbd_reservaciones (usuario_id, fecha_ingreso, tipo, piso, habitacion, monto, estado, motivo_rechazo)
        VALUES (
            v_uid, 
            DATE_ADD(CURRENT_DATE, INTERVAL FLOOR(RAND() * 30 - 15) DAY), -- Fechas cercanas a hoy
            v_tipo_res, 
            FLOOR(1 + RAND() * 5), -- Pisos del 1 al 5
            FLOOR(100 + RAND() * 50), -- Habitaciones 100 al 150
            v_monto, 
            v_estado_res,
            IF(v_estado_res = 'rechazada', 'Documentos incompletos o cupo lleno', NULL)
        );
        SET v_rid = LAST_INSERT_ID();

        -- 3. Insertar Pago
        INSERT INTO tbd_pagos (reservacion_id, mes, anio, monto_pagado, monto_calculado, fecha_pago, metodo_pago, estado, tipo_pago)
        VALUES (
            v_rid, 
            MONTH(CURRENT_DATE), 
            YEAR(CURRENT_DATE), 
            IF(v_estado_pago = 'Pagado', v_monto, 0.00), 
            v_monto, 
            IF(v_estado_pago = 'Pagado', NOW(), NULL), 
            v_metodo_pago, 
            v_estado_pago, 
            'mensual'
        );

        -- 4. Insertar Cuota
        INSERT INTO tbd_cuotas (reservacion_id, mes, anio, tipo_pago, monto_calculado, monto_real, estado, fecha_vencimiento)
        VALUES (
            v_rid, 
            MONTH(CURRENT_DATE), 
            YEAR(CURRENT_DATE), 
            'mensual', 
            v_monto, 
            IF(v_estado_cuota = 'pagada', v_monto, 0.00), 
            v_estado_cuota, 
            DATE_ADD(CURRENT_DATE, INTERVAL FLOOR(RAND() * 10) DAY) -- Límite de pago aleatorio
        );

        SET i = i + 1;
    END WHILE;

    SET FOREIGN_KEY_CHECKS = 1;
    SET SQL_SAFE_UPDATES = 1;
END