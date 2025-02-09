import sequelize from "@config/db";
import { DataTypes, Model } from "sequelize";
import { WhatsappChatMessageAttributes, WhatsappChatMessageCreationAttributes } from "./types";
import WhatsappChatSession from "../sessions";
import WhatsappChatUser from "../users";
import WhatsappChatMedia from "../medias";

class WhatsappChatMessage
  extends Model<WhatsappChatMessageAttributes, WhatsappChatMessageCreationAttributes>
  implements WhatsappChatMessageAttributes
{
  public id!: number;
  public uuid!: string;
  public sender!: "user" | "bot" | "system" | "self";
  public message_id!: string;
  public session_id!: number;
  public session?: any;
  public user_id!: number;
  public user?: any;
  public message!: string;
  public type!: "text" | "image" | "audio" | "video" | "document" | "location" | "contact" | "chat";
  public forwarded!: boolean;
  public has_media!: boolean;
  public revoke_reason?: string;
  public edited!: boolean;
  public old_chat_id?: number;

  public readonly created_at!: Date;
  public readonly updated_at!: Date;
  public readonly deleted_at!: Date;

  public static associate() {
    WhatsappChatMessage.belongsTo(WhatsappChatSession, {
      foreignKey: "session_id",
      as: "message_session"
    });
    WhatsappChatMessage.belongsTo(WhatsappChatUser, { foreignKey: "user_id", as: "message_user" });
    WhatsappChatMessage.hasOne(WhatsappChatMedia, {
      foreignKey: "message_id",
      as: "message_media"
    });
  }
}

WhatsappChatMessage.init(
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
    sender: {
      type: DataTypes.ENUM("user", "bot", "system", "self"),
      allowNull: false
    },
    message_id: {
      type: DataTypes.STRING,
      allowNull: false
    },
    session_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    message: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    type: {
      type: DataTypes.ENUM("text", "image", "audio", "video", "document", "location", "contact"),
      allowNull: false
    },
    forwarded: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    has_media: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    edited: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    old_chat_id: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    revoke_reason: {
      type: DataTypes.STRING,
      allowNull: true
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
    deleted_at: {
      type: DataTypes.DATE,
      allowNull: true
    }
  },
  {
    sequelize,
    tableName: "whatsapp_chat_messages",
    timestamps: true,
    paranoid: true,
    underscored: true,
    hooks: {
      beforeCreate: (message) => {
        if (message.type === "chat") message.type = "text";
      }
    }
  }
);

export default WhatsappChatMessage;
