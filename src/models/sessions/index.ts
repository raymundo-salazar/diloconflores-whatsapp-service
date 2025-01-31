import { Model, DataTypes } from "sequelize";
import sequelize from "@config/db";
import Users from "@models/users";
import { SessionAttributes, SessionCreationAttributes } from "./types";

class Session
  extends Model<SessionAttributes, SessionCreationAttributes>
  implements SessionAttributes
{
  public id!: number;
  public uuid?: string;
  public user_id!: number;
  public access_token!: string;
  public access_token_hash!: string;
  public refresh_token!: string;
  public refresh_token_hash!: string;
  public refresh_id?: number;
  public fingerprint!: string;
  public expires_at!: Date;
  public last_activity_at?: Date;
  public device_type?: string;
  public os?: string;
  public os_version?: string;
  public browser?: string;
  public browser_version?: string;
  public user_agent?: string;
  public screen_resolution?: string;
  public device_memory?: number;
  public cores?: number;
  public platform?: string;
  public timezone?: string;
  public ip_address?: string;
  public connection_type?: string;
  public network_downlink?: number;
  public network_rtt?: number;
  public location?: string;
  public revoked!: boolean;
  public revoked_at?: Date;
  public revoked_reason?: string;
  public session_type?: string;
  public readonly created_at!: Date;
  public readonly user?: Users;

  public static associate() {
    Session.belongsTo(Users, {
      foreignKey: "user_id",
      as: "user",
    });
  }
}

Session.init(
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    uuid: {
      type: DataTypes.CHAR(36),
      allowNull: true,
      unique: true,
      defaultValue: DataTypes.UUIDV4,
    },
    user_id: { type: DataTypes.INTEGER, allowNull: false },
    access_token: { type: DataTypes.STRING(255), allowNull: false },
    access_token_hash: { type: DataTypes.STRING(255), allowNull: false },
    refresh_token: { type: DataTypes.STRING(255), allowNull: false },
    refresh_token_hash: { type: DataTypes.STRING(255), allowNull: false },
    refresh_id: { type: DataTypes.INTEGER, allowNull: true },
    fingerprint: { type: DataTypes.STRING(255), allowNull: false },
    expires_at: { type: DataTypes.DATE, allowNull: false },
    last_activity_at: { type: DataTypes.DATE, allowNull: true },
    device_type: { type: DataTypes.STRING(50), allowNull: true },
    os: { type: DataTypes.STRING(50), allowNull: true },
    os_version: { type: DataTypes.STRING(20), allowNull: true },
    browser: { type: DataTypes.STRING(50), allowNull: true },
    browser_version: { type: DataTypes.STRING(20), allowNull: true },
    user_agent: { type: DataTypes.STRING(255), allowNull: true },
    screen_resolution: { type: DataTypes.STRING(20), allowNull: true },
    device_memory: { type: DataTypes.DECIMAL(3, 1), allowNull: true },
    cores: { type: DataTypes.INTEGER, allowNull: true },
    platform: { type: DataTypes.STRING(50), allowNull: true },
    timezone: { type: DataTypes.STRING(50), allowNull: true },
    ip_address: { type: DataTypes.STRING(50), allowNull: true },
    connection_type: { type: DataTypes.STRING(20), allowNull: true },
    network_downlink: { type: DataTypes.DECIMAL(5, 2), allowNull: true },
    network_rtt: { type: DataTypes.INTEGER, allowNull: true },
    location: { type: DataTypes.STRING(100), allowNull: true },
    revoked: { type: DataTypes.BOOLEAN, defaultValue: false },
    revoked_at: { type: DataTypes.DATE, allowNull: true },
    revoked_reason: { type: DataTypes.STRING(255), allowNull: true },
    session_type: { type: DataTypes.STRING(50), allowNull: true },
  },
  {
    sequelize,
    tableName: "sessions",
    timestamps: true,
    updatedAt: false,
    paranoid: true,
    createdAt: "created_at",
    deletedAt: "revoked_at",
    hooks: {
      beforeBulkDestroy: async (session) => {
        const revoked_reason = (session.where as any).revoked_reason;
        const refresh_id = (session.where as any).refresh_id;
        delete (session.where as any).revoked_reason;
        delete (session.where as any).refresh_id;

        if (session.where) {
          await Session.update(
            { revoked: true, revoked_reason, refresh_id },
            { where: session.where }
          );
        }
      },
    },
  }
);

export default Session;
