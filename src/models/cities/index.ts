import { DataTypes, Model } from "sequelize";
import { CityAttributes, CityCreationAttributes } from "./types";
import sequelize from "@config/db";
import States from "@models/states";

class Cities extends Model<CityAttributes, CityCreationAttributes> implements CityAttributes {
  public id!: number;
  public uuid!: string;
  public name!: string;
  public state_id!: number;
  public active!: boolean;
  public readonly created_at!: Date;
  public readonly updated_at!: Date;

  public static associate() {
    Cities.belongsTo(States, {
      foreignKey: "state_id",
      as: "state",
    });
  }
}

Cities.init(
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
    state_id: {
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
    tableName: "cities",
    timestamps: false,
  }
);

export default Cities;
