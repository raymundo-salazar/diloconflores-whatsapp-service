import { Optional } from "sequelize";
import { WhatsappChatSessionAttributes } from "../sessions/types";
import { WhatsappChatUserAttributes } from "../users/types";

export interface WhatsappChatMessageAttributes {
  id: number;
  uuid?: string;
  sender: "user" | "bot" | "system" | "self";
  message_id: string;
  session_id: number;
  session?: WhatsappChatSessionAttributes;
  user_id: number;
  user?: WhatsappChatUserAttributes;
  message: string;
  type: "text" | "image" | "audio" | "video" | "document" | "location" | "contact" | "chat";
  forwarded: boolean;
  has_media: boolean;
  edited: boolean;
  old_chat_id?: number;
  old_chat?: WhatsappChatMessageAttributes;
  revoke_reason?: string;
  created_at: Date;
  updated_at: Date;
  deleted_at: Date;
}

export interface WhatsappChatMessageCreationAttributes
  extends Optional<
    WhatsappChatMessageAttributes,
    | "id"
    | "created_at"
    | "updated_at"
    | "uuid"
    | "message_id"
    | "session"
    | "user"
    | "deleted_at"
    | "revoke_reason"
    | "old_chat"
  > {}

// Wrtie CREATE TABLE statement drop table if exists;
// DROP TABLE IF EXISTS `whatsapp_chat_messages`;
// CREATE TABLE `whatsapp_chat_messages` (
//   `id` int NOT NULL AUTO_INCREMENT,
//   `uuid` varchar(255) NOT NULL,
//   `sender` enum('user','bot','system', 'self') NOT NULL,
//   `message_id` varchar(255) NULL DEFAULT NULL,
//   `session_id` int NOT NULL,
//   `user_id` int NOT NULL,
//   `message` text NOT NULL,
//   `type` enum('text','image','audio','video','document','location','contact') NOT NULL,
//   `forwarded` tinyint(1) NOT NULL DEFAULT '0',
//   `has_media` tinyint(1) NOT NULL DEFAULT '0',
//   `revoke_reason` text NULL DEFAULT NULL,
//   `created_at` timestamp NULL DEFAULT NULL,
//   `updated_at` timestamp NULL DEFAULT NULL,
//   `deleted_at` timestamp NULL DEFAULT NULL,
//   PRIMARY KEY (`id`),
//   KEY `whatsapp_chat_messages_session_id_foreign` (`session_id`),
//   KEY `whatsapp_chat_messages_user_id_foreign` (`user_id`),
//   CONSTRAINT `whatsapp_chat_messages_session_id_foreign` FOREIGN KEY (`session_id`) REFERENCES `whatsapp_chat_sessions` (`id`),
//   CONSTRAINT `whatsapp_chat_messages_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `whatsapp_chat_users` (`id`)
// );
