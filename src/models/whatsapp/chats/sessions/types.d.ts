import { Optional } from "sequelize";
import { WhatsappChatUserAttributes } from "../users/types";

export interface WhatsappChatSessionAttributes {
  id: number;
  uuid: string;
  user_id: number;
  user?: WhatsappChatUserAttributes;
  to_id: number;
  device_type: string;
  chat_flow_id?: number;
  chat_flow?: any;
  chat_flow_step_id?: number;
  chat_flow_step?: any;
  active: boolean;
  created_at: Date;
  updated_at: Date;
  closed_at?: Date | null;
}

export interface WhatsappChatSessionCreationAttributes
  extends Optional<
    WhatsappChatSessionAttributes,
    "id" | "created_at" | "updated_at" | "closed_at" | "uuid"
  > {}

// Wrtie CREATE TABLE statement drop table if exists;
// DROP TABLE IF EXISTS `whatsapp_chat_sessions`;
// CREATE TABLE `whatsapp_chat_sessions` (
//   `id` int NOT NULL AUTO_INCREMENT,
//   `uuid` varchar(255) NOT NULL,
//   `user_id` int NOT NULL,
//   `to_id` int NOT NULL,
//   `device_type` varchar(255) NOT NULL,
//   `chat_flow_id` int NULL DEFAULT NULL,
//   `chat_flow_step_id` int DEFAULT NULL,
//   `active` tinyint(1) NOT NULL DEFAULT '1',
//   `created_at` timestamp NULL DEFAULT NULL,
//   `updated_at` timestamp NULL DEFAULT NULL,
//   `closed_at` timestamp NULL DEFAULT NULL,
//   PRIMARY KEY (`id`),
//   KEY `whatsapp_chat_sessions_user_id_foreign` (`user_id`),
//   KEY `whatsapp_chat_sessions_chat_flow_id_foreign` (`chat_flow_id`),
//   KEY `whatsapp_chat_sessions_chat_flow_step_id_foreign` (`chat_flow_step_id`),
//   CONSTRAINT `whatsapp_chat_sessions_chat_flow_id_foreign` FOREIGN KEY (`chat_flow_id`) REFERENCES `chat_flows` (`id`),
//   CONSTRAINT `whatsapp_chat_sessions_chat_flow_step_id_foreign` FOREIGN KEY (`chat_flow_step_id`) REFERENCES `chat_flow_steps` (`id`),
//   CONSTRAINT `whatsapp_chat_sessions_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `whatsapp_chat_users` (`id`)
// );
