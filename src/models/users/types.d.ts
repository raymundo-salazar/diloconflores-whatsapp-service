import { RoleAttributes } from "@models/roles/types"
import { Optional } from "sequelize"

export interface UserAttributes {
	id: number
	uuid: string
	referral_code?: string
	referred_by?: number
	first_name: string
	last_name: string
	full_name: string
	email: string
	password: string
	phone?: string
	birth_date?: Date
	city_id?: number
	state_id?: number
	total_spent?: number
	shipping_address_count?: number
	billing_address_count?: number
	purchase_count?: number
	last_purchase?: Date
	last_login?: Date
	device_language_code?: string
	manual_language_code?: string
	language_code?: string
	active?: boolean
	deleted_at?: Date
	deleted_by?: number
	created_at?: Date
	updated_at?: Date
	roles?: RoleAttributes[]
}

export interface UserCreationAttributes
	extends Optional<UserAttributes, "id" | "uuid" | "created_at" | "updated_at"> {}
