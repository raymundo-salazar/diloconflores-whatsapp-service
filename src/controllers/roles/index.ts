import { ApiController } from "@controllers/ApiController";
import { Role } from "@models/index";
import { updateRoleSchema, roleSchema } from "./schema";

class RolesController extends ApiController<Role> {
  protected model = Role;
  protected entity = "roles";
  protected createSchema = roleSchema;
  protected updateSchema = updateRoleSchema;
}

export default new RolesController();
