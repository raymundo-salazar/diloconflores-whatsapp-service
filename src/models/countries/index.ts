import { DataTypes, Model } from "sequelize";
import { CountryAttributes, CountryCreationAttributes } from "./types";
import sequelize from "@config/db";
import States from "@models/states";

class Countries
  extends Model<CountryAttributes, CountryCreationAttributes>
  implements CountryAttributes
{
  public id!: number;
  public uuid!: string;
  public name!: string;
  public abbreviation!: string;
  public area_code!: string;
  public readonly created_at!: Date;
  public readonly updated_at!: Date;

  public static associate() {
    Countries.hasMany(States, {
      foreignKey: "country_id",
      as: "states",
    });
  }
}

Countries.init(
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
    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    abbreviation: {
      type: DataTypes.STRING(10),
      allowNull: false,
    },
    area_code: {
      type: DataTypes.STRING(10),
      allowNull: false,
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    updated_at: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize,
    tableName: "countries",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
  }
);

export default Countries;
