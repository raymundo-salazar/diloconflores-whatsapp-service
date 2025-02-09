import { Optional } from "sequelize";
import { WhatsappChatMessageAttributes } from "../messages/types";

export interface WhatsappChatMediaAttributes {
  id: number;
  uuid?: string;
  message_id: number;
  message?: WhatsappChatMessageAttributes;
  bucket_name: string;
  object_name: string;
  media_type: "image" | "audio" | "video" | "document" | "sticker" | "voice" | "ptt" | "gif";
  mime_type: "image" | "audio" | "video" | "document";
  size: number;
  caption: string;
  extension: string;
  width: number;
  height: number;
  is_view_once: boolean;
  created_at: Date;
  updated_at: Date;
}

export interface WhatsappChatMediaCreationAttributes
  extends Optional<WhatsappChatMediaAttributes, "id" | "created_at" | "updated_at"> {}

// Wrtie CREATE TABLE statement drop table if exists;
// DROP TABLE IF EXISTS `whatsapp_chat_medias`;
// CREATE TABLE `whatsapp_chat_medias` (
//   `id` int NOT NULL AUTO_INCREMENT,
//   `uuid` varchar(255) NOT NULL,
//   `message_id` int NOT NULL,
//   `bucket_name` varchar(255) NOT NULL,
//   `object_name` varchar(255) NOT NULL,
//   `media_type` enum('image','audio','video','document','sticker','voice','ptt','gif') NOT NULL,
//   `mime_type` enum('image','audio','video','document') NOT NULL,
//   `size` int NOT NULL,
//   `caption` text NOT NULL,
//   `extension` varchar(255) NULL DEFAULT NULL,
//   `width` int NOT NULL DEFAULT '0',
//   `height` int NOT NULL DEFAULT '0',
//   `is_view_once` tinyint(1) NOT NULL DEFAULT '0',
//   `created_at` timestamp NULL DEFAULT NULL,
//   `updated_at` timestamp NULL DEFAULT NULL,
//   PRIMARY KEY (`id`),
//   KEY `whatsapp_chat_medias_message_id_foreign` (`message_id`),
//   CONSTRAINT `whatsapp_chat_medias_message_id_foreign` FOREIGN KEY (`message_id`) REFERENCES `whatsapp_chat_messages` (`id`)
// );
