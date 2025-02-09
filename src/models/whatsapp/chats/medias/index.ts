import sequelize from "@config/db";
import { DataTypes, Model } from "sequelize";
import { WhatsappChatMediaAttributes, WhatsappChatMediaCreationAttributes } from "./types";
import WhatsappChatMessage from "../messages";

class WhatsappChatMedia
  extends Model<WhatsappChatMediaAttributes, WhatsappChatMediaCreationAttributes>
  implements WhatsappChatMediaAttributes
{
  public id!: number;
  public uuid!: string;
  public message_id!: number;
  public bucket_name!: string;
  public object_name!: string;
  public media_type!:
    | "image"
    | "audio"
    | "video"
    | "document"
    | "sticker"
    | "voice"
    | "ptt"
    | "gif";
  public mime_type!: "image" | "audio" | "video" | "document";
  public size!: number;
  public caption!: string;
  public extension!: string;
  public width!: number;
  public height!: number;
  public is_view_once!: boolean;
  public readonly created_at!: Date;
  public readonly updated_at!: Date;

  public readonly message?: WhatsappChatMessage;

  public static associate() {
    WhatsappChatMedia.belongsTo(WhatsappChatMessage, {
      foreignKey: "message_id",
      as: "media_message"
    });
  }
}

WhatsappChatMedia.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    uuid: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false
    },
    message_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    bucket_name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    object_name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    media_type: {
      type: DataTypes.ENUM("image", "audio", "video", "document", "sticker", "voice", "ptt", "gif"),
      allowNull: false
    },
    mime_type: {
      type: DataTypes.STRING,
      allowNull: false
    },
    size: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    caption: {
      type: DataTypes.STRING,
      allowNull: true
    },
    extension: {
      type: DataTypes.STRING,
      allowNull: true
    },
    width: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    height: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    is_view_once: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    },
    updated_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    }
  },
  {
    sequelize,
    tableName: "whatsapp_chat_medias",
    underscored: true,
    timestamps: true
  }
);

export default WhatsappChatMedia;
