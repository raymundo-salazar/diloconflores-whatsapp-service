import { Optional } from "sequelize";

export interface CountryAttributes {
  id: number;
  uuid: string;
  name: string;
  abbreviation?: string;
  area_code?: string;
  created_at: Date;
  updated_at: Date;
}

export interface CountryCreationAttributes
  extends Optional<CountryAttributes, "id" | "created_at" | "updated_at"> {}
