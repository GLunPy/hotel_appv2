/*
SQLyog Community v12.3.0 (32 bit)
MySQL - 5.6.16 : Database - hoteldb
*********************************************************************
*/


/*!40101 SET NAMES utf8 */;

/*!40101 SET SQL_MODE=''*/;

/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;
CREATE DATABASE /*!32312 IF NOT EXISTS*/`hoteldb` /*!40100 DEFAULT CHARACTER SET latin1 */;

USE `hoteldb`;

/*Table structure for table `checkin` */

DROP TABLE IF EXISTS `checkin`;

CREATE TABLE `checkin` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `client_id` int(11) NOT NULL,
  `room_id` int(11) NOT NULL,
  `checkin_time` date DEFAULT NULL,
  `duration` int(11) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8;

/*Data for the table `checkin` */

insert  into `checkin`(`id`,`client_id`,`room_id`,`checkin_time`,`duration`) values 

(11,3,1,'2017-02-06',11);

/*Table structure for table `client` */

DROP TABLE IF EXISTS `client`;

CREATE TABLE `client` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `first_name` varchar(255) DEFAULT NULL,
  `last_name` varchar(255) DEFAULT NULL,
  `country` varchar(255) DEFAULT NULL,
  `birthday` date DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8;

/*Data for the table `client` */

insert  into `client`(`id`,`first_name`,`last_name`,`country`,`birthday`) values 

(3,'Jin','Zheming','AR','2018-01-28'),

(4,'Chai','Dung','BR','2018-02-23');

/*Table structure for table `room` */

DROP TABLE IF EXISTS `room`;

CREATE TABLE `room` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `room_name` varchar(255) NOT NULL,
  `category` varchar(255) NOT NULL,
  `num_beds` int(11) NOT NULL DEFAULT '1',
  `description` text,
  `price` float NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=18 DEFAULT CHARSET=utf8;

/*Data for the table `room` */

insert  into `room`(`id`,`room_name`,`category`,`num_beds`,`description`,`price`) values 

(1,'Room 201','Double',2,'Very awesome!!!\n\"Fantastic\"',500),

(12,'Room 100','Signle',1,'Room for only single person.',70),

(14,'Room 300','Triple',4,'For a family.',600);

/*Table structure for table `user` */

DROP TABLE IF EXISTS `user`;

CREATE TABLE `user` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `username` varchar(50) NOT NULL,
  `password` varchar(255) NOT NULL,
  `email` varchar(255) DEFAULT NULL,
  `isAdmin` tinyint(1) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=23 DEFAULT CHARSET=utf8;

/*Data for the table `user` */

insert  into `user`(`id`,`username`,`password`,`email`,`isAdmin`) values 

(11,'admin','21232f297a57a5a743894a0e4a801fc3','chai@gamil.com',1),

(15,'Tang','0be5a6c82893ecaa8bb29bd36831e457','tang@gamil.com',0);

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;
