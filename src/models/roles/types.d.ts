import { PermissionAttributes } from "@models/permissions/types"
import { Optional } from "sequelize"

export interface RoleAttributes {
	id: number
	name: string
	code: string
	description: string
	active: boolean
	permissions?: PermissionAttributes[]
	created_at?: Date
	updated_at?: Date
}

export interface RoleCreationAttributes
	extends Optional<RoleAttributes, "id" | "created_at" | "updated_at"> {}
