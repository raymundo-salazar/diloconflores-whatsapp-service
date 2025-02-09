import { Router } from "express"
import health from "./health"
import Whatsapp from "./whatsapp"

const routes = Router()

routes.use("/health", health)
routes.use("/", Whatsapp)

export default routes
