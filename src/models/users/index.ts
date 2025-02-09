import { Model, DataTypes } from "sequelize"
import sequelize from "@config/db"
import { UserAttributes, UserCreationAttributes } from "./types"
import UserRole from "@models/userRoles"
import Role from "@models/roles"
import bcrypt from "bcrypt"
import { RoleAttributes } from "@models/roles/types"

const { PASSWORD_ROUNDS: _PASSWORD_ROUNDS } = process.env
const PASSWORD_ROUNDS = _PASSWORD_ROUNDS ? parseInt(_PASSWORD_ROUNDS) : 12

class Users extends Model<UserAttributes, UserCreationAttributes> implements UserAttributes {
	public id!: number
	public uuid!: string
	public referral_code?: string
	public referred_by?: number
	public first_name!: string
	public last_name!: string
	public full_name!: string
	public email!: string
	public password!: string
	public phone?: string
	public birth_date?: Date
	public city_id?: number
	public state_id?: number
	public total_spent?: number
	public shipping_address_count?: number
	public billing_address_count?: number
	public purchase_count?: number
	public last_curchase?: Date
	public last_login?: Date
	public device_language_code?: string
	public manual_language_code?: string
	public language_code?: string
	public active?: boolean
	public deleted_at?: Date
	public deleted_by?: number
	public readonly created_at!: Date
	public readonly updated_at!: Date
	public readonly roles?: RoleAttributes[]

	public static associate() {
		Users.belongsToMany(Role, {
			through: {
				model: UserRole,
			},
			foreignKey: "user_id",
			otherKey: "role_id",
			as: "roles",
		})
	}
}

Users.init(
	{
		id: {
			type: DataTypes.INTEGER.UNSIGNED,
			autoIncrement: true,
			primaryKey: true,
		},
		uuid: {
			type: DataTypes.STRING(36),
			allowNull: false,
			unique: true,
			defaultValue: DataTypes.UUIDV4,
		},
		referral_code: {
			type: DataTypes.STRING(20),
			allowNull: true,
		},
		referred_by: {
			type: DataTypes.INTEGER,
			allowNull: true,
		},
		first_name: {
			type: DataTypes.STRING(50),
			allowNull: false,
		},
		last_name: {
			type: DataTypes.STRING(50),
			allowNull: false,
		},
		full_name: {
			type: DataTypes.STRING(100),
			allowNull: true,
		},
		email: {
			type: DataTypes.STRING(100),
			allowNull: false,
			unique: true,
		},
		password: {
			type: DataTypes.STRING(255),
			allowNull: false,
		},
		phone: {
			type: DataTypes.STRING(20),
		},
		birth_date: {
			type: DataTypes.DATE,
		},
		city_id: {
			type: DataTypes.INTEGER,
		},
		state_id: {
			type: DataTypes.INTEGER,
		},
		total_spent: {
			type: DataTypes.DECIMAL(10, 2),
			defaultValue: 0,
		},
		shipping_address_count: {
			type: DataTypes.INTEGER,
			defaultValue: 0,
		},
		billing_address_count: {
			type: DataTypes.INTEGER,
			defaultValue: 0,
		},
		purchase_count: {
			type: DataTypes.INTEGER,
			defaultValue: 0,
		},
		last_purchase: {
			type: DataTypes.DATE,
			allowNull: true,
		},
		last_login: {
			type: DataTypes.DATE,
			allowNull: true,
		},
		device_language_code: {
			type: DataTypes.STRING(5),
			defaultValue: "en",
		},
		manual_language_code: {
			type: DataTypes.STRING(5),
		},
		language_code: {
			type: DataTypes.STRING(5),
		},
		active: {
			type: DataTypes.BOOLEAN,
			defaultValue: true,
		},
		deleted_at: {
			type: DataTypes.DATE,
		},
		deleted_by: {
			type: DataTypes.INTEGER,
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
		tableName: "users",
		timestamps: false,
		hooks: {
			beforeCreate: async user => {
				user.password = await bcrypt.hash(user.password, PASSWORD_ROUNDS)
			},
			beforeUpdate: async user => {
				if (user.changed("password")) {
					user.password = await bcrypt.hash(user.password, PASSWORD_ROUNDS)
				}
			},
			afterUpdate: async user => {
				if (user.changed("first_name") || user.changed("last_name")) {
					user.full_name = `${user.first_name} ${user.last_name}`
				}
			},
		},
	}
)

export default Users
