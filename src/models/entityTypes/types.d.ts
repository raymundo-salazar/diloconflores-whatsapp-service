import { Optional } from "sequelize";

export interface EntityTypeAttributes {
  id: number;
  name: string;
  description: string;
  active: boolean;
  created_at: Date;
  updated_at: Date;
}

export interface EntityTypeCreationAttributes
  extends Optional<EntityTypeAttributes, "id" | "created_at" | "updated_at"> {}
