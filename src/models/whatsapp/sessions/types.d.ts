import { Optional } from "sequelize";
import { WhatsappPhoneAttributes } from "../phones/types";

export interface WhatsappSessionAttributes {
  id: number;
  session_name: string;
  data: Blob;
  created_at: Date;
  updated_at: Date;
  phone_number_id: number;
  phone_number?: WhatsappPhoneAttributes;
}

export interface WhatsappSessionCreationAttributes
  extends Optional<WhatsappSessionAttributes, "id", "created_at", "updated_at"> {}
