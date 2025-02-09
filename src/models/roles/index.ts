import { Model, DataTypes } from "sequelize"
import sequelize from "@config/db"
import RolePermission from "@models/rolePermissions"
import { RoleAttributes, RoleCreationAttributes } from "./types"
import { PermissionAttributes } from "@models/permissions/types"
import Permission from "@models/permissions"

class Roles extends Model<RoleAttributes, RoleCreationAttributes> implements RoleAttributes {
	public id!: number
	public name!: string
	public code!: string
	public description!: string
	public active!: boolean
	public readonly permissions?: PermissionAttributes[]

	public readonly created_at!: Date
	public readonly updated_at!: Date

	public static associate() {
		Roles.belongsToMany(Permission, {
			through: {
				model: RolePermission,
			},
			foreignKey: "role_id",
			as: "permissions",
		})
	}
}

Roles.init(
	{
		id: {
			type: DataTypes.INTEGER.UNSIGNED,
			autoIncrement: true,
			primaryKey: true,
		},
		name: {
			type: DataTypes.STRING(50),
			allowNull: false,
			unique: true,
		},
		code: {
			type: DataTypes.STRING(50),
			allowNull: true,
			unique: true,
		},
		description: {
			type: DataTypes.TEXT,
			allowNull: false,
		},
		active: {
			type: DataTypes.BOOLEAN,
			defaultValue: true,
		},
		created_at: {
			type: DataTypes.DATE,
			defaultValue: DataTypes.NOW,
		},
		updated_at: {
			type: DataTypes.DATE,
			defaultValue: DataTypes.NOW,
		},
	},
	{
		sequelize,
		tableName: "roles",
		timestamps: false,
		hooks: {
			beforeCreate: (role, options) => {
				if (role.getDataValue("code")) return
				role.setDataValue("code", role.getDataValue("name").toUpperCase().replace(/\s/g, "_"))
			},
		},
	}
)

export default Roles
