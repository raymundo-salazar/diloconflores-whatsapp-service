import { Router } from "express";
import users from "./users";
import roles from "./roles";
import permissions from "./permissions";
import health from "./health";
import auth from "./auth";
import countries from "./countries";
import states from "./states";
import cities from "./cities";

const routes = Router();

routes.use("/health", health);
routes.use("/auth", auth);

routes.use("/roles", roles);
routes.use("/permissions", permissions);
routes.use("/users", users);

routes.use("/countries", countries);
routes.use("/states", states);
routes.use("/cities", cities);

export default routes;
