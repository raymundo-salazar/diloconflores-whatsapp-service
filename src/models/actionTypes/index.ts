import sequelize from "@config/db";
import { DataTypes, Model } from "sequelize";
import { ActionTypeAttributes, ActionTypeCreationAttributes } from "./types";
import { PermissionAttributes } from "@models/permissions/types";
import Permission from "@models/permissions";

class ActionTypes
  extends Model<ActionTypeAttributes, ActionTypeCreationAttributes>
  implements ActionTypeAttributes
{
  public id!: number;
  public uuid!: string;
  public name!: string;
  public description!: string;
  public active!: boolean;
  public permission_id!: number;
  public readonly permission?: PermissionAttributes;
  public readonly created_at!: Date;
  public readonly updated_at!: Date;

  public static associate() {
    ActionTypes.belongsTo(Permission, {
      foreignKey: "permission_id",
      as: "permission",
    });
  }
}

ActionTypes.init(
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
    permission_id: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
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
    modelName: "action_types",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
  }
);

export default ActionTypes;
