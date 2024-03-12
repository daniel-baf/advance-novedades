-- MySQL Workbench Forward Engineering

SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION';

DROP SCHEMA IF EXISTS `novedades` ;

-- -----------------------------------------------------
-- Schema novedades
-- -----------------------------------------------------
CREATE SCHEMA IF NOT EXISTS `novedades` ;
USE `novedades` ;

-- -----------------------------------------------------
-- Table `Worker_Area`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `Worker_Area` ;

CREATE TABLE IF NOT EXISTS `Worker_Area` (
  `id` VARCHAR(15) NOT NULL,
  `name` VARCHAR(15) NOT NULL,
  PRIMARY KEY (`id`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_unicode_ci;


-- -----------------------------------------------------
-- Table `Worker`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `Worker` ;

CREATE TABLE IF NOT EXISTS `Worker` (
  `id` VARCHAR(10) NOT NULL,
  `password` VARCHAR(45) NOT NULL,
  `name` VARCHAR(45) NOT NULL,
  `allowed` TINYINT(1) NULL DEFAULT 0,
  `Worker_Area_id` VARCHAR(15) NOT NULL,
  PRIMARY KEY (`id`),
  INDEX `fk_Worker_Worker_Area1_idx` (`Worker_Area_id` ASC) VISIBLE,
  CONSTRAINT `fk_Worker_Worker_Area1`
    FOREIGN KEY (`Worker_Area_id`)
    REFERENCES `Worker_Area` (`id`)
    ON DELETE NO ACTION
    ON UPDATE CASCADE)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_unicode_ci;


-- -----------------------------------------------------
-- Table `Expense_Type`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `Expense_Type` ;

CREATE TABLE IF NOT EXISTS `Expense_Type` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(45) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `name_UNIQUE` (`name` ASC) VISIBLE)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `Expense`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `Expense` ;

CREATE TABLE IF NOT EXISTS `Expense` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `ammount` DOUBLE NOT NULL,
  `date` DATE NOT NULL DEFAULT CURRENT_TIMESTAMP(),
  `Worker_id` VARCHAR(10) NOT NULL,
  `Expense_Type_id` INT(11) NOT NULL,
  PRIMARY KEY (`id`),
  INDEX `fk_Expense_Worker_idx` (`Worker_id` ASC) VISIBLE,
  INDEX `fk_Expense_Expense_Type1_idx` (`Expense_Type_id` ASC) VISIBLE,
  CONSTRAINT `fk_Expense_Worker`
    FOREIGN KEY (`Worker_id`)
    REFERENCES `novedades`.`Worker` (`id`)
    ON DELETE NO ACTION
    ON UPDATE CASCADE,
  CONSTRAINT `fk_Expense_Expense_Type1`
    FOREIGN KEY (`Expense_Type_id`)
    REFERENCES `novedades`.`Expense_Type` (`id`)
    ON DELETE NO ACTION
    ON UPDATE CASCADE)
ENGINE = InnoDB;

USE `novedades` ;

-- -----------------------------------------------------
-- Table `Order_Status`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `Order_Status` ;

CREATE TABLE IF NOT EXISTS `Order_Status` (
  `id` VARCHAR(20) NOT NULL,
  PRIMARY KEY (`id`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_unicode_ci;


-- -----------------------------------------------------
-- Table `Order`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `Order` ;

CREATE TABLE IF NOT EXISTS `Order` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `total` DOUBLE(7,2) NOT NULL DEFAULT 1.00,
  `is_special` TINYINT(4) NOT NULL DEFAULT 0,
  `phone` VARCHAR(10) NOT NULL,
  `name` VARCHAR(45) NULL DEFAULT NULL,
  `date` DATE NOT NULL DEFAULT CURRENT_TIMESTAMP(),
  `Order_Status_id` VARCHAR(20) NOT NULL DEFAULT 'REGISTRADO',
  PRIMARY KEY (`id`),
  INDEX `fk_Orders_Order_Status1_idx` (`Order_Status_id` ASC) VISIBLE,
  CONSTRAINT `fk_Orders_Order_Status1`
    FOREIGN KEY (`Order_Status_id`)
    REFERENCES `Order_Status` (`id`)
    ON DELETE NO ACTION
    ON UPDATE CASCADE)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_unicode_ci;


-- -----------------------------------------------------
-- Table `Bill`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `Bill` ;

CREATE TABLE IF NOT EXISTS `Bill` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(45) NULL DEFAULT NULL,
  `NIT` VARCHAR(15) NOT NULL DEFAULT 'CF',
  `total` DOUBLE(9,2) NOT NULL DEFAULT 1.00,
  `date` DATE NOT NULL DEFAULT CURRENT_TIMESTAMP(),
  `Order_id` INT(11) NULL DEFAULT NULL,
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
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_unicode_ci;


-- -----------------------------------------------------
-- Table `Extra`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `Extra` ;

CREATE TABLE IF NOT EXISTS `Extra` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `detail` VARCHAR(100) NOT NULL,
  `price` DOUBLE(7,2) NOT NULL,
  PRIMARY KEY (`id`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_unicode_ci;


-- -----------------------------------------------------
-- Table `Pledge`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `Pledge` ;

CREATE TABLE IF NOT EXISTS `Pledge` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(45) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `name` (`name` ASC) VISIBLE)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_unicode_ci;


-- -----------------------------------------------------
-- Table `Size`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `Size` ;

CREATE TABLE IF NOT EXISTS `Size` (
  `id` VARCHAR(4) NOT NULL,
  PRIMARY KEY (`id`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_unicode_ci;


-- -----------------------------------------------------
-- Table `Inventory`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `Inventory` ;

CREATE TABLE IF NOT EXISTS `Inventory` (
  `Pledge_id` INT(11) NOT NULL,
  `Size_id` VARCHAR(4) NOT NULL,
  `price` DOUBLE(7,2) NOT NULL DEFAULT 1.00,
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
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_unicode_ci;


-- -----------------------------------------------------
-- Table `Bill_Detail`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `Bill_Detail` ;

CREATE TABLE IF NOT EXISTS `Bill_Detail` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `unitary_price` DOUBLE(7,2) NOT NULL,
  `cuantity` TINYINT(2) NOT NULL DEFAULT 1,
  `Bill_id` INT(11) NOT NULL,
  `Inventory_Pledge_id` INT(11) NOT NULL,
  `Inventory_Size_id` VARCHAR(4) NOT NULL,
  `Extra_id` INT(11) NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `Bill_id_UNIQUE` (`Bill_id` ASC) VISIBLE,
  UNIQUE INDEX `Inventory_Pledge_id_UNIQUE` (`Inventory_Pledge_id` ASC) VISIBLE,
  UNIQUE INDEX `Inventory_Size_id_UNIQUE` (`Inventory_Size_id` ASC) VISIBLE,
  INDEX `fk_Bill_has_Inventory_Inventory1_idx` (`Inventory_Pledge_id` ASC, `Inventory_Size_id` ASC) VISIBLE,
  INDEX `fk_Bill_has_Inventory_Bill1_idx` (`Bill_id` ASC) VISIBLE,
  INDEX `fk_Bill_Detail_Extra1_idx` (`Extra_id` ASC) VISIBLE,
  CONSTRAINT `fk_Bill_Detail_Extra1`
    FOREIGN KEY (`Extra_id`)
    REFERENCES `Extra` (`id`)
    ON DELETE NO ACTION
    ON UPDATE CASCADE,
  CONSTRAINT `fk_Bill_has_Inventory_Bill1`
    FOREIGN KEY (`Bill_id`)
    REFERENCES `Bill` (`id`)
    ON DELETE NO ACTION
    ON UPDATE CASCADE,
  CONSTRAINT `fk_Bill_has_Inventory_Inventory1`
    FOREIGN KEY (`Inventory_Pledge_id` , `Inventory_Size_id`)
    REFERENCES `Inventory` (`Pledge_id` , `Size_id`)
    ON DELETE NO ACTION
    ON UPDATE CASCADE)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_unicode_ci;


-- -----------------------------------------------------
-- Table `Building`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `Building` ;

CREATE TABLE IF NOT EXISTS `Building` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(45) NOT NULL,
  `direction` VARCHAR(85) NOT NULL DEFAULT 'city',
  PRIMARY KEY (`id`),
  UNIQUE INDEX `name` (`name` ASC) VISIBLE)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_unicode_ci;


-- -----------------------------------------------------
-- Table `Stock`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `Stock` ;

CREATE TABLE IF NOT EXISTS `Stock` (
  `Building_id` INT(11) NOT NULL,
  `Inventory_Pledge_id` INT(11) NOT NULL,
  `Inventory_Size_id` VARCHAR(4) NOT NULL,
  `stock` INT(11) NOT NULL DEFAULT 0,
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
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_unicode_ci;


-- -----------------------------------------------------
-- Table `Log`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `Log` ;

CREATE TABLE IF NOT EXISTS `Log` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `Worker_id` VARCHAR(10) NOT NULL,
  `Stock_Building_id` INT(11) NOT NULL,
  `Stock_Inventory_Pledge_id` INT(11) NOT NULL,
  `Stock_Inventory_Size_id` VARCHAR(4) NOT NULL,
  `description` VARCHAR(45) NOT NULL,
  PRIMARY KEY (`id`),
  INDEX `fk_Worker_has_Stock_Stock1_idx` (`Stock_Building_id` ASC, `Stock_Inventory_Pledge_id` ASC, `Stock_Inventory_Size_id` ASC) VISIBLE,
  INDEX `fk_Worker_has_Stock_Worker1_idx` (`Worker_id` ASC) VISIBLE,
  CONSTRAINT `fk_Worker_has_Stock_Stock1`
    FOREIGN KEY (`Stock_Building_id` , `Stock_Inventory_Pledge_id` , `Stock_Inventory_Size_id`)
    REFERENCES `Stock` (`Building_id` , `Inventory_Pledge_id` , `Inventory_Size_id`)
    ON DELETE NO ACTION
    ON UPDATE CASCADE,
  CONSTRAINT `fk_Worker_has_Stock_Worker1`
    FOREIGN KEY (`Worker_id`)
    REFERENCES `Worker` (`id`)
    ON DELETE NO ACTION
    ON UPDATE CASCADE)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_unicode_ci;


-- -----------------------------------------------------
-- Table `Order_Detail`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `Order_Detail` ;

CREATE TABLE IF NOT EXISTS `Order_Detail` (
  `Order_id` INT(11) NOT NULL,
  `Inventory_Pledge_id` INT(11) NOT NULL,
  `Inventory_Size_id` VARCHAR(4) NOT NULL,
  `cuantity` TINYINT(4) NOT NULL DEFAULT 1,
  `anotation` VARCHAR(100) NULL DEFAULT NULL,
  `Order_Status_id` VARCHAR(20) NOT NULL,
  PRIMARY KEY (`Order_id`, `Inventory_Pledge_id`, `Inventory_Size_id`),
  INDEX `fk_Order_has_Inventory_Inventory1_idx` (`Inventory_Pledge_id` ASC, `Inventory_Size_id` ASC) VISIBLE,
  INDEX `fk_Order_has_Inventory_Order1_idx` (`Order_id` ASC) VISIBLE,
  INDEX `fk_Order_Detail_Order_Status1_idx` (`Order_Status_id` ASC) VISIBLE,
  CONSTRAINT `fk_Order_Detail_Order_Status1`
    FOREIGN KEY (`Order_Status_id`)
    REFERENCES `Order_Status` (`id`)
    ON DELETE NO ACTION
    ON UPDATE CASCADE,
  CONSTRAINT `fk_Order_has_Inventory_Inventory1`
    FOREIGN KEY (`Inventory_Pledge_id` , `Inventory_Size_id`)
    REFERENCES `Inventory` (`Pledge_id` , `Size_id`)
    ON DELETE NO ACTION
    ON UPDATE CASCADE,
  CONSTRAINT `fk_Order_has_Inventory_Order1`
    FOREIGN KEY (`Order_id`)
    REFERENCES `Order` (`id`)
    ON DELETE NO ACTION
    ON UPDATE CASCADE)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_unicode_ci;

DROP TRIGGER IF EXISTS `novedades`.`Expense_Type_BEFORE_INSERT`;

DELIMITER $$
USE `novedades`$$
CREATE DEFINER = CURRENT_USER TRIGGER `novedades`.`Expense_Type_BEFORE_INSERT` BEFORE INSERT ON `Expense_Type` FOR EACH ROW
BEGIN
	SET NEW.name = UPPER(NEW.name);
END$$
DELIMITER ;


-- -----------------------------------------------------
-- procedure insertWorkerAndGetId
-- -----------------------------------------------------

USE `novedades`;
DROP procedure IF EXISTS `insertWorkerAndGetId`;

DELIMITER $$
USE `novedades`$$
CREATE DEFINER=`root`@`localhost` PROCEDURE `insertWorkerAndGetId`(IN p_password VARCHAR(45),IN p_name VARCHAR(45),IN p_Worker_Area_id VARCHAR(15), IN p_Worker_allowed INT,OUT p_generated_id VARCHAR(10))
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
    INSERT INTO Worker (password, name, Worker_Area_id, id, allowed) VALUES (p_password, p_name, p_Worker_Area_id, p_generated_id, p_Worker_allowed);
END$$

DELIMITER ;

SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;
