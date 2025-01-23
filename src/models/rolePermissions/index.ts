import { DataTypes, Model } from "sequelize";
import {
  RolePermissionAttributes,
  RolePermissionCreationAttributes,
} from "./types";
import sequelize from "@config/db";
import Role from "@models/roles";
import Permission from "@models/permissions";

class RolePermission
  extends Model<RolePermissionAttributes, RolePermissionCreationAttributes>
  implements RolePermissionAttributes
{
  public id!: number;
  public role_id!: number;
  public permission_id!: number;
  public scope!: "global" | "own" | "branch";
  public readonly granted_at!: Date;

  public static associate() {
    RolePermission.belongsTo(Permission, {
      foreignKey: "permission_id",
      as: "permission",
    });
  }
}

RolePermission.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    role_id: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      references: {
        model: Role,
        key: "id",
      },
      onDelete: "CASCADE",
    },
    permission_id: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      references: {
        model: Permission,
        key: "id",
      },
      onDelete: "CASCADE",
    },
    scope: {
      type: DataTypes.ENUM("global", "own", "branch"),
      defaultValue: "own",
      allowNull: false,
    },
    granted_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize,
    tableName: "role_permissions",
    timestamps: false,
  }
);

export default RolePermission;
