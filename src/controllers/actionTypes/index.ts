import { ApiController } from "@controllers/ApiController";
import { ActionTypes } from "@models/index";

class ActionTypesController extends ApiController<ActionTypes> {
  protected model = ActionTypes;
  protected entity = "actionType";
}

export default new ActionTypesController();
