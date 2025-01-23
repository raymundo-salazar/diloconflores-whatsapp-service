import { Optional } from "sequelize";

export interface UserRoleAttributes {
  id: number;
  user_id: number;
  role_id: number;
  assigned_at?: Date;
}

export interface UserRoleCreationAttributes
  extends Optional<UserRoleAttributes, "id" | "assignedAt"> {}
