import { Request, Response, NextFunction } from "express"
import { ApiController } from "@controllers/ApiController"
import { Roles, Sessions } from "@models/index"
import { AuthError, NotFoundError } from "@helpers/errors"
import Users from "@models/users"
import { verify } from "jsonwebtoken"
import { TokenJwtPayload } from "@controllers/ApiController/types"
import { avoidPaths } from "./constants"
import { convertPermissionToRegex } from "@helpers/auth"
const { JWT_SECRET = "", REFRESH_TOKEN_SECRET = "" } = process.env

class AuthController extends ApiController<Sessions> {
	protected model = Sessions
	protected entity = "session"

	public validateToken = async (req: Request, res: Response, next: NextFunction) => {
		if (avoidPaths.find(path => path.path === req.path && path.method === req.method)) return next()

		try {
			if (req.headers.authorization?.split(" ")[0] !== "Bearer")
				throw new AuthError(req.t("api.errors.unathorized_bearer"))

			const token = req.headers.authorization?.split(" ")[1]
			if (!token) throw new AuthError(req.t("api.errors.unathorized_token"))

			const session = await this.model.findOne({
				where: { access_token_hash: token },
				include: [{ model: Users, as: "user" }],
			})
			if (!session) throw new AuthError(req.t("api.errors.unathorized_token"))

			const decoded = (await verify(session.access_token, JWT_SECRET)) as TokenJwtPayload
			const fingerprint = this.getFingerprint(req, decoded.user)

			if (decoded.fingerprint !== fingerprint)
				throw new AuthError(req.t("api.errors.unathorized_fingerprint"))

			if (!session.user) throw new NotFoundError(req.t("api.errors.user_not_found"))
			const user = await Users.findByPk(session.user?.id, {
				include: [
					{
						model: Roles,
						as: "roles",
						include: ["permissions"],
					},
				],
			})

			let hasPermission = false
			user?.roles?.map(role => {
				const permissions = role.permissions
					?.filter(p => p.method?.toUpperCase() === req.method.toUpperCase())
					.map(permission => convertPermissionToRegex(permission.path as string))
				hasPermission =
					permissions?.some(regex => regex.test(req.path.replace("/api", ""))) ?? false
			})

			if (!hasPermission) throw new AuthError(req.t("api.errors.forbidden"), 403)

			req.user = session.user
			req.session = session
			next()
		} catch (error: any) {
			if (["invalid signature", "jwt expired"].includes(error.message))
				error = new AuthError(req.t("api.errors.unathorized_token"))
			next(error)
		}
	}
}

export default new AuthController()
