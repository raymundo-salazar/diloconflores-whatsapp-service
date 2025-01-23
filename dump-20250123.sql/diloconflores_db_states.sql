CREATE DATABASE  IF NOT EXISTS `diloconflores_db` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `diloconflores_db`;
-- MySQL dump 10.13  Distrib 8.0.40, for macos14 (arm64)
--
-- Host: localhost    Database: diloconflores_db
-- ------------------------------------------------------
-- Server version	9.1.0

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

--
-- Table structure for table `states`
--

DROP TABLE IF EXISTS `states`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `states` (
  `id` int NOT NULL AUTO_INCREMENT,
  `uuid` char(36) NOT NULL,
  `name` varchar(100) NOT NULL,
  `abbreviation` char(10) NOT NULL,
  `country_id` int DEFAULT NULL,
  `active` tinyint(1) DEFAULT '1',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uuid` (`uuid`),
  KEY `states_ibfk_1` (`country_id`),
  CONSTRAINT `states_ibfk_1` FOREIGN KEY (`country_id`) REFERENCES `countries` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=33 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `states`
--

LOCK TABLES `states` WRITE;
/*!40000 ALTER TABLE `states` DISABLE KEYS */;
INSERT INTO `states` VALUES (1,'eca2b9a6-d210-11ef-8fce-a2e38f1fed49','Aguascalientes','AGS',1,1,'2025-01-19 18:36:06','2025-01-21 16:36:04'),(2,'eca2c284-d210-11ef-8fce-a2e38f1fed49','Baja California','BC',1,1,'2025-01-19 18:36:06','2025-01-21 16:36:04'),(3,'eca2c464-d210-11ef-8fce-a2e38f1fed49','Baja California Sur','BCS',NULL,1,'2025-01-19 18:36:06','2025-01-22 21:10:17'),(4,'eca2c4f0-d210-11ef-8fce-a2e38f1fed49','Campeche','CAMP',NULL,1,'2025-01-19 18:36:06','2025-01-22 21:10:17'),(5,'eca2c586-d210-11ef-8fce-a2e38f1fed49','Chiapas','CHIS',NULL,1,'2025-01-19 18:36:06','2025-01-22 21:10:17'),(6,'eca2c658-d210-11ef-8fce-a2e38f1fed49','Chihuahua','CHIH',NULL,1,'2025-01-19 18:36:06','2025-01-22 21:10:17'),(7,'eca2c6da-d210-11ef-8fce-a2e38f1fed49','Coahuila','COAH',NULL,1,'2025-01-19 18:36:06','2025-01-22 21:10:17'),(8,'eca2c752-d210-11ef-8fce-a2e38f1fed49','Colima','COL',NULL,1,'2025-01-19 18:36:06','2025-01-22 21:10:17'),(9,'eca2c7de-d210-11ef-8fce-a2e38f1fed49','Durango','DGO',NULL,1,'2025-01-19 18:36:06','2025-01-21 16:34:47'),(10,'eca2c860-d210-11ef-8fce-a2e38f1fed49','Guanajuato','GTO',NULL,1,'2025-01-19 18:36:06','2025-01-21 16:34:47'),(11,'eca2c8ce-d210-11ef-8fce-a2e38f1fed49','Guerrero','GRO',NULL,1,'2025-01-19 18:36:06','2025-01-21 16:34:47'),(12,'eca2c93c-d210-11ef-8fce-a2e38f1fed49','Hidalgo','HGO',NULL,1,'2025-01-19 18:36:06','2025-01-21 16:34:47'),(13,'eca2c9b4-d210-11ef-8fce-a2e38f1fed49','Jalisco','JAL',NULL,1,'2025-01-19 18:36:06','2025-01-21 16:35:09'),(14,'eca2ca22-d210-11ef-8fce-a2e38f1fed49','Estado de México','EDOMEX',NULL,1,'2025-01-19 18:36:06','2025-01-21 16:35:09'),(15,'eca2ca9a-d210-11ef-8fce-a2e38f1fed49','Michoacán','MICH',NULL,1,'2025-01-19 18:36:06','2025-01-21 16:35:09'),(16,'eca2cb08-d210-11ef-8fce-a2e38f1fed49','Morelos','MOR',NULL,1,'2025-01-19 18:36:06','2025-01-21 16:35:09'),(17,'eca2cb76-d210-11ef-8fce-a2e38f1fed49','Nayarit','NAY',NULL,1,'2025-01-19 18:36:06','2025-01-21 16:35:09'),(18,'eca2cc34-d210-11ef-8fce-a2e38f1fed49','Nuevo León','NL',NULL,1,'2025-01-19 18:36:06','2025-01-22 21:07:20'),(19,'eca2ccac-d210-11ef-8fce-a2e38f1fed49','Oaxaca','OAX',NULL,1,'2025-01-19 18:36:06','2025-01-21 16:35:09'),(20,'eca2cd10-d210-11ef-8fce-a2e38f1fed49','Puebla','PUE',NULL,1,'2025-01-19 18:36:06','2025-01-21 16:35:09'),(21,'eca2cd7e-d210-11ef-8fce-a2e38f1fed49','Querétaro','QRO',NULL,1,'2025-01-19 18:36:06','2025-01-21 16:35:09'),(22,'eca2cde2-d210-11ef-8fce-a2e38f1fed49','Quintana Roo','QROO',NULL,1,'2025-01-19 18:36:06','2025-01-21 16:35:09'),(23,'eca2ce50-d210-11ef-8fce-a2e38f1fed49','San Luis Potosí','SLP',NULL,1,'2025-01-19 18:36:06','2025-01-21 16:35:51'),(24,'eca2ceb4-d210-11ef-8fce-a2e38f1fed49','Sinaloa','SIN',NULL,1,'2025-01-19 18:36:06','2025-01-21 16:35:51'),(25,'eca2cf18-d210-11ef-8fce-a2e38f1fed49','Sonora','SON',NULL,1,'2025-01-19 18:36:06','2025-01-21 16:35:51'),(26,'eca2cf86-d210-11ef-8fce-a2e38f1fed49','Tabasco','TAB',NULL,1,'2025-01-19 18:36:06','2025-01-21 16:35:51'),(27,'eca2cfea-d210-11ef-8fce-a2e38f1fed49','Tamaulipas','TAMPS',NULL,1,'2025-01-19 18:36:06','2025-01-21 16:35:51'),(28,'eca2d058-d210-11ef-8fce-a2e38f1fed49','Tlaxcala','TLAX',NULL,1,'2025-01-19 18:36:06','2025-01-21 16:35:51'),(29,'eca2d0bc-d210-11ef-8fce-a2e38f1fed49','Veracruz','VER',NULL,1,'2025-01-19 18:36:06','2025-01-21 16:35:51'),(30,'eca2d120-d210-11ef-8fce-a2e38f1fed49','Yucatán','YUC',NULL,1,'2025-01-19 18:36:06','2025-01-21 16:35:51'),(31,'eca2d184-d210-11ef-8fce-a2e38f1fed49','Zacatecas','ZAC',NULL,1,'2025-01-19 18:36:06','2025-01-21 16:35:51');
/*!40000 ALTER TABLE `states` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-01-23  7:50:26
