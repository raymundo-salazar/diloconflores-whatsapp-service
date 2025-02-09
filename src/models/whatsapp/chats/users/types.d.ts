import { UserAttributes } from "@models/users/types";
import { Optional } from "sequelize";

export interface WhatsappChatUserAttributes {
  id: number;
  uuid: string;
  wid: string;
  whatsapp_name: string;
  name: string;
  phone_number: string;
  client_id?: number;
  client?: UserAttributes;
  created_at: Date;
  updated_at: Date;
}

export interface WhatsappChatUserCreationAttributes
  extends Optional<WhatsappChatUserAttributes, "id" | "created_at" | "updated_at" | "uuid"> {}

// Wrtie CREATE TABLE statement drop table if exists;
// DROP TABLE IF EXISTS `whatsapp_chat_users`;
// CREATE TABLE `whatsapp_chat_users` (
//   `id` int NOT NULL AUTO_INCREMENT,
//   `uuid` varchar(255) NOT NULL,
//   `wid` varchar(255) NOT NULL,
//   `whatsapp_name` varchar(255) NOT NULL,
//   `name` varchar(255) NOT NULL,
//   `phone_number` varchar(255) NOT NULL,
//   `client_id` int NULL DEFAULT NULL,
//   `created_at` timestamp NULL DEFAULT NULL,
//   `updated_at` timestamp NULL DEFAULT NULL,
//   PRIMARY KEY (`id`),
//   KEY `whatsapp_chat_users_client_id_foreign` (`client_id`),
//   CONSTRAINT `whatsapp_chat_users_client_id_foreign` FOREIGN KEY (`client_id`) REFERENCES `users` (`id`)
// );
