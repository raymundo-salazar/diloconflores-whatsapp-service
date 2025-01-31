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
-- Table structure for table `action_types`
--

DROP TABLE IF EXISTS `action_types`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `action_types` (
  `id` int NOT NULL AUTO_INCREMENT,
  `uuid` char(36) NOT NULL,
  `name` varchar(50) NOT NULL,
  `description` text NOT NULL,
  `active` tinyint(1) DEFAULT '1',
  `permission_id` int DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uuid` (`uuid`),
  UNIQUE KEY `name` (`name`),
  KEY `permission_id` (`permission_id`),
  CONSTRAINT `action_types_permissions_ibfk_1` FOREIGN KEY (`permission_id`) REFERENCES `permissions` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `action_types`
--

LOCK TABLES `action_types` WRITE;
/*!40000 ALTER TABLE `action_types` DISABLE KEYS */;
INSERT INTO `action_types` (`uuid`, `name`, `description`) VALUES
-- 📦 Product Actions
(UUID(), 'product_create', 'Create a new product'),
(UUID(), 'product_update', 'Update an existing product'),
(UUID(), 'product_delete', 'Delete a product'),
(UUID(), 'product_view', 'View a product'),
(UUID(), 'product_add_to_cart', 'Add a product to the cart'),
(UUID(), 'product_remove_from_cart', 'Remove a product from the cart'),

-- 🛒 Cart & Checkout Actions
(UUID(), 'cart_view', 'View shopping cart'),
(UUID(), 'cart_checkout', 'Initiate checkout process'),

-- 📦 Order Actions
(UUID(), 'order_create', 'Create a new order'),
(UUID(), 'order_update', 'Update an order'),
(UUID(), 'order_cancel', 'Cancel an order'),
(UUID(), 'order_complete', 'Complete an order'),
(UUID(), 'order_return', 'Return an order'),

-- 💳 Payment Actions
(UUID(), 'payment_initiated', 'Initiate a payment process'),
(UUID(), 'payment_success', 'Payment completed successfully'),
(UUID(), 'payment_failed', 'Payment failed'),
(UUID(), 'payment_refund', 'Process a payment refund'),

-- 👤 User Actions
(UUID(), 'user_register', 'Register a new user'),
(UUID(), 'user_login', 'User login'),
(UUID(), 'user_logout', 'User logout'),
(UUID(), 'user_profile_update', 'Update user profile'),
(UUID(), 'user_change_password', 'Change user password'),
(UUID(), 'user_reset_password', 'Reset user password'),

-- ⭐ Review & Feedback Actions
(UUID(), 'review_create', 'Create a product review'),
(UUID(), 'review_update', 'Update a product review'),
(UUID(), 'review_delete', 'Delete a product review'),

-- 📩 Support & Contact Actions
(UUID(), 'support_ticket_create', 'Create a new support ticket'),
(UUID(), 'support_ticket_update', 'Update a support ticket'),
(UUID(), 'support_ticket_close', 'Close a support ticket'),

-- 📊 Tracking & Analytics Actions
(UUID(), 'tracking_page_view', 'Track page view'),
(UUID(), 'tracking_product_click', 'Track product click'),

-- 🛠 Admin Actions (Advanced System Management)
(UUID(), 'admin_create_user', 'Admin creates a new user'),
(UUID(), 'admin_update_user', 'Admin updates a user profile'),
(UUID(), 'admin_delete_user', 'Admin deletes a user account'),
(UUID(), 'admin_reset_password', 'Admin resets a user password'),
(UUID(), 'admin_manage_roles', 'Admin manages user roles'),
(UUID(), 'admin_manage_permissions', 'Admin manages permissions'),
(UUID(), 'admin_view_logs', 'Admin views system logs'),
(UUID(), 'admin_clear_cache', 'Admin clears system cache'),
(UUID(), 'admin_update_store_settings', 'Admin updates store settings'),
(UUID(), 'admin_manage_discounts', 'Admin manages discount codes and promotions'),
(UUID(), 'admin_dashboard_access', 'Admin accesses the admin dashboard'),

-- 🏬 Employee Actions (Internal Store Operations)
(UUID(), 'employee_login', 'Employee logs into the system'),
(UUID(), 'employee_logout', 'Employee logs out of the system'),
(UUID(), 'employee_order_fulfillment', 'Employee processes an order for shipping'),
(UUID(), 'employee_update_stock', 'Employee updates stock levels'),
(UUID(), 'employee_handle_returns', 'Employee processes a returned order'),
(UUID(), 'employee_respond_to_tickets', 'Employee responds to customer support tickets'),
(UUID(), 'employee_process_refund', 'Employee processes a refund request'),
(UUID(), 'employee_update_product_price', 'Employee updates a product price'),
(UUID(), 'employee_access_employee_portal', 'Employee accesses the employee dashboard');

/*!40000 ALTER TABLE `action_types` ENABLE KEYS */;
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
