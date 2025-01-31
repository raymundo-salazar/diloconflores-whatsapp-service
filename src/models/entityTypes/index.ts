import sequelize from "@config/db";
import { DataTypes, Model } from "sequelize";
import { EntityTypeAttributes, EntityTypeCreationAttributes } from "./types";
import { ActionTypeAttributes } from "@models/actionTypes/types";
import ActionTypes from "@models/actionTypes";

class EntityTypes
  extends Model<EntityTypeAttributes, EntityTypeCreationAttributes>
  implements EntityTypeAttributes
{
  public id!: number;
  public name!: string;
  public description!: string;
  public active!: boolean;
  public readonly created_at!: Date;
  public readonly updated_at!: Date;

  public static associate() {
    EntityTypes.hasMany(ActionTypes, {
      foreignKey: "entity_type_id",
      as: "action-types",
    });
  }
}

EntityTypes.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING,
      allowNull: false,
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
    tableName: "entity_types",
    timestamps: true,
    underscored: true,
  }
);

export default EntityTypes;
