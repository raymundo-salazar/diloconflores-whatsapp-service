import { ApiController } from "@controllers/ApiController";
import {
  createStateSchema,
  updateStateSchema,
  deleteCitySchema,
  createCitySchema,
  setCountrySchema,
  deleteCountrySchema,
} from "./schema";
import States from "@models/states";

class StateController extends ApiController<States> {
  protected model = States;
  protected entity = "states";
  protected createSchema = createStateSchema;
  protected updateSchema = updateStateSchema;
  protected deleteAssociationSchema = {
    cities: deleteCitySchema,
  };
  protected createAssociationSchema = {
    cities: createCitySchema,
    country: setCountrySchema,
  };
}

export default new StateController();
