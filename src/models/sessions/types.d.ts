import { UserAttributes } from "@models/users/types";
import { Optional } from "sequelize";

export interface SessionAttributes {
  id: number;
  uuid?: string;
  user_id: number;
  user?: UserAttributes;
  access_token: string;
  access_token_hash: string;
  refresh_token: string;
  refresh_token_hash: string;
  refresh_id?: number;
  fingerprint: string;
  expires_at: Date;
  last_activity_at?: Date;
  device_type?: string;
  os?: string;
  os_version?: string;
  browser?: string;
  browser_version?: string;
  user_agent?: string;
  screen_resolution?: string;
  device_memory?: number;
  cores?: number;
  platform?: string;
  timezone?: string;
  ip_address?: string;
  connection_type?: string;
  network_downlink?: number;
  network_rtt?: number;
  location?: string;
  revoked: boolean;
  revoked_at?: Date;
  revoked_reason?: string;
  created_at?: Date;
  session_type?: string;
}

export interface SessionCreationAttributes
  extends Optional<SessionAttributes, "id" | "lastActivityAt" | "revoked"> {}
