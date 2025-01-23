import { Model, DataTypes } from "sequelize";
import sequelize from "@config/db";
import User from "@models/users";
import { SessionAttributes, SessionCreationAttributes } from "./types";

class Session
  extends Model<SessionAttributes, SessionCreationAttributes>
  implements SessionAttributes
{
  public id!: number;
  public uuid!: string;
  public userId!: number;
  public accessTokenHash!: string;
  public refreshTokenHash!: string;
  public expiresAt!: Date;
  public lastActivityAt?: Date;
  public revoked!: boolean;
  public deviceType?: string;
  public os?: string;
  public osVersion?: string;
  public browser?: string;
  public browserVersion?: string;
  public userAgent?: string;
  public screenResolution?: string;
  public deviceMemory?: number;
  public cores?: number;
  public platform?: string;
  public timezone?: string;
  public ipAddress?: string;
  public connectionType?: string;
  public networkDownlink?: number;
  public networkRtt?: number;
  public location?: string;
  public readonly created_at!: Date;
}

Session.init(
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    uuid: { type: DataTypes.CHAR(36), allowNull: false, unique: true },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: User, key: "id" },
    },
    accessTokenHash: { type: DataTypes.STRING(255), allowNull: false },
    refreshTokenHash: { type: DataTypes.STRING(255), allowNull: false },
    expiresAt: { type: DataTypes.DATE, allowNull: false },
    lastActivityAt: { type: DataTypes.DATE, allowNull: true },
    revoked: { type: DataTypes.BOOLEAN, defaultValue: false },
    deviceType: { type: DataTypes.STRING(50), allowNull: true },
    os: { type: DataTypes.STRING(50), allowNull: true },
    osVersion: { type: DataTypes.STRING(20), allowNull: true },
    browser: { type: DataTypes.STRING(50), allowNull: true },
    browserVersion: { type: DataTypes.STRING(20), allowNull: true },
    userAgent: { type: DataTypes.STRING(255), allowNull: true },
    screenResolution: { type: DataTypes.STRING(20), allowNull: true },
    deviceMemory: { type: DataTypes.DECIMAL(3, 1), allowNull: true },
    cores: { type: DataTypes.INTEGER, allowNull: true },
    platform: { type: DataTypes.STRING(50), allowNull: true },
    timezone: { type: DataTypes.STRING(50), allowNull: true },
    ipAddress: { type: DataTypes.STRING(50), allowNull: true },
    connectionType: { type: DataTypes.STRING(20), allowNull: true },
    networkDownlink: { type: DataTypes.DECIMAL(5, 2), allowNull: true },
    networkRtt: { type: DataTypes.INTEGER, allowNull: true },
    location: { type: DataTypes.STRING(100), allowNull: true },
  },
  {
    sequelize,
    tableName: "sessions",
    timestamps: true,
  }
);

export default Session;
