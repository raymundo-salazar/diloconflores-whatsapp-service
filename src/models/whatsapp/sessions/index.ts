import { Model, DataTypes } from "sequelize";
import WhatsappPhones from "../phones";
import { WhatsappSessionAttributes, WhatsappSessionCreationAttributes } from "./types";
import sequelize from "@config/db";

class WhatsappSessions
  extends Model<WhatsappSessionAttributes, WhatsappSessionCreationAttributes>
  implements WhatsappSessionAttributes
{
  public id!: number;
  public session_name!: string;
  public data!: Blob;
  public created_at!: Date;
  public updated_at!: Date;
  public phone_number_id!: number;
  public readonly phone_number?: WhatsappPhones;

  public static associate() {
    WhatsappSessions.belongsTo(WhatsappPhones, {
      foreignKey: "phone_number_id",
      as: "phone_number"
    });
  }
}

WhatsappSessions.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    session_name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    data: {
      type: DataTypes.BLOB,
      allowNull: false
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: false
    },
    updated_at: {
      type: DataTypes.DATE,
      allowNull: false
    },
    phone_number_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  },
  {
    sequelize,
    tableName: "whatsapp_sessions",
    timestamps: true,
    underscored: true
  }
);

export default WhatsappSessions;
