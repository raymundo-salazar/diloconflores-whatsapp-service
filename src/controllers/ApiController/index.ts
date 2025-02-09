require("dotenv").config()
import { Request, Response, NextFunction } from "express"
import { successResponse } from "@helpers/response"
import { CreationError, MissingParametersError, NotFoundError } from "@helpers/errors"
import { Association, Model, ModelStatic, Op } from "sequelize"
import { processFields } from "@helpers/db/processSubQuery"
import { calculateOffset, processInfo } from "@helpers/info"
import { processSearchParams } from "@helpers/db/where"
import { AttributesRelation, DeviceInfo, IncludeOptions } from "./types"
import { plural, singular } from "pluralize"
import Joi from "joi"
import { sign, SignOptions } from "jsonwebtoken"
import { createHash } from "crypto"
import useragent from "useragent"
import geoip from "geoip-lite"
const { JWT_SECRET = "", REFRESH_TOKEN_SECRET = "", GLOBAL_LANGUAGE = "en" } = process.env

export class ApiController<T extends Model> {
	protected methodsAllowed: string[] = ["GET", "POST", "PUT", "DELETE", "OPTIONS"]
	protected model!: ModelStatic<T>
	protected entity!: string
	protected association!: string
	protected associations?: IncludeOptions[]
	protected attributes!: AttributesRelation
	protected uniqueAttributes!: AttributesRelation
	protected schema!: Joi.ObjectSchema
	protected createSchema!: Joi.ObjectSchema
	protected updateSchema!: Joi.ObjectSchema
	protected createAssociationSchema: Record<string, Joi.ObjectSchema> = {}
	protected deleteAssociationSchema: Record<string, Joi.ObjectSchema> = {}
	protected fieldsAssociations!: Record<string, string[]>

	public get logicalDelete() {
		return this.model.options.paranoid
	}

	public getInclude = (
		query: Record<string, any>,
		attributes: Record<string, any>,
		model: ModelStatic<T> = this.model
	) => {
		const associations: IncludeOptions[] = Object.keys(query)
			.map(key => {
				let associate = Object.entries(model.associations)?.find(
					([_, association]) => association.as === key
				) as IncludeOptions
				return associate
			})
			.filter(Boolean)
			.map((obj: any) => {
				const associate = obj[1] as Association
				return {
					model: associate.target,
					as: associate.as,
					attributes: attributes[associate.as],
					foreignKey: associate.foreignKey,
					associationType: associate.associationType,
				}
			})
		const include = associations.length > 0 ? associations : undefined
		return include
	}

	public options = async (req: Request, res: Response) => {
		res.setHeader("Allow", this.methodsAllowed)
		successResponse(
			req,
			res,
			null,
			req.t("api.options_available", { methods: this.methodsAllowed.join(", ") }),
			200
		)
	}

	protected setCreationError = (error: any, req: Request) => {
		if (error.parent.code === "ER_DUP_ENTRY") {
			const sql = error.parent?.sql
			const type = error.errors[0].type.replace(/\s/g, "_").toUpperCase()
			const errors = error.errors.map((err: any) => ({
				type: err.type,
				message: err.message,
				field: err.path,
				value: err.value,
			}))
			error = new CreationError(req.t("api.errors.already_exists", { resource: this.entity }))
			error.sql = sql
			error.errors = errors
			error.database_code = type
		}
		return error
	}

	protected createAccessToken = (req: Request, user: string, expiresDate: Date) => {
		const now = Math.floor(Date.now() / 1000)
		const expiresIn = Math.floor(expiresDate.getTime() / 1000) - now
		const fingerprint = this.getFingerprint(req, user)

		const token = sign({ user, fingerprint }, JWT_SECRET, {
			expiresIn,
		})
		const hashedToken = createHash("sha256").update(token).digest("hex")
		return { token, hashedToken }
	}

	/**
	 *
	 * @param req Request
	 * @param userHash string
	 * @param expiresDate Date
	 * @returns object { refreshToken, hashedRefreshToken }
	 * @description Create a refresh token with the user and fingerprint
	 * data with 7 days more of expiration of session token.
	 */
	protected createRefreshToken = (req: Request, userHash: string, expiresDate: Date) => {
		expiresDate = new Date(expiresDate.getTime() + 7 * 24 * 60 * 60 * 1000)
		const now = Math.floor(Date.now() / 1000)
		const expiresIn = Math.floor(expiresDate.getTime() / 1000) - now

		const fingerprint = this.getFingerprint(req, userHash)
		const refreshToken = sign({ user: userHash, fingerprint }, REFRESH_TOKEN_SECRET, {
			expiresIn,
		})
		const hashedRefreshToken = createHash("sha256").update(refreshToken).digest("hex")
		return { refreshToken, hashedRefreshToken }
	}

	protected getDeviceInfo = (req: Request): DeviceInfo => {
		const agent = useragent.parse(req.headers["user-agent"])
		const clientIp = (req.headers["x-forwarded-for"] || req.socket.remoteAddress || "")
			.toString()
			.split(",")[0]
			.trim()
		const geo = geoip.lookup(clientIp)

		const deviceInfo: DeviceInfo = {
			ip: clientIp || "Unknown",
			deviceType: agent.device.family || "Unknown",
			os: agent.os.toString() || "Unknown",
			osVersion: agent.os.toVersion() || "Unknown",
			browser: agent.toAgent() || "Unknown",
			browserVersion: agent.toVersion() || "Unknown",
			language: req.headers["accept-language"] || GLOBAL_LANGUAGE,
			location: geo
				? `${geo.city || "Unknown"}, ${geo.region || "Unknown"}, ${geo.country || "Unknown"}`
				: "Unknown",
			userAgent: req.headers["user-agent"] || "Unknown",
		}

		return deviceInfo
	}

	protected getFingerprint = (req: Request, userUuid: string): string => {
		const deviceInfo = this.getDeviceInfo(req)
		const fingerprint = createHash("sha256")
			.update(`${deviceInfo.deviceType}-${deviceInfo.os}-${deviceInfo.browser}-${userUuid}`)
			.digest("hex")
		return fingerprint
	}

	public getAll = async (
		req: Request<Record<string, string>, {}, {}, any>,
		res: Response,
		next: NextFunction
	) => {
		try {
			const {
				limit: _limit,
				page: _page,
				offset: _offset,
				fields,
				search: _search,
				...query
			} = req.query
			const { limit, page, offset } = calculateOffset(_limit, _page, _offset)
			const attributes = processFields(fields, this.entity)
			const where = processSearchParams(_search, this.model)

			const include = this.getInclude(query, attributes)

			const totalRecords = await this.model.count({ where })
			const records = await this.model.findAll({
				attributes: attributes[this.entity],
				include,
				limit,
				offset,
				where,
			})

			const info = processInfo(page, records.length, totalRecords, limit, offset)

			successResponse(
				req,
				res,
				records,
				req.t("api.retrived_successfully", { resource: plural(this.entity) }),
				200,
				info
			)
		} catch (error: any) {
			if (error.resource) error.resource = this.entity
			next(error)
		}
	}

	public getById = async (
		req: Request<Record<string, string>, {}, {}, any>,
		res: Response,
		next: NextFunction
	) => {
		try {
			const { id } = req.params
			const { fields, ...query } = req.query
			const attributes = processFields(fields, this.entity)

			const include = this.getInclude(query, attributes)

			const record = await this.model.findByPk(id, {
				attributes: attributes[this.entity],
				include,
			})

			if (!record)
				throw new NotFoundError(
					req.t("api.errors.not_found", { resource: singular(this.entity), id }),
					this.entity
				)

			successResponse(
				req,
				res,
				record,
				req.t("api.retrived_successfully_with_id", {
					resource: singular(this.entity),
					id,
				})
			)
		} catch (error: any) {
			if (error.resource) error.resource = this.entity
			next(error)
		}
	}

	public setSchemaValidation = (schema: Joi.ObjectSchema) => {
		this.schema = schema
		return this
	}

	public setUniqueAttributes = (attributes: string[]) => {
		this.uniqueAttributes = attributes
		return this
	}

	public createRecord = async (
		req: Request<Record<string, string>, {}, any, any>,
		res: Response,
		next: NextFunction
	) => {
		try {
			const { body } = req

			if (this.createSchema) {
				const { error } = this.createSchema.validate(body)
				if (error) throw new MissingParametersError(error.message)
			}

			const record = await this.model.create({
				...body,
			})
			successResponse(
				req,
				res,
				record,
				req.t("api.created_successfully", { resource: singular(this.entity) }),
				201
			)
		} catch (error: any) {
			if (error.parent?.code === "ER_DUP_ENTRY") error = this.setCreationError(error, req)

			if (error.resource) error.resource = this.entity
			next(error)
		}
	}

	public updateRecord = async (
		req: Request<Record<string, string>, {}, any, any>,
		res: Response,
		next: NextFunction
	) => {
		try {
			const { id } = req.params
			const { body } = req

			if (this.updateSchema) {
				const { error } = this.updateSchema.validate(body)
				if (error) throw new MissingParametersError(error.message)
			}

			const record = await this.model.findByPk(id)
			if (!record)
				throw new NotFoundError(
					req.t("api.errors.not_found", { resource: this.entity, id }),
					this.entity
				)

			await record.update(body)
			successResponse(
				req,
				res,
				record,
				req.t("api.updated_successfully", { resource: this.entity })
			)
		} catch (error: any) {
			if (error.parent?.code === "ER_DUP_ENTRY") error = this.setCreationError(error, req)

			if (error.resource) error.resource = this.entity
			next(error)
		}
	}

	public deleteRecord = async (
		req: Request<Record<string, string>, {}, {}, any>,
		res: Response,
		next: NextFunction
	) => {
		try {
			const { id } = req.params
			const record = await this.model.findByPk(id)
			if (!record)
				throw new NotFoundError(
					req.t("api.errors.not_found", { resource: this.entity }),
					this.entity
				)

			if (this.logicalDelete) {
				await record.destroy()
			} else {
				await record.destroy({ force: true })
			}

			successResponse(req, res, null, req.t("api.deleted_successfully", { resource: this.entity }))
		} catch (error: any) {
			if (error.resource) error.resource = this.entity
			next(error)
		}
	}

	public deletedRecords = async (
		req: Request<Record<string, string>, {}, {}, any>,
		res: Response,
		next: NextFunction
	) => {
		try {
			const {
				limit: _limit,
				page: _page,
				offset: _offset,
				fields,
				search: _search = {},
				...query
			} = req.query
			const { limit, page, offset } = calculateOffset(_limit, _page, _offset)
			const attributes = processFields(fields, this.entity)

			_search.deleted_at = { ne: null }
			const where = processSearchParams(_search, this.model)

			const include = this.getInclude(query, attributes)

			const totalRecords = await this.model.count({ where })
			const records = await this.model.findAll({
				attributes: attributes[this.entity],
				include,
				limit,
				offset,
				where,
				paranoid: false,
			})

			const info = processInfo(page, records.length, totalRecords, limit, offset)

			successResponse(
				req,
				res,
				records,
				req.t("api.retrived_deleted_records_successfully", { resource: plural(this.entity) }),
				200,
				info
			)
		} catch (error: any) {
			if (error.resource) error.resource = this.entity
			next(error)
		}
	}

	public restoreRecord = async (
		req: Request<Record<string, string>, {}, {}, any>,
		res: Response,
		next: NextFunction
	) => {
		try {
			const { id } = req.params
			const record = await this.model.findByPk(id, { paranoid: false })
			if (!record)
				throw new NotFoundError(
					req.t("api.errors.not_found", { resource: this.entity }),
					this.entity
				)

			await record.restore()
			successResponse(
				req,
				res,
				record,
				req.t("api.restored_successfully", { resource: this.entity })
			)
		} catch (error: any) {
			if (error.resource) error.resource = this.entity
			next(error)
		}
	}

	public getModelAssociations = (): Record<string, IncludeOptions> => {
		if (!this.model.associations) {
			return {}
		}

		const associations: Record<string, IncludeOptions> = {}
		Object.keys(this.model.associations).forEach(key => {
			const association = this.model.associations[key]
			associations[association.as] = {
				model: association.target,
				as: association.as,
				foreignKey: association.foreignKey,
				associationType: association.associationType,
				through: (association as any)?.options?.through?.model,
			}
		})

		return associations
	}

	public getAssociation = async (
		req: Request<Record<string, string>, {}, {}, any>,
		res: Response,
		next: NextFunction
	) => {
		try {
			const { id, associationName } = req.params
			this.association = associationName

			const { limit: _limit, page: _page, offset: _offset, fields, search, ...query } = req.query
			let defaultFields
			if (!fields && this.fieldsAssociations?.[associationName])
				defaultFields = this.fieldsAssociations[associationName].join()

			const attributes = processFields(defaultFields ?? fields, this.association)
			const { limit, page, offset } = calculateOffset(_limit, _page, _offset)
			const where = processSearchParams(search, this.model)

			const associations = this.getModelAssociations()
			const association = associations[associationName]

			if (!association) {
				throw new NotFoundError(
					req.t("api.errors.association_not_found", {
						resource: this.entity,
						association: associationName,
					})
				)
			}

			const getAssociation = `get${this.association
				.replace(/^\w/g, char => char.toUpperCase())
				.replace(/\s/g, "")}`
			const countAssociation = `count${this.association
				.replace(/^\w/g, char => char.toUpperCase())
				.replace(/\s/g, "")}`

			const parentEntity: any = await this.model.findByPk(id)

			if (!parentEntity) {
				return res.status(404).json({
					message: req.t("api.errors.not_found", { resource: this.entity, id }),
				})
			}

			const associationModel = (this.model.associations[this.association] as any).target
			const include = this.getInclude(query, attributes, associationModel)
			const count = await parentEntity[countAssociation]?.()
			const response = await parentEntity[getAssociation]?.({
				include,
				where,
				attributes: attributes[this.association],
				limit,
				offset,
			})

			const info = Array.isArray(response)
				? processInfo(page, response.length, count, limit, offset)
				: undefined

			successResponse(
				req,
				res,
				response,
				req.t("api.retrived_successfully", { resource: associationName }),
				200,
				info
			)
		} catch (error) {
			next(error)
		}
	}

	public setAssociation = async (
		req: Request<Record<string, string>, {}, {}, any>,
		res: Response,
		next: NextFunction
	) => {
		try {
			const { id, associationName } = req.params
			const { body } = req
			this.association = associationName

			const { limit: _limit, page: _page, offset: _offset, fields } = req.query
			const attributes = processFields(fields, this.association)
			const { limit, page, offset } = calculateOffset(_limit, _page, _offset)

			const associations = this.getModelAssociations()
			const association = associations[associationName]

			if (!association) {
				throw new NotFoundError(
					req.t("api.errors.association_not_found", {
						resource: this.entity,
						association: associationName,
					})
				)
			}

			const parentEntity: any = await this.model.findByPk(id)
			if (!parentEntity)
				throw new NotFoundError(req.t("api.errors.not_found", { resource: this.entity }))

			if (this.createAssociationSchema[associationName]) {
				const { error } = this.createAssociationSchema[associationName].validate(body)
				if (error) throw new MissingParametersError(error.message)
			}

			const pluralAssociation = plural(associationName)
			const singularAssociation = singular(associationName)
			const belongsTo = association.associationType === "BelongsTo"
			const associationNameFn = belongsTo ? singularAssociation : pluralAssociation
			const addPrefix = belongsTo ? "set" : "add"

			const addAssociation = `${addPrefix}${associationNameFn
				.replace(/^\w/g, char => char.toUpperCase())
				.replace(/\s/g, "")}`
			const getAssociation = `get${associationNameFn
				.replace(/^\w/g, char => char.toUpperCase())
				.replace(/\s/g, "")}`
			const countAssociation = `count${associationNameFn
				.replace(/^\w/g, char => char.toUpperCase())
				.replace(/\s/g, "")}`

			const count = await parentEntity[countAssociation]?.()
			await parentEntity[addAssociation]?.(
				Array.isArray((body as any)[associationName])
					? (body as any)[associationName].map((item: any) => item.id)
					: (body as any)[associationName].id
			)

			const response = await parentEntity[getAssociation]?.({
				where: {
					id: {
						[Op.in]: Array.isArray((body as any)[associationName])
							? (body as any)[associationName].map((item: any) => item.id)
							: (body as any)[associationName].id,
					},
				},
				attributes: attributes[this.association],
				limit,
				offset,
			})

			const info = Array.isArray(response)
				? processInfo(page, response.length, count, limit, offset)
				: undefined

			successResponse(
				req,
				res,
				response,
				req.t("api.added_successfully", { resource: associationName }),
				200,
				info
			)
		} catch (error) {
			next(error)
		}
	}

	public deleteAssociation = async (
		req: Request<Record<string, string>, {}, {}, any>,
		res: Response,
		next: NextFunction
	) => {
		try {
			const { id, associationName } = req.params
			const { body } = req
			this.association = associationName

			const associations = this.getModelAssociations()
			const association = associations[associationName]

			if (!association) {
				throw new NotFoundError(
					req.t("api.errors.association_not_found", {
						resource: this.entity,
						association: associationName,
					})
				)
			}

			const parentEntity: any = await this.model.findByPk(id)
			if (!parentEntity)
				throw new NotFoundError(req.t("api.errors.not_found", { resource: this.entity }))

			if (this.deleteAssociationSchema[associationName]) {
				const { error } = this.deleteAssociationSchema[associationName].validate(body)
				if (error) throw new MissingParametersError(error.message)
			}

			if (association.associationType === "BelongsTo") {
				const addAssociation = `set${associationName
					.replace(/^\w/g, char => char.toUpperCase())
					.replace(/\s/g, "")}`

				await parentEntity[addAssociation]?.(null)
				successResponse(
					req,
					res,
					null,
					req.t("api.removed_successfully", { resource: associationName })
				)
			} else {
				const removeAssociation = `remove${associationName
					.replace(/^\w/g, char => char.toUpperCase())
					.replace(/\s/g, "")}`

				await parentEntity[removeAssociation]?.(
					(body as any)[associationName].map((item: any) => item.id)
				)

				successResponse(
					req,
					res,
					null,
					req.t("api.removed_successfully", { resource: associationName })
				)
			}
		} catch (error) {
			next(error)
		}
	}
}
