import { ApiController } from "@controllers/ApiController";
import { EntityTypes } from "@models/index";

class EntityTypesController extends ApiController<EntityTypes> {
  protected model = EntityTypes;
  protected entity = "entityTypes";
}

export default new EntityTypesController();
