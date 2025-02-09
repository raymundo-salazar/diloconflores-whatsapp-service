import { UserAttributes } from "@models/users/types";
import { Optional } from "sequelize";

export interface WhatsappPhoneAttributes {
  id: number;
  uuid: string;
  phone_number: string;
  area_code: string;
  session_name: string;
  status: string;
  created_at: Date;
  created_by: number;
  user?: UserAttributes;
  updated_at: Date;
  deleted_at: Date;
}

export interface WhatsappPhoneCreationAttributes extends Optional<WhatsappPhoneAttributes, "id"> {}
