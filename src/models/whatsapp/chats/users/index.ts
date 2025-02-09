import sequelize from "@config/db";
import { Model, DataTypes } from "sequelize";
import { WhatsappChatUserAttributes, WhatsappChatUserCreationAttributes } from "./types";
import Users from "@models/users";
import WhatsappChatSession from "../sessions";

class WhatsappChatUsers
  extends Model<WhatsappChatUserAttributes, WhatsappChatUserCreationAttributes>
  implements WhatsappChatUserAttributes
{
  public id!: number;
  public uuid!: string;
  public wid!: string;
  public whatsapp_name!: string;
  public name!: string;
  public phone_number!: string;
  public client_id!: number;
  public created_at!: Date;
  public updated_at!: Date;

  public static associate() {
    WhatsappChatUsers.belongsTo(Users, { foreignKey: "client_id", as: "client" });
    WhatsappChatUsers.hasMany(WhatsappChatSession, { foreignKey: "user_id", as: "sessions" });
  }
}

WhatsappChatUsers.init(
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
    wid: {
      type: DataTypes.STRING,
      allowNull: false
    },
    whatsapp_name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    phone_number: {
      type: DataTypes.STRING,
      allowNull: false
    },
    client_id: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: true
    },
    updated_at: {
      type: DataTypes.DATE,
      allowNull: true
    }
  },
  {
    sequelize,
    tableName: "whatsapp_chat_users",
    timestamps: true,
    underscored: true
  }
);

export default WhatsappChatUsers;
