import { Request, Response, NextFunction } from "express";

import { successResponse } from "@helpers/response";
import { NotFoundError, CreationError, MissingParametersError } from "@helpers/errors";
import { SetStateToCountryBody } from "./types";
import { Op } from "sequelize";
import Countries from "@models/countries";
import States from "@models/states";
import { processFields } from "@helpers/db/processSubQuery";
import { ApiController } from "@controllers/ApiController";
import { setStateSchema, createCountrySchema, updateCountrySchema } from "./schema";
import { ObjectSchema } from "joi";

class CountriesController extends ApiController<Countries> {
  protected model = Countries;
  protected entity = "countries";
  protected createSchema = createCountrySchema;
  protected updateSchema = updateCountrySchema;
  protected deleteAssociationSchema = {
    states: setStateSchema,
  };
  protected createAssociationSchema = {
    states: setStateSchema,
  };
}

export default new CountriesController();
