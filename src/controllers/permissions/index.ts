import { ApiController } from "@controllers/ApiController";
import Permission from "@models/permissions";
import { permissionSchema, updatePermissionSchema } from "./schema";

class PermissionsController extends ApiController<Permission> {
  protected model = Permission;
  protected entity = "permissions";
  protected createSchema = permissionSchema;
  protected updateSchema = updatePermissionSchema;
}

export default new PermissionsController();
