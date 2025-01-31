import { PermissionAttributes } from "@models/permissions/types";

export interface ActionTypeAttributes {
  id: number;
  uuid: string;
  name: string;
  description: string;
  active: boolean;
  permission_id: number;
  permission?: PermissionAttributes;
  created_at: Date;
  updated_at: Date;
}

export interface ActionTypeCreationAttributes
  extends Optional<ActionTypeAttributes, "id" | "created_at" | "updated_at"> {}
