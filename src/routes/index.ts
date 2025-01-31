import { Router } from "express";
import users from "./users";
import roles from "./roles";
import permissions from "./permissions";
import health from "./health";
import auth from "./auth";
import countries from "./countries";
import states from "./states";
import cities from "./cities";
import actionTypes from "./actionTypes";
import entityTypes from "./entityTypes";
import activityLogs from "./activityLogs";

const routes = Router();

routes.use("/health", health);
routes.use("/auth", auth);

routes.use("/roles", roles);
routes.use("/permissions", permissions);
routes.use("/users", users);

routes.use("/countries", countries);
routes.use("/states", states);
routes.use("/cities", cities);

routes.use("/action-types", actionTypes);
routes.use("/entity-types", entityTypes);
routes.use("/activity-logs", activityLogs);

export default routes;
