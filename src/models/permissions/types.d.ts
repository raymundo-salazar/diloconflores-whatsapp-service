import { Optional } from "sequelize"

export interface PermissionAttributes {
	id: number
	code: string
	name: string
	description: string
	table?: string
	action_template?: string
	path?: string
	method?: string
	created_at?: Date
	updated_at?: Date
	regex?: RegExp
}

export interface PermissionCreationAttributes
	extends Optional<PermissionAttributes, "id" | "created_at" | "updated_at"> {}
