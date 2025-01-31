import sequelize from "@config/db";
import { DataTypes, Model } from "sequelize";
import { ActivityLogAttributes, ActivityLogCreationAttributes } from "./types";
import { UserAttributes } from "@models/users/types";
import { ActionTypeAttributes } from "@models/actionTypes/types";
import { EntityTypeAttributes } from "@models/entityTypes/types";
import { SessionAttributes } from "@models/sessions/types";
import Users from "@models/users";
import ActionTypes from "@models/actionTypes";
import Sessions from "@models/sessions";
import EntityTypes from "@models/entityTypes";

class ActivityLogs
  extends Model<ActivityLogAttributes, ActivityLogCreationAttributes>
  implements ActivityLogAttributes
{
  public id!: number;
  public uuid!: string;
  public user_id!: number;
  public readonly user?: UserAttributes;
  public action_type_id!: number;
  public readonly actionType?: ActionTypeAttributes;
  public entity_type_id!: number;
  public readonly entityType?: EntityTypeAttributes;
  public entity_id!: number;
  public readonly entity?: any;
  public headers!: string;
  public path!: string;
  public method!: string;
  public params!: string;
  public body!: string;
  public response!: string;
  public status!: number;
  public session_id!: number;
  public readonly session?: SessionAttributes;
  public readonly created_at!: Date;
  public readonly finished_at!: Date;

  public static associate() {
    ActivityLogs.belongsTo(Users, {
      foreignKey: "user_id",
      as: "user",
    });
    ActivityLogs.belongsTo(ActionTypes, {
      foreignKey: "action_type_id",
      as: "action-type",
    });
    ActivityLogs.belongsTo(EntityTypes, {
      foreignKey: "entity_type_id",
      as: "entity-type",
    });
    ActivityLogs.belongsTo(Sessions, {
      foreignKey: "session_id",
      as: "session",
    });
  }
}

ActivityLogs.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    uuid: {
      type: DataTypes.UUID,
      unique: true,
      allowNull: false,
      defaultValue: DataTypes.UUIDV4,
    },
    user_id: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: true,
    },
    action_type_id: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
    },
    entity_type_id: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
    },
    entity_id: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
    },
    headers: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    path: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    method: {
      type: DataTypes.STRING(10),
      allowNull: false,
    },
    params: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    body: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    response: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    status: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    session_id: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    finished_at: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    sequelize,
    tableName: "activity_logs",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "finished_at",
  }
);

export default ActivityLogs;
