import { PermissionAttributes } from "@models/permissions/types";
import { Optional } from "sequelize";

export interface RolePermissionAttributes {
  id: number;
  role_id: number;
  permission_id: number;
  scope: "global" | "own" | "branch";
  granted_at?: Date;
  permission?: PermissionAttributes;
}

export interface RolePermissionCreationAttributes
  extends Optional<RolePermissionAttributes, "id" | "granted_at"> {}
