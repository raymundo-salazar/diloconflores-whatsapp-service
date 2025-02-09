import sequelize from "@config/db";
import { Model, DataTypes } from "sequelize";
import { WhatsappChatSessionAttributes, WhatsappChatSessionCreationAttributes } from "./types";
import WhatsappChatUser from "../users";
import WhatsappSessions from "@models/whatsapp/sessions";
import WhatsappChatMessage from "../messages";

class WhatsappChatSession
  extends Model<WhatsappChatSessionAttributes, WhatsappChatSessionCreationAttributes>
  implements WhatsappChatSessionAttributes
{
  public id!: number;
  public uuid!: string;
  public user_id!: number;
  public user?: any;
  public to_id!: number;
  public device_type!: string;
  public chat_flow_id!: number;
  public chat_flow?: any;
  public chat_flow_step_id?: number;
  public chat_flow_step?: any;
  public active!: boolean;

  public readonly created_at!: Date;
  public readonly updated_at!: Date;
  public readonly closed_at!: Date;

  public static associate() {
    WhatsappChatSession.belongsTo(WhatsappChatUser, { foreignKey: "user_id", as: "session_user" });
    WhatsappChatSession.hasMany(WhatsappChatMessage, {
      foreignKey: "session_id",
      as: "session_messages"
    });
  }
}

WhatsappChatSession.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    uuid: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: DataTypes.UUIDV4
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    to_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    device_type: {
      type: DataTypes.STRING,
      allowNull: false
    },
    chat_flow_id: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    chat_flow_step_id: {
      type: DataTypes.INTEGER
    },
    active: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    },
    updated_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    },
    closed_at: {
      type: DataTypes.DATE,
      allowNull: true
    }
  },
  {
    sequelize,
    tableName: "whatsapp_chat_sessions",
    timestamps: false,
    underscored: true
  }
);

export default WhatsappChatSession;
