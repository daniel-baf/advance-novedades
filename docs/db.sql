-- MySQL Workbench Forward Engineerin-- MySQL Workbench Forward Engineering

SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION';

-- -----------------------------------------------------
-- Schema novedades
-- -----------------------------------------------------
DROP SCHEMA IF EXISTS `novedades` ;

-- -----------------------------------------------------
-- Schema novedades
-- -----------------------------------------------------
CREATE SCHEMA IF NOT EXISTS `novedades` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci ;
-- -----------------------------------------------------
-- Schema novedades
-- -----------------------------------------------------
DROP SCHEMA IF EXISTS `novedades` ;

-- -----------------------------------------------------
-- Schema novedades
-- -----------------------------------------------------
CREATE SCHEMA IF NOT EXISTS `novedades` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci ;
USE `novedades` ;

-- -----------------------------------------------------
-- Table `Worker_Area`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `Worker_Area` ;

CREATE TABLE IF NOT EXISTS `Worker_Area` (
  `id` VARCHAR(15) NOT NULL,
  PRIMARY KEY (`id`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `Worker`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `Worker` ;

CREATE TABLE IF NOT EXISTS `Worker` (
  `id` VARCHAR(10) NOT NULL,
  `password` VARCHAR(45) NOT NULL,
  `name` VARCHAR(45) NOT NULL,
  `Worker_Area_id` VARCHAR(15) NOT NULL,
  PRIMARY KEY (`id`),
  INDEX `fk_Worker_Worker_Area1_idx` (`Worker_Area_id` ASC) VISIBLE,
  CONSTRAINT `fk_Worker_Worker_Area1`
    FOREIGN KEY (`Worker_Area_id`)
    REFERENCES `Worker_Area` (`id`)
    ON DELETE NO ACTION
    ON UPDATE CASCADE)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `Building`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `Building` ;

CREATE TABLE IF NOT EXISTS `Building` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(45) NOT NULL UNIQUE,
  `direction` VARCHAR(85) NOT NULL DEFAULT 'city',
  PRIMARY KEY (`id`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `Size`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `Size` ;

CREATE TABLE IF NOT EXISTS `Size` (
  `id` VARCHAR(4) NOT NULL,
  PRIMARY KEY (`id`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `Pledge`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `Pledge` ;

CREATE TABLE IF NOT EXISTS `Pledge` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(45) NOT NULL,
  PRIMARY KEY (`id`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `Order_Status`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `Order_Status` ;

CREATE TABLE IF NOT EXISTS `Order_Status` (
  `id` VARCHAR(20) NOT NULL,
  PRIMARY KEY (`id`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `Order`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `Order` ;

CREATE TABLE IF NOT EXISTS `Order` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `total` DOUBLE(7,2) NOT NULL DEFAULT '1',
  `is_special` TINYINT NOT NULL DEFAULT 0,
  `phone` VARCHAR(10) NOT NULL,
  `name` VARCHAR(45) NULL,
  `date` DATE NOT NULL DEFAULT CURDATE(),
  `Order_Status_id` VARCHAR(20) NOT NULL DEFAULT 'REGISTRADO',
  PRIMARY KEY (`id`),
  INDEX `fk_Orders_Order_Status1_idx` (`Order_Status_id` ASC) VISIBLE,
  CONSTRAINT `fk_Orders_Order_Status1`
    FOREIGN KEY (`Order_Status_id`)
    REFERENCES `Order_Status` (`id`)
    ON DELETE NO ACTION
    ON UPDATE CASCADE)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `Bill`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `Bill` ;

CREATE TABLE IF NOT EXISTS `Bill` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(45) NULL,
  `NIT` VARCHAR(15) NOT NULL DEFAULT 'CF',
  `total` DOUBLE(9,2) NOT NULL DEFAULT 1,
  `date` DATE NOT NULL DEFAULT NOW(),
  `Order_id` INT NULL,
  `Worker_id` VARCHAR(10) NOT NULL,
  PRIMARY KEY (`id`),
  INDEX `fk_Bill_Order1_idx` (`Order_id` ASC) VISIBLE,
  INDEX `fk_Bill_Worker1_idx` (`Worker_id` ASC) VISIBLE,
  CONSTRAINT `fk_Bill_Order1`
    FOREIGN KEY (`Order_id`)
    REFERENCES `Order` (`id`)
    ON DELETE NO ACTION
    ON UPDATE CASCADE,
  CONSTRAINT `fk_Bill_Worker1`
    FOREIGN KEY (`Worker_id`)
    REFERENCES `Worker` (`id`)
    ON DELETE NO ACTION
    ON UPDATE CASCADE)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `Inventory`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `Inventory` ;

CREATE TABLE IF NOT EXISTS `Inventory` (
  `Pledge_id` INT NOT NULL,
  `Size_id` VARCHAR(4) NOT NULL,
  `price` DOUBLE(7,2) NOT NULL DEFAULT 1,
  PRIMARY KEY (`Pledge_id`, `Size_id`),
  INDEX `fk_Pledge_has_Size_Size1_idx` (`Size_id` ASC) VISIBLE,
  INDEX `fk_Pledge_has_Size_Pledge1_idx` (`Pledge_id` ASC) VISIBLE,
  CONSTRAINT `fk_Pledge_has_Size_Pledge1`
    FOREIGN KEY (`Pledge_id`)
    REFERENCES `Pledge` (`id`)
    ON DELETE NO ACTION
    ON UPDATE CASCADE,
  CONSTRAINT `fk_Pledge_has_Size_Size1`
    FOREIGN KEY (`Size_id`)
    REFERENCES `Size` (`id`)
    ON DELETE NO ACTION
    ON UPDATE CASCADE)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `Stock`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `Stock` ;

CREATE TABLE IF NOT EXISTS `Stock` (
  `Building_id` INT NOT NULL,
  `Inventory_Pledge_id` INT NOT NULL,
  `Inventory_Size_id` VARCHAR(4) NOT NULL,
  `stock` INT NOT NULL DEFAULT 0,
  PRIMARY KEY (`Building_id`, `Inventory_Pledge_id`, `Inventory_Size_id`),
  INDEX `fk_Building_has_Inventory_Inventory1_idx` (`Inventory_Pledge_id` ASC, `Inventory_Size_id` ASC) VISIBLE,
  INDEX `fk_Building_has_Inventory_Building1_idx` (`Building_id` ASC) VISIBLE,
  CONSTRAINT `fk_Building_has_Inventory_Building1`
    FOREIGN KEY (`Building_id`)
    REFERENCES `Building` (`id`)
    ON DELETE NO ACTION
    ON UPDATE CASCADE,
  CONSTRAINT `fk_Building_has_Inventory_Inventory1`
    FOREIGN KEY (`Inventory_Pledge_id` , `Inventory_Size_id`)
    REFERENCES `Inventory` (`Pledge_id` , `Size_id`)
    ON DELETE NO ACTION
    ON UPDATE CASCADE)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `Extra`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `Extra` ;

CREATE TABLE IF NOT EXISTS `Extra` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `detail` VARCHAR(100) NOT NULL,
  `price` DOUBLE(7,2) NOT NULL,
  PRIMARY KEY (`id`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `Bill_Detail`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `Bill_Detail` ;

CREATE TABLE IF NOT EXISTS `Bill_Detail` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `unitary_price` DOUBLE(7,2) NOT NULL,
  `cuantity` TINYINT(2) NOT NULL DEFAULT 1,
  `Bill_id` INT NOT NULL,
  `Inventory_Pledge_id` INT NOT NULL,
  `Inventory_Size_id` VARCHAR(4) NOT NULL,
  `Extra_id` INT NULL,
  PRIMARY KEY (`id`),
  INDEX `fk_Bill_has_Inventory_Inventory1_idx` (`Inventory_Pledge_id` ASC, `Inventory_Size_id` ASC) VISIBLE,
  INDEX `fk_Bill_has_Inventory_Bill1_idx` (`Bill_id` ASC) VISIBLE,
  UNIQUE INDEX `Bill_id_UNIQUE` (`Bill_id` ASC) VISIBLE,
  UNIQUE INDEX `Inventory_Pledge_id_UNIQUE` (`Inventory_Pledge_id` ASC) VISIBLE,
  UNIQUE INDEX `Inventory_Size_id_UNIQUE` (`Inventory_Size_id` ASC) VISIBLE,
  INDEX `fk_Bill_Detail_Extra1_idx` (`Extra_id` ASC) VISIBLE,
  CONSTRAINT `fk_Bill_has_Inventory_Bill1`
    FOREIGN KEY (`Bill_id`)
    REFERENCES `Bill` (`id`)
    ON DELETE NO ACTION
    ON UPDATE CASCADE,
  CONSTRAINT `fk_Bill_has_Inventory_Inventory1`
    FOREIGN KEY (`Inventory_Pledge_id` , `Inventory_Size_id`)
    REFERENCES `Inventory` (`Pledge_id` , `Size_id`)
    ON DELETE NO ACTION
    ON UPDATE CASCADE,
  CONSTRAINT `fk_Bill_Detail_Extra1`
    FOREIGN KEY (`Extra_id`)
    REFERENCES `Extra` (`id`)
    ON DELETE NO ACTION
    ON UPDATE CASCADE)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `Order_Detail`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `Order_Detail` ;

CREATE TABLE IF NOT EXISTS `Order_Detail` (
  `Order_id` INT NOT NULL,
  `Inventory_Pledge_id` INT NOT NULL,
  `Inventory_Size_id` VARCHAR(4) NOT NULL,
  `cuantity` TINYINT NOT NULL DEFAULT 1,
  `anotation` VARCHAR(100) NULL,
  `Order_Status_id` VARCHAR(20) NOT NULL,
  PRIMARY KEY (`Order_id`, `Inventory_Pledge_id`, `Inventory_Size_id`),
  INDEX `fk_Order_has_Inventory_Inventory1_idx` (`Inventory_Pledge_id` ASC, `Inventory_Size_id` ASC) VISIBLE,
  INDEX `fk_Order_has_Inventory_Order1_idx` (`Order_id` ASC) VISIBLE,
  INDEX `fk_Order_Detail_Order_Status1_idx` (`Order_Status_id` ASC) VISIBLE,
  CONSTRAINT `fk_Order_has_Inventory_Order1`
    FOREIGN KEY (`Order_id`)
    REFERENCES `Order` (`id`)
    ON DELETE NO ACTION
    ON UPDATE CASCADE,
  CONSTRAINT `fk_Order_has_Inventory_Inventory1`
    FOREIGN KEY (`Inventory_Pledge_id` , `Inventory_Size_id`)
    REFERENCES `Inventory` (`Pledge_id` , `Size_id`)
    ON DELETE NO ACTION
    ON UPDATE CASCADE,
  CONSTRAINT `fk_Order_Detail_Order_Status1`
    FOREIGN KEY (`Order_Status_id`)
    REFERENCES `Order_Status` (`id`)
    ON DELETE NO ACTION
    ON UPDATE CASCADE)
ENGINE = InnoDB;

USE `novedades` ;

SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;


-- PROCEDURE
DELIMITER //

CREATE PROCEDURE insertWorkerAndGetId(IN p_password VARCHAR(45),IN p_name VARCHAR(45),IN p_Worker_Area_id VARCHAR(15),OUT p_generated_id VARCHAR(10))
BEGIN
    DECLARE prefix VARCHAR(5);
    
    -- Determine the prefix based on Worker_Area_id
    IF p_Worker_Area_id = 'ADMIN' THEN
        SET prefix = 'ADM';
    ELSEIF p_Worker_Area_id = 'PRODUCTION' THEN
        SET prefix = 'PRD';
    ELSEIF p_Worker_Area_id = 'SELLS' THEN
        SET prefix = 'SLLS';
    ELSE
        -- Set a default prefix if necessary
        SET prefix = 'UNKNOWN';
    END IF;

    -- Generate the new ID
    SET p_generated_id = (SELECT CONCAT(prefix, COALESCE(MAX(CAST(SUBSTRING(id, LENGTH(prefix) + 1) AS SIGNED)), 0) + 1)
                         FROM Worker
                         WHERE Worker_Area_id = p_Worker_Area_id);
    -- Perform the INSERT operation
    INSERT INTO Worker (password, name, Worker_Area_id, id) VALUES (p_password, p_name, p_Worker_Area_id, p_generated_id);
END;
//
DELIMITER ;



-- WORKERS: default password 'a'
INSERT INTO `Worker_Area` VALUES ('ADMIN'), ('SELLS'), ('PRODUCTION');
CALL insertWorkerAndGetId('0GGOy6X/t2XHqNKgYdfsWw==', 'testing admin', 'ADMIN', @generated_id);
CALL insertWorkerAndGetId('0GGOy6X/t2XHqNKgYdfsWw==', 'testing production', 'PRODUCTION', @generated_id);
CALL insertWorkerAndGetId('0GGOy6X/t2XHqNKgYdfsWw==', 'testing sells', 'SELLS', @generated_id);
-- CLOTHES 
INSERT INTO `Size` (`id`) VALUES ('6'),('8'),('10'),('12'),('14'),('16'),('XS'),('S'),('M'),('L'),('XL'),('XXL');
INSERT INTO `Pledge` (`name`) VALUES ('CHUMPA DE DIARIO ADVANCE'),('CAMISA POLO ADVANCE'), ('PLAYERA FISICA ADVANCE'), ('PANTS FISICA ADVANCE');
-- CHUMPA DE DIARIO ADVANCE
INSERT INTO `Inventory` (`Pledge_id`, `Size_id`, `price`) VALUES (1, '6', 160), (1, '8', 160), (1, '10', 180), (1, '12', 180),
	(1, '14', 200), (1, '16', 200), (1, 'XS', 220), (1, 'S', 220), (1, 'M', 240), (1, 'L', 240), (1, 'XL', 260), (1, 'XXL', 260);
-- CAMISA POLO ADVANCE
INSERT INTO `Inventory` (`Pledge_id`, `Size_id`, `price`) VALUES (2, '6', 80), (2, '8', 80), (2, '10', 100), (2, '12', 100),
	(2, '14', 120),(2, '16', 120), (2, 'XS', 140), (2, 'S', 140), (2, 'M', 160), (2, 'L', 160), (2, 'XL', 180),(2, 'XXL', 180);
-- PLAYERA FISICA ADVANCE
INSERT INTO `Inventory` (`Pledge_id`, `Size_id`, `price`) VALUES (3, '6', 60), (3, '8', 60), (3, '10', 80), (3, '12', 80), (3, '14', 100),
	(3, '16', 100), (3, 'XS', 120), (3, 'S', 120), (3, 'M', 140), (3, 'L', 140), (3, 'XL', 160), (3, 'XXL', 160);
-- PANTS FISICA ADVANCE
INSERT INTO `Inventory` (`Pledge_id`, `Size_id`, `price`) VALUES (4, '6', 300), (4, '8', 300), (4, '10', 320), (4, '12', 320),
	(4, '14', 340), (4, '16', 340), (4, 'XS', 360), (4, 'S', 360), (4, 'M', 380), (4, 'L', 380), (4, 'XL', 400), (4, 'XXL', 400);
-- BUILDINGS
INSERT INTO `novedades`.`Building` (`name`, `direction`) VALUES ('Novedades Mercado San Pedro', '5a Calle 10-64 Zona 1 SP SM');
INSERT INTO `novedades`.`Building` (`name`) VALUES ('Almacen Cruz Blanca');
-- AVAILABILITY
-- Stock for Novedades Mercado San Pedro (Building_id = 1)
INSERT INTO `Stock` (`Building_id`, `Inventory_Pledge_id`, `Inventory_Size_id`, `stock`) VALUES
  -- Set stock for CHUMPA DE DIARIO ADVANCE
  (1, 1, '6', FLOOR(RAND() * 21)), (1, 1, '8', FLOOR(RAND() * 21)), (1, 1, '10', FLOOR(RAND() * 21)), (1, 1, '12', FLOOR(RAND() * 21)), (1, 1, '14', FLOOR(RAND() * 21)), 
  (1, 1, '16', FLOOR(RAND() * 21)), (1, 1, 'XS', FLOOR(RAND() * 21)), (1, 1, 'S', FLOOR(RAND() * 21)), (1, 1, 'M', FLOOR(RAND() * 21)), (1, 1, 'L', FLOOR(RAND() * 21)), 
  (1, 1, 'XL', FLOOR(RAND() * 21)),(1, 1, 'XXL', FLOOR(RAND() * 21)),
  -- Set stock for CAMISA POLO ADVANCE
  (1, 2, '6', FLOOR(RAND() * 21)), (1, 2, '8', FLOOR(RAND() * 21)), (1, 2, '10', FLOOR(RAND() * 21)), (1, 2, '12', FLOOR(RAND() * 21)), (1, 2, '14', FLOOR(RAND() * 21)), (1, 2, '16', FLOOR(RAND() * 21)), (1, 2, 'XS', FLOOR(RAND() * 21)), (1, 2, 'S', FLOOR(RAND() * 21)),
  (1, 2, 'M', FLOOR(RAND() * 21)), (1, 2, 'L', FLOOR(RAND() * 21)), (1, 2, 'XL', FLOOR(RAND() * 21)), (1, 2, 'XXL', FLOOR(RAND() * 21)), 
  -- Set stock for PLAYERA FISICA ADVANCE
  (1, 3, '6', FLOOR(RAND() * 21)), (1, 3, '8', FLOOR(RAND() * 21)), (1, 3, '10', FLOOR(RAND() * 21)), (1, 3, '12', FLOOR(RAND() * 21)), (1, 3, '14', FLOOR(RAND() * 21)), (1, 3, '16', FLOOR(RAND() * 21)), (1, 3, 'XS', FLOOR(RAND() * 21)),
  (1, 3, 'S', FLOOR(RAND() * 21)), (1, 3, 'M', FLOOR(RAND() * 21)), (1, 3, 'L', FLOOR(RAND() * 21)), (1, 3, 'XL', FLOOR(RAND() * 21)), (1, 3, 'XXL', FLOOR(RAND() * 21)),
  -- Set stock for PANTS FISICA ADVANCE
  (1, 4, '6', FLOOR(RAND() * 21)), (1, 4, '8', FLOOR(RAND() * 21)), (1, 4, '10', FLOOR(RAND() * 21)), (1, 4, '12', FLOOR(RAND() * 21)), (1, 4, '14', FLOOR(RAND() * 21)), (1, 4, '16', FLOOR(RAND() * 21)), (1, 4, 'XS', FLOOR(RAND() * 21)),
  (1, 4, 'S', FLOOR(RAND() * 21)), (1, 4, 'M', FLOOR(RAND() * 21)), (1, 4, 'L', FLOOR(RAND() * 21)), (1, 4, 'XL', FLOOR(RAND() * 21)), (1, 4, 'XXL', FLOOR(RAND() * 21));

-- Stock for Almacen Cruz Blanca (Building_id = 2)
INSERT INTO `Stock` (`Building_id`, `Inventory_Pledge_id`, `Inventory_Size_id`, `stock`) VALUES
  -- Set stock for CHUMPA DE DIARIO ADVANCE
  (2, 1, '6', FLOOR(RAND() * 21)), (2, 1, '8', FLOOR(RAND() * 21)), (2, 1, '10', FLOOR(RAND() * 21)), (2, 1, '12', FLOOR(RAND() * 21)), (2, 1, '14', FLOOR(RAND() * 21)), (2, 1, '16', FLOOR(RAND() * 21)),
  (2, 1, 'XS', FLOOR(RAND() * 21)), (2, 1, 'S', FLOOR(RAND() * 21)), (2, 1, 'M', FLOOR(RAND() * 21)), (2, 1, 'L', FLOOR(RAND() * 21)), (2, 1, 'XL', FLOOR(RAND() * 21)), (2, 1, 'XXL', FLOOR(RAND() * 21)),
  -- Set stock for CAMISA POLO ADVANCE
  (2, 2, '6', FLOOR(RAND() * 21)), (2, 2, '8', FLOOR(RAND() * 21)), (2, 2, '10', FLOOR(RAND() * 21)), (2, 2, '12', FLOOR(RAND() * 21)), (2, 2, '14', FLOOR(RAND() * 21)), (2, 2, '16', FLOOR(RAND() * 21)),
  (2, 2, 'XS', FLOOR(RAND() * 21)), (2, 2, 'S', FLOOR(RAND() * 21)), (2, 2, 'M', FLOOR(RAND() * 21)), (2, 2, 'L', FLOOR(RAND() * 21)), (2, 2, 'XL', FLOOR(RAND() * 21)), (2, 2, 'XXL', FLOOR(RAND() * 21)),
  -- Set stock for PLAYERA FISICA ADVANCE
  (2, 3, '6', FLOOR(RAND() * 21)), (2, 3, '8', FLOOR(RAND() * 21)), (2, 3, '10', FLOOR(RAND() * 21)), (2, 3, '12', FLOOR(RAND() * 21)), (2, 3, '14', FLOOR(RAND() * 21)), (2, 3, '16', FLOOR(RAND() * 21)), (2, 3, 'XS', FLOOR(RAND() * 21)),
  (2, 3, 'S', FLOOR(RAND() * 21)), (2, 3, 'M', FLOOR(RAND() * 21)),  (2, 3, 'L', FLOOR(RAND() * 21)), (2, 3, 'XL', FLOOR(RAND() * 21)), (2, 3, 'XXL', FLOOR(RAND() * 21)),  
  -- Set stock for PANTS FISICA ADVANCE
  (2, 4, '6', FLOOR(RAND() * 21)), (2, 4, '8', FLOOR(RAND() * 21)), (2, 4, '10', FLOOR(RAND() * 21)), (2, 4, '12', FLOOR(RAND() * 21)), (2, 4, '14', FLOOR(RAND() * 21)), (2, 4, '16', FLOOR(RAND() * 21)), (2, 4, 'XS', FLOOR(RAND() * 21)),
  (2, 4, 'S', FLOOR(RAND() * 21)), (2, 4, 'M', FLOOR(RAND() * 21)), (2, 4, 'L', FLOOR(RAND() * 21)), (2, 4, 'XL', FLOOR(RAND() * 21)), (2, 4, 'XXL', FLOOR(RAND() * 21));

-- ORDERS
INSERT INTO `Order_Status` (`id`) VALUES ('ENLISTED'), ('WAREHOUSE'),('DELIVERED'),('PARTIALLY DELIVERED'),('CANCELED');
-- ORDER FOR 3 CAMISA POLO ADVANCE 8 (240) + EMBROIDERY ON EXTRAS (20) 
INSERT INTO `Order` (`total`, `is_special`, `phone`, `name`, `Order_Status_id`, `date`) VALUES (260, TRUE, CONCAT('', FLOOR(10000000 + RAND() * (99999999 - 10000000 + 1))), 'Chismosin', 'DELIVERED', CURDATE() - INTERVAL 1 WEEK);
INSERT INTO `Order_Detail` (`Order_id`, `Inventory_Pledge_id`, `Inventory_Size_id`, `cuantity`, `Order_Status_id`, `anotation`) VALUES ('1', '2', '8', '3', 'DELIVERED', 'Bordar el nombre Fino Filipino');



-- BILLS / RECEIPES
-- 1 CHUMPA DE DIARIO ADVANCE 10 (180) + 2 CAMISA POLO ADVANCE 12 (100)
INSERT INTO `Bill` (`total`, `date`, `Worker_id`) VALUES (380.00, CURDATE(), 'SLLS1');
-- 1 PANTS FISICA ADVANCE XL (400) 
INSERT INTO `Bill` (`name`, `NIT`, `total`, `date`, `Worker_id`) VALUES ('Pochoclo', CONCAT('', FLOOR(10000000 + RAND() * (99999999 - 10000000 + 1))), 400.00, DATE('2022-01-01') + INTERVAL FLOOR(RAND() * (DATEDIFF('2023-12-31', '2022-01-01') + 1)) DAY, 'SLLS1');
-- 1 Order FOR ORDER 1 (300)
INSERT INTO `Bill` (`name`, `NIT`, `total`, `date`, `Worker_id`, `Order_id`) VALUES ('Pochoclo', CONCAT('', FLOOR(10000000 + RAND() * (99999999 - 10000000 + 1))), 260, CURDATE(), 'SLLS1', 1);
-- NOTE: may i switch FK for 1:1 at Extra and Order Detail?
INSERT INTO `Extra` (`detail`, `price`) VALUES ('Bordar el nombre Juanito Perez', '20');
INSERT INTO `novedades`.`Bill_Detail` (`unitary_price`, `cuantity`, `Bill_id`, `Inventory_Pledge_id`, `Inventory_Size_id`, `Extra_id`) VALUES ('80', '3', '3', '2', '8', '1');

-- DROP USER IF EXISTS 'novedades-client'@'%';
-- CREATE USER 'novedades-client'@'%' IDENTIFIED BY 'GehYwLt7Yvn99I4';
-- GRANT ALL PRIVILEGES ON `novedades`.* TO 'novedades-client'@'%';
-- FLUSH PRIVILEGES;