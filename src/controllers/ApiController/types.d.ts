import { IncludeOptions as IncludeOptionsSequelize } from "sequelize";
import { JwtPayload } from "jsonwebtoken";

export interface IncludeOptions extends IncludeOptionsSequelize {
  foreignKey?: string;
  associationType?: string;
  identifier?: string;
}

export type AttributesRelation = Array<string | Record<string, string>>;

export type DeviceInfo = {
  ip?: string;
  deviceType: string;
  os: string;
  osVersion: string;
  browser: string;
  browserVersion: string;
  language: string;
  location: string;
  userAgent: string;
};

export interface TokenJwtPayload extends JwtPayload {
  user: string;
  fingerprint: string;
}
