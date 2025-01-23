import { DataTypes, Model } from "sequelize";
import { StateAttributes, StateCreationAttributes } from "./types";
import sequelize from "@config/db";
import Country from "@models/countries";
import Cities from "@models/cities";

class States
  extends Model<StateAttributes, StateCreationAttributes>
  implements StateAttributes
{
  public id!: number;
  public uuid!: string;
  public name!: string;
  public abbreviation!: string;
  public country_id!: number;
  public active!: boolean;
  public readonly created_at!: Date;
  public readonly updated_at!: Date;

  public static associate() {
    States.hasMany(Cities, {
      foreignKey: "state_id",
      as: "cities",
    });

    States.belongsTo(Country, {
      foreignKey: "country_id",
      as: "country",
    });
  }
}

States.init(
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
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    abbreviation: {
      type: DataTypes.STRING(10),
      allowNull: false,
    },
    country_id: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: true,
    },
    active: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    updated_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize,
    tableName: "states",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
  }
);

export default States;
