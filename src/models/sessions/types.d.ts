import { Optional } from "sequelize";

export interface SessionAttributes {
  id: number;
  uuid: string;
  userId: number;
  accessTokenHash: string;
  refreshTokenHash: string;
  expiresAt: Date;
  lastActivityAt?: Date;
  revoked: boolean;
  deviceType?: string;
  os?: string;
  osVersion?: string;
  browser?: string;
  browserVersion?: string;
  userAgent?: string;
  screenResolution?: string;
  deviceMemory?: number;
  cores?: number;
  platform?: string;
  timezone?: string;
  ipAddress?: string;
  connectionType?: string;
  networkDownlink?: number;
  networkRtt?: number;
  location?: string;
  created_at?: Date;
}

export interface SessionCreationAttributes
  extends Optional<SessionAttributes, "id" | "lastActivityAt" | "revoked"> {}
