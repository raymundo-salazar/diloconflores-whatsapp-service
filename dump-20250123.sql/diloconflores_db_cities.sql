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
-- Table structure for table `cities`
--

DROP TABLE IF EXISTS `cities`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `cities` (
  `id` int NOT NULL AUTO_INCREMENT,
  `uuid` char(36) NOT NULL,
  `name` varchar(100) NOT NULL,
  `state_id` int DEFAULT NULL,
  `active` tinyint(1) DEFAULT '1',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uuid` (`uuid`),
  KEY `cities_ibfk_1` (`state_id`),
  CONSTRAINT `cities_ibfk_1` FOREIGN KEY (`state_id`) REFERENCES `states` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=17 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cities`
--

LOCK TABLES `cities` WRITE;
/*!40000 ALTER TABLE `cities` DISABLE KEYS */;
INSERT INTO `cities` VALUES (1,'eca4261a-d210-11ef-8fce-a2e38f1fed49','Monterrey',NULL,1,'2025-01-19 18:36:03','2025-01-22 21:07:35'),(2,'eca42f34-d210-11ef-8fce-a2e38f1fed49','San Pedro Garza García',1,1,'2025-01-19 18:36:03','2025-01-22 20:17:10'),(3,'eca431f0-d210-11ef-8fce-a2e38f1fed49','Guadalupe',1,1,'2025-01-19 18:36:03','2025-01-22 20:19:07'),(4,'eca432d6-d210-11ef-8fce-a2e38f1fed49','Apodaca',1,1,'2025-01-19 18:36:03','2025-01-22 20:17:10'),(5,'eca43376-d210-11ef-8fce-a2e38f1fed49','Santa Catarina',1,1,'2025-01-19 18:36:03','2025-01-22 20:00:55'),(6,'eca4340c-d210-11ef-8fce-a2e38f1fed49','San Nicolás de los Garza',18,1,'2025-01-19 18:36:03','2025-01-19 18:36:03'),(7,'eca434a2-d210-11ef-8fce-a2e38f1fed49','Escobedo',18,1,'2025-01-19 18:36:03','2025-01-19 18:36:03'),(8,'eca4352e-d210-11ef-8fce-a2e38f1fed49','Juárez',18,1,'2025-01-19 18:36:03','2025-01-19 18:36:03'),(9,'eca435c4-d210-11ef-8fce-a2e38f1fed49','Cadereyta Jiménez',18,1,'2025-01-19 18:36:03','2025-01-19 18:36:03'),(10,'eca4365a-d210-11ef-8fce-a2e38f1fed49','Santiago',18,1,'2025-01-19 18:36:03','2025-01-19 18:36:03'),(11,'eca436dc-d210-11ef-8fce-a2e38f1fed49','Linares',18,1,'2025-01-19 18:36:03','2025-01-19 18:36:03'),(12,'eca4375e-d210-11ef-8fce-a2e38f1fed49','Sabinas Hidalgo',18,1,'2025-01-19 18:36:03','2025-01-19 18:36:03'),(13,'eca437e0-d210-11ef-8fce-a2e38f1fed49','García',18,1,'2025-01-19 18:36:03','2025-01-19 18:36:03'),(14,'eca43862-d210-11ef-8fce-a2e38f1fed49','Pesquería',18,1,'2025-01-19 18:36:03','2025-01-19 18:36:03'),(15,'eca438e4-d210-11ef-8fce-a2e38f1fed49','Montemorelos',18,1,'2025-01-19 18:36:03','2025-01-19 18:36:03');
/*!40000 ALTER TABLE `cities` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-01-23  7:50:28
