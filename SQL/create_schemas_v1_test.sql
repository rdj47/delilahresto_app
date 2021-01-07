/*+++ Delilah Restó Schema +++ */
CREATE SCHEMA `delilahresto2`;

/*+++ User Tables +++ */
CREATE TABLE `delilahresto2`.`users` (
  `USER_ID` INT NOT NULL AUTO_INCREMENT,
  `USERNAME` VARCHAR(45) NOT NULL,
  `FULLNAME` VARCHAR(100) NOT NULL,
  `EMAIL` VARCHAR(100) NOT NULL,
  `PHONE` VARCHAR(45) NOT NULL,
  `ADDRESS` VARCHAR(100) NOT NULL,
  `PASSWORD` VARCHAR(256) NOT NULL,
  `ROLE` VARCHAR(45) NOT NULL,
  `CREATED AT` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  `UPDATED_AT` TIMESTAMP NULL ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`USER_ID`),
  UNIQUE INDEX `USERNAME_UNIQUE` (`USERNAME` ASC) VISIBLE);

/*+++ Item Tables +++ */
CREATE TABLE `delilahresto2`.`items` (
  `ITEM_ID` INT NOT NULL AUTO_INCREMENT,
  `NAME` VARCHAR(100) NOT NULL,
  `SHORT_DESC` VARCHAR(100) NOT NULL,
  `PHOTO_URL` VARCHAR(256) NOT NULL,
  `PRICE` FLOAT NOT NULL,
  `STATUS` VARCHAR(100) NULL DEFAULT 'ACTIVE',
  `CREATED_BY` VARCHAR(100) NOT NULL,
  `CREATED_AT` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  `UPDATED_BY` VARCHAR(100) NULL,
  `UPDATED_AT` TIMESTAMP NULL ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`ITEM_ID`));

/*+++ Favorites Tables +++ */
CREATE TABLE `delilahresto2`.`favorites` (
  `USERNAME` VARCHAR(45) NOT NULL,
  `ITEM_ID` INT NOT NULL,
  `CREATED_AT` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP);

ALTER TABLE `delilahresto2`.`favorites` 
ADD INDEX `USER_idx` (`USERNAME` ASC) VISIBLE;

ALTER TABLE `delilahresto2`.`favorites` 
ADD CONSTRAINT `USER`
  FOREIGN KEY (`USERNAME`)
  REFERENCES `delilahresto`.`users` (`USERNAME`)
  ON DELETE NO ACTION
  ON UPDATE NO ACTION;

ALTER TABLE `delilahresto2`.`favorites` 
ADD INDEX `ITEM_idx` (`ITEM_ID` ASC) VISIBLE;

ALTER TABLE `delilahresto2`.`favorites` 
ADD CONSTRAINT `ITEM`
  FOREIGN KEY (`ITEM_ID`)
  REFERENCES `delilahresto`.`items` (`ITEM_ID`)
  ON DELETE NO ACTION
  ON UPDATE NO ACTION;

/*+++ Order Tables +++ */
CREATE TABLE `delilahresto2`.`orders` (
  `ORDER_ID` INT NOT NULL AUTO_INCREMENT,
  `DESCRIPTION` VARCHAR(256) NOT NULL,
  `PAYMENT_METHOD` VARCHAR(45) NOT NULL,
  `TOTAL` DECIMAL NOT NULL,
  `STATE` VARCHAR(45) NOT NULL,
  `CREATED_BY` VARCHAR(45) NOT NULL,
  `CREATED_AT` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  `LAST_STATE_CHANGE_BY` VARCHAR(45) NULL DEFAULT NULL,
  `LAST_STATE_CHANGE_AT` TIMESTAMP NULL ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`ORDER_ID`));

ALTER TABLE `delilahresto2`.`orders` 
ADD INDEX `USER_ORDERS_idx` (`CREATED_BY` ASC) VISIBLE;

ALTER TABLE `delilahresto2`.`orders` 
ADD CONSTRAINT `USER_ORDERS`
  FOREIGN KEY (`CREATED_BY`)
  REFERENCES `delilahresto`.`users` (`USERNAME`)
  ON DELETE NO ACTION
  ON UPDATE NO ACTION;

CREATE TABLE `delilahresto2`.`order_items` (
  `ORDER_ID` INT NOT NULL,
  `ITEM_ID` INT NOT NULL,
  `QUANTITY` INT NOT NULL);

ALTER TABLE `delilahresto2`.`order_items` 
ADD CONSTRAINT `ORDER_ORDER_ITEMS`
  FOREIGN KEY (`ORDER_ID`)
  REFERENCES `delilahresto`.`orders` (`ORDER_ID`)
  ON DELETE NO ACTION
  ON UPDATE NO ACTION,
ADD CONSTRAINT `ITEM_ORDER_ITEMS`
  FOREIGN KEY (`ITEM_ID`)
  REFERENCES `delilahresto`.`items` (`ITEM_ID`)
  ON DELETE NO ACTION
  ON UPDATE NO ACTION;



