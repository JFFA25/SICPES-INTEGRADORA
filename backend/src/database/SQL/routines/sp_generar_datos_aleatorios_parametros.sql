    CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_generar_lote_hibrido`(
        IN p_cantidad INT,
        IN p_estado_reservacion VARCHAR(20),
        IN p_estado_pago VARCHAR(20),
        IN p_motivo_rechazo VARCHAR(255),
        IN p_usuario_confirmado INT,
        IN p_metodo_pago VARCHAR(50) -- Nuevo parámetro
    )
    BEGIN
        DECLARE i INT DEFAULT 1;
        DECLARE v_uid INT;
        DECLARE v_rid INT;
        DECLARE v_nombre VARCHAR(50);
        DECLARE v_apellido VARCHAR(50);
        DECLARE v_estado_res_final VARCHAR(20);
        DECLARE v_estado_pago_final VARCHAR(20);
        DECLARE v_estado_cuota_final VARCHAR(20);
        DECLARE v_metodo_pago_final VARCHAR(50);
        DECLARE v_tipo_res VARCHAR(20);
        DECLARE v_monto DECIMAL(10,2);
        DECLARE v_usuario_confirm_final INT;
        DECLARE v_motivo_rechazo_final VARCHAR(255);
        
        SET FOREIGN_KEY_CHECKS = 0;
        SET SQL_SAFE_UPDATES = 0;

        -- LIMPIEZA DE BASURA
        IF p_estado_reservacion = 'string' THEN SET p_estado_reservacion = NULL; END IF;
        IF p_estado_pago = 'string' THEN SET p_estado_pago = NULL; END IF;
        IF p_metodo_pago = 'string' THEN SET p_metodo_pago = NULL; END IF;
        IF p_motivo_rechazo = 'string' THEN SET p_motivo_rechazo = NULL; END IF;

        WHILE i <= p_cantidad DO
            -- Generadores base
            SET v_nombre = ELT(FLOOR(1 + RAND() * 8), 'Ana', 'Luis', 'Sofia', 'Diego', 'Carla', 'Javier', 'Maria', 'Fernando');
            SET v_apellido = ELT(FLOOR(1 + RAND() * 8), 'Gomez', 'Lopez', 'Perez', 'Diaz', 'Ruiz', 'Hernandez', 'Garcia', 'Martinez');
            SET v_monto = FLOOR(1000 + RAND() * 4000); 
            SET v_tipo_res = ELT(FLOOR(1 + RAND() * 5), 'individual', 'compartida', 'estudiante', 'profesor', 'corporativo');

            -- Lógica Híbrida: Reservación
            IF p_estado_reservacion IS NULL OR p_estado_reservacion = '' THEN
                SET v_estado_res_final = ELT(FLOOR(1 + RAND() * 6), 'solicitud', 'confirmada', 'activa', 'terminada', 'cancelada', 'rechazada');
            ELSE
                SET v_estado_res_final = p_estado_reservacion;
            END IF;

            -- Lógica Híbrida: Pago
            IF v_estado_res_final IN ('solicitud', 'cancelada', 'rechazada') THEN
                SET v_estado_pago_final = 'Pendiente';
            ELSEIF p_estado_pago IS NULL OR p_estado_pago = '' THEN
                SET v_estado_pago_final = ELT(FLOOR(1 + RAND() * 3), 'Pendiente', 'Pagado', 'Atrasado');
            ELSE
                SET v_estado_pago_final = p_estado_pago;
            END IF;

            -- Lógica Híbrida: Método de Pago
            IF p_metodo_pago IS NULL OR p_metodo_pago = '' THEN
                SET v_metodo_pago_final = ELT(FLOOR(1 + RAND() * 3), 'transferencia', 'efectivo', 'tarjeta_credito');
            ELSE
                SET v_metodo_pago_final = p_metodo_pago;
            END IF;

            -- Lógica Confimación Usuario
            IF p_usuario_confirmado IS NULL THEN
                SET v_usuario_confirm_final = FLOOR(RAND() * 2);
            ELSE
                SET v_usuario_confirm_final = p_usuario_confirmado;
            END IF;

            -- Lógica Motivo de Rechazo Variado
            IF v_estado_res_final = 'rechazada' THEN
                IF p_motivo_rechazo IS NULL OR p_motivo_rechazo = '' THEN
                    SET v_motivo_rechazo_final = ELT(FLOOR(1 + RAND() * 8), 
                        'Falta de documentación académica', 
                        'Cupo lleno en el piso seleccionado', 
                        'Incumplimiento de políticas de convivencia', 
                        'Error en la verificación de identidad', 
                        'Historial de pagos negativo', 
                        'No cumple con el perfil de estudiante', 
                        'Documentación de tutor incompleta', 
                        'Solicitud duplicada'
                    );
                ELSE
                    SET v_motivo_rechazo_final = p_motivo_rechazo;
                END IF;
            ELSE
                SET v_motivo_rechazo_final = NULL;
            END IF;

            SET v_estado_cuota_final = IF(v_estado_pago_final = 'Pagado', 'pagada', IF(v_estado_pago_final = 'Atrasado', 'pendiente', 'generada'));

            -- 1. Insertar Usuario
            INSERT INTO tbd_usuarios (nombre, email, password, rol, confirmado)
            VALUES (
                CONCAT(v_nombre, ' ', v_apellido), 
                CONCAT(LOWER(v_nombre), '_', LOWER(v_apellido), i, CAST(RAND()*10000 AS UNSIGNED), '@gmail.com'), 
                '$s2$fakehash', 'user', v_usuario_confirm_final
            );
            SET v_uid = LAST_INSERT_ID();

            -- 2. Insertar Reservación
            INSERT INTO tbd_reservaciones (usuario_id, fecha_ingreso, tipo, piso, habitacion, monto, estado, motivo_rechazo)
            VALUES (
                v_uid, CURRENT_DATE, v_tipo_res, FLOOR(1 + RAND() * 5), FLOOR(100 + RAND() * 50), v_monto, v_estado_res_final,
                v_motivo_rechazo_final
            );
            SET v_rid = LAST_INSERT_ID();

            -- 3. Insertar Pago
            INSERT INTO tbd_pagos (reservacion_id, mes, anio, monto_pagado, monto_calculado, fecha_pago, metodo_pago, estado, tipo_pago)
            VALUES (
                v_rid, MONTH(CURRENT_DATE), YEAR(CURRENT_DATE), 
                IF(v_estado_pago_final = 'Pagado', v_monto, 0.00), v_monto, 
                IF(v_estado_pago_final = 'Pagado', NOW(), NULL), 
                v_metodo_pago_final, v_estado_pago_final, 'mensual'
            );

            -- 4. Insertar Cuota
            INSERT INTO tbd_cuotas (reservacion_id, mes, anio, tipo_pago, monto_calculado, monto_real, estado, fecha_vencimiento)
            VALUES (
                v_rid, MONTH(CURRENT_DATE), YEAR(CURRENT_DATE), 'mensual', v_monto, 
                IF(v_estado_pago_final = 'Pagado', v_monto, 0.00), v_estado_cuota_final, 
                DATE_ADD(CURRENT_DATE, INTERVAL 5 DAY)
            );

            SET i = i + 1;
        END WHILE;

        SET FOREIGN_KEY_CHECKS = 1;
        SET SQL_SAFE_UPDATES = 1;
    END