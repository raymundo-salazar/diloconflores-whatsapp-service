import { StateAttributes } from "@models/states/types";
import { Optional } from "sequelize";

export interface CityAttributes {
  id: number;
  uuid: string;
  name: string;
  state_id: number;
  active: boolean;
  state?: StateAttributes;
  created_at: Date;
  updated_at: Date;
}

export interface CityCreationAttributes
  extends Optional<CityAttributes, "id" | "created_at" | "updated_at"> {}
