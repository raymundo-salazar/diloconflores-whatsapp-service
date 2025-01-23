import { IncludeOptions as IncludeOptionsSequelize } from "sequelize";

export interface IncludeOptions extends IncludeOptionsSequelize {
  foreignKey?: string;
  associationType?: string;
  identifier?: string;
}

export type AttributesRelation = Array<string | Record<string, string>>;
