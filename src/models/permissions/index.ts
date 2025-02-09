import { DataTypes, Model } from "sequelize"
import sequelize from "@config/db"
import RolePermission from "@models/rolePermissions"
import { PermissionAttributes, PermissionCreationAttributes } from "./types"

class Permission
	extends Model<PermissionAttributes, PermissionCreationAttributes>
	implements PermissionAttributes
{
	public id!: number
	public code!: string
	public name!: string
	public description!: string
	public readonly created_at!: Date
	public readonly updated_at!: Date

	public static associate() {
		const Role = require("@models/roles").default
		Permission.belongsToMany(Role, {
			through: RolePermission,
			foreignKey: "permission_id",
			as: "permission_roles",
		})
	}
}

Permission.init(
	{
		id: {
			type: DataTypes.INTEGER.UNSIGNED,
			autoIncrement: true,
			primaryKey: true,
		},
		code: {
			type: DataTypes.STRING(50),
			allowNull: true,
			unique: true,
		},
		name: {
			type: DataTypes.STRING(50),
			allowNull: false,
			unique: true,
		},
		description: {
			type: DataTypes.TEXT,
			allowNull: false,
		},
		table: {
			type: DataTypes.STRING(50),
			allowNull: true,
		},
		action_template: {
			type: DataTypes.TEXT,
			allowNull: true,
		},
		path: {
			type: DataTypes.STRING(255),
			allowNull: true,
		},
		method: {
			type: DataTypes.ENUM("POST", "GET", "PUT", "DELETE"),
			allowNull: true,
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
		tableName: "permissions",
		timestamps: true,
		createdAt: "created_at",
		updatedAt: "updated_at",
		hooks: {
			beforeCreate: (permission: Permission) => {
				if (permission.getDataValue("code")) return
				permission.setDataValue(
					"code",
					permission.getDataValue("name").toUpperCase().replace(/\s/g, "_")
				)
			},
		},
	}
)

export default Permission
