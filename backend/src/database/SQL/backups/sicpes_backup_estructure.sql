-- MySQL dump 10.13  Distrib 8.0.45, for Win64 (x86_64)
--
-- Host: localhost    Database: sicpes
-- ------------------------------------------------------
-- Server version	9.6.0

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;
SET @MYSQLDUMP_TEMP_LOG_BIN = @@SESSION.SQL_LOG_BIN;
SET @@SESSION.SQL_LOG_BIN= 0;

--
-- GTID state at the beginning of the backup 
--

--
-- Table structure for table `tbd_cuotas`
--

DROP TABLE IF EXISTS `tbd_cuotas`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tbd_cuotas` (
  `id` int NOT NULL AUTO_INCREMENT,
  `reservacion_id` int DEFAULT NULL COMMENT 'ID de la reservación asociada.',
  `mes` tinyint DEFAULT NULL COMMENT 'Mes asignado a la cuota.',
  `anio` smallint DEFAULT NULL COMMENT 'Año asignado a la cuota.',
  `tipo_pago` enum('prorrateo','mensual','extra') NOT NULL DEFAULT 'mensual' COMMENT 'Clasificación de la cuota.',
  `monto_calculado` decimal(10,2) NOT NULL COMMENT 'Monto base a cargar.',
  `monto_real` decimal(10,2) DEFAULT NULL COMMENT '''Monto final cargado tras ajustes.',
  `estado` enum('generada','pendiente','pagada') NOT NULL DEFAULT 'generada',
  `fecha_vencimiento` date DEFAULT NULL COMMENT 'Fecha límite para pagar la cuota.',
  `fecha_generada` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'Fecha en que se programó esta cuota.',
  `creado_en` timestamp NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'Fecha de creación del registro.',
  PRIMARY KEY (`id`),
  KEY `reservacion_id` (`reservacion_id`),
  CONSTRAINT `tbd_cuotas_ibfk_1` FOREIGN KEY (`reservacion_id`) REFERENCES `tbd_reservaciones` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `tbd_pagos`
--

DROP TABLE IF EXISTS `tbd_pagos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tbd_pagos` (
  `id` int NOT NULL AUTO_INCREMENT,
  `reservacion_id` int DEFAULT NULL COMMENT 'ID de la reservación relacionada.',
  `mes` tinyint DEFAULT NULL COMMENT 'Mes del cargo (1-12).',
  `anio` smallint DEFAULT NULL COMMENT 'Año del cargo.',
  `monto_pagado` decimal(10,2) DEFAULT NULL COMMENT 'Cantidad real pagada.',
  `monto_calculado` decimal(10,2) DEFAULT NULL COMMENT 'Cantidad base esperada según contrato.',
  `fecha_pago` datetime DEFAULT NULL COMMENT 'Fecha y hora en que se efectuó el pago.',
  `fecha_generada` datetime DEFAULT NULL COMMENT 'Fecha en que se generó este registro de pago.',
  `metodo_pago` enum('transferencia','efectivo','tarjeta_credito') DEFAULT NULL COMMENT 'Medio utilizado para pagar.',
  `estado` enum('Pendiente','Pagado','Atrasado') DEFAULT 'Pendiente' COMMENT 'Estatus del pago.',
  `tipo_pago` enum('prorrateo','mensual','extra') NOT NULL DEFAULT 'mensual' COMMENT 'Concepto del pago.',
  PRIMARY KEY (`id`),
  KEY `fk_pago_reservacion` (`reservacion_id`),
  CONSTRAINT `fk_pago_reservacion` FOREIGN KEY (`reservacion_id`) REFERENCES `tbd_reservaciones` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `tbd_reservaciones`
--

DROP TABLE IF EXISTS `tbd_reservaciones`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tbd_reservaciones` (
  `id` int NOT NULL AUTO_INCREMENT,
  `usuario_id` int DEFAULT NULL COMMENT 'ID del usuario (inquilino) que realiza la reservación.',
  `fecha_ingreso` date DEFAULT NULL COMMENT 'Fecha pactada para el inicio del contrato o ingreso.',
  `tipo` enum('individual','compartida','estudiante','profesor','corporativo') DEFAULT NULL COMMENT 'Tipo de reservación o contrato.',
  `piso` int DEFAULT NULL COMMENT 'Número de piso de la habitación asignada.',
  `habitacion` int DEFAULT NULL COMMENT 'Número de habitación o unidad asignada.',
  `monto` decimal(10,2) DEFAULT NULL COMMENT 'Monto total pactado para el contrato.',
  `estado` enum('solicitud','confirmada','activa','terminada','cancelada','rechazada') DEFAULT NULL COMMENT 'Estado actual de la reservación.',
  `motivo_rechazo` varchar(255) DEFAULT NULL COMMENT 'Detalles adicionales o razón en caso de rechazo.',
  `creado_en` timestamp NULL DEFAULT NULL COMMENT 'Fecha y hora en que se creó el registro.',
  PRIMARY KEY (`id`),
  KEY `tbd_reservaciones_ibfk_1` (`usuario_id`),
  CONSTRAINT `tbd_reservaciones_ibfk_1` FOREIGN KEY (`usuario_id`) REFERENCES `tbd_usuarios` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `tbd_usuarios`
--

DROP TABLE IF EXISTS `tbd_usuarios`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tbd_usuarios` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(100) DEFAULT NULL COMMENT 'Nombre completo del usuario o inquilino.',
  `email` varchar(100) DEFAULT NULL COMMENT 'Dirección de correo electrónico (se usa para login).',
  `password` varchar(255) DEFAULT NULL COMMENT 'Contraseña del usuario (almacenada como un hash seguro).',
  `rol` enum('user','admin') DEFAULT 'user',
  `confirmado` tinyint(1) DEFAULT '0',
  `token` varchar(255) DEFAULT NULL,
  `creado_en` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `tbi_habitaciones`
--

DROP TABLE IF EXISTS `tbi_habitaciones`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tbi_habitaciones` (
  `id` int NOT NULL AUTO_INCREMENT,
  `piso` varchar(50) DEFAULT NULL COMMENT 'Nivel o piso donde se ubica.',
  `habitacion` varchar(50) DEFAULT NULL COMMENT 'Identificador/número de habitación.',
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_room` (`piso`,`habitacion`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping events for database 'sicpes'
--

--
-- Dumping routines for database 'sicpes'
--
/*!50003 DROP PROCEDURE IF EXISTS `sp_generar_sicpes_datos` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_generar_sicpes_datos`(IN num_registros INT)
BEGIN
    DECLARE i INT DEFAULT 1;
    DECLARE v_uid INT;
    DECLARE v_rid INT;
    DECLARE v_nombre VARCHAR(50);
    DECLARE v_apellido VARCHAR(50);

    SET FOREIGN_KEY_CHECKS = 0;
    SET SQL_SAFE_UPDATES = 0;

    WHILE i <= num_registros DO
        SET v_nombre = ELT(FLOOR(1 + RAND() * 5), 'Ana', 'Luis', 'Sofia', 'Diego', 'Carla');
        SET v_apellido = ELT(FLOOR(1 + RAND() * 5), 'Gomez', 'Lopez', 'Perez', 'Diaz', 'Ruiz');

        -- 1. Insertar Usuario con los nuevos parámetros
        -- Rol: 'user', Password: '12345678'
        INSERT INTO tbd_usuarios (nombre, email, password, rol, confirmado)
        VALUES (CONCAT(v_nombre, ' ', v_apellido), CONCAT(LOWER(v_nombre), i, FLOOR(RAND()*1000), '@ejemplo.com'), '12345678', 'user', 1);
        
        SET v_uid = LAST_INSERT_ID();

        -- 2. Insertar Reservación
        INSERT INTO tbd_reservaciones (usuario_id, fecha_ingreso, tipo, piso, habitacion, monto, estado)
        VALUES (v_uid, CURRENT_DATE, 'individual', 1, 101, 1500.00, 'aceptada');
        
        SET v_rid = LAST_INSERT_ID();

        -- 3. Insertar Pago
        INSERT INTO tbd_pagos (reservacion_id, mes, anio, monto_pagado, monto_calculado, fecha_pago, metodo_pago, estado, tipo_pago)
        VALUES (v_rid, MONTH(CURRENT_DATE), YEAR(CURRENT_DATE), 1500.00, 1500.00, NOW(), 'transferencia', 'Pendiente,Pagado,Atrasado', 'mensual');

        -- 4. Insertar Cuota
        INSERT INTO tbd_cuotas (reservacion_id, mes, anio, tipo_pago, monto_calculado, monto_real, estado, fecha_vencimiento)
        VALUES (v_rid, MONTH(CURRENT_DATE), YEAR(CURRENT_DATE), 'mensual', 200.00, 200.00, 'generada', DATE_ADD(NOW(), INTERVAL 5 DAY));

        SET i = i + 1;
    END WHILE;

    SET FOREIGN_KEY_CHECKS = 1;
    SET SQL_SAFE_UPDATES = 1;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `sp_limpiar_tablas` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_limpiar_tablas`()
BEGIN
    -- Desactivar restricciones de claves foráneas
    SET FOREIGN_KEY_CHECKS = 0;

    -- Limpiar tablas
    TRUNCATE TABLE tbd_pagos;
    TRUNCATE TABLE tbd_reservaciones;
    TRUNCATE TABLE tbd_cuotas;

    -- Reactivar restricciones
    SET FOREIGN_KEY_CHECKS = 1;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `sp_limpiar_usuarios` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_limpiar_usuarios`()
BEGIN
    TRUNCATE TABLE tbd_usuarios;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
SET @@SESSION.SQL_LOG_BIN = @MYSQLDUMP_TEMP_LOG_BIN;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-04-20 17:54:19
