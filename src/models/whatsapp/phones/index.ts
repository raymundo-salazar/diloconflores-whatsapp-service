import sequelize from "@config/db";
import { Model, DataTypes } from "sequelize";
import { UserAttributes } from "@models/users/types";
import { WhatsappPhoneAttributes, WhatsappPhoneCreationAttributes } from "./types";
import Users from "@models/users";
import WhatsappSessions from "../sessions";

class WhatsappPhones
  extends Model<WhatsappPhoneAttributes, WhatsappPhoneCreationAttributes>
  implements WhatsappPhoneAttributes
{
  public id!: number;
  public uuid!: string;
  public phone_number!: string;
  public area_code!: string;
  public session_name!: string;
  public status!: string;
  public created_by!: number;
  public user?: UserAttributes;
  public readonly created_at!: Date;
  public readonly updated_at!: Date;
  public readonly deleted_at!: Date;

  static associate() {
    WhatsappPhones.belongsTo(Users, { foreignKey: "created_by", as: "user" });
    WhatsappPhones.belongsTo(WhatsappSessions, {
      foreignKey: "id",
      targetKey: "phone_number_id",
      as: "session"
    });
  }
}

WhatsappPhones.init(
  {
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
      autoIncrement: true
    },
    uuid: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: DataTypes.UUIDV4
    },
    phone_number: {
      type: DataTypes.STRING,
      allowNull: false
    },
    area_code: {
      type: DataTypes.STRING,
      allowNull: false
    },
    session_name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    status: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "pending"
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: false
    },
    created_by: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    updated_at: {
      type: DataTypes.DATE,
      allowNull: false
    },
    deleted_at: {
      type: DataTypes.DATE,
      allowNull: true
    }
  },
  {
    sequelize,
    paranoid: true,
    timestamps: true,
    tableName: "whatsapp_phones",
    modelName: "WhatsappPhone",
    createdAt: "created_at",
    updatedAt: "updated_at",
    deletedAt: "deleted_at"
  }
);

export default WhatsappPhones;
