import { CountryAttributes } from "@models/countries/types";
import { Optional } from "sequelize";

export interface StateAttributes {
  id: number;
  uuid: string;
  name: string;
  abbreviation?: string;
  country_id?: number | null;
  country?: CountryAttributes;
  active: boolean;
  created_at: Date;
  updated_at: Date;
}

export interface StateCreationAttributes
  extends Optional<StateAttributes, "id" | "created_at" | "updated_at"> {}
