import express from "express"
import dotenv from "dotenv"
import middleware from "i18next-http-middleware"
import i18next from "../locales/i18n"

import routes from "@routes/index"
import { errorHandler } from "@middleware/errorHandler"
import { responseHandler } from "@middleware/responseHandler"
import { notFoundHandler } from "@middleware/notFoundHandler"
import AuthController from "@controllers/auth"
import "@services/whatsappService"
import WhatsappSessions from "@models/whatsapp/sessions"
import { initializeWhatsapp } from "@services/whatsappService"
import { Client } from "whatsapp-web.js"

dotenv.config()

const app = express()

app.use(express.json())
app.use(middleware.handle(i18next))
app.use(AuthController.validateToken)
app.use((req, res, next) => {
	req.whatsapp = app.locals.whatsapp // Inyecta la información en req
	next()
})

// ADMIN ROUTES
app.use("/api", routes)

app.use(notFoundHandler)
app.use(responseHandler)
app.use(errorHandler)

const PORT = process.env.PORT || 3000
app.listen(PORT, async () => {
	console.log(`Server running on http://localhost:${PORT}`)

	if (process.env.ENABLE_WHATSAPP_SERVICE !== "true") return
	const sessions = await WhatsappSessions.findAll()
	if (sessions.length > 0) console.log(`>>> Initializing Whatsapp sessions: ${sessions.length}`)
	sessions.forEach(session => {
		initializeWhatsapp(
			session.session_name.replace("RemoteAuth-", ""),
			`${session.phone_number?.area_code}1${session.phone_number?.phone_number}`,
			async (error, response: any, client: Client) => {
				if (error) return
				if (response.status !== "ready") return

				console.log(response.status)
				console.log(`Session ${session.session_name} is active`)
				if (!app.locals.whatsapp) app.locals.whatsapp = {}
				app.locals.whatsapp[session.session_name] = client
			},
			true
		)
	})
})
