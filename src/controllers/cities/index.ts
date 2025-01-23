import { ApiController } from "@controllers/ApiController";
import Cities from "@models/cities";
import { createCitiesSchema, updateCitiesSchema } from "./schema";

class CitiesController extends ApiController<Cities> {
  protected model = Cities;
  protected entity = "cities";
  protected createSchema = createCitiesSchema;
  protected updateSchema = updateCitiesSchema;
}

export default new CitiesController();
