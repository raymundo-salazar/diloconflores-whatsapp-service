import Joi from "joi";

export const createCitiesSchema = Joi.object({
  name: Joi.string().required(),
  state_id: Joi.number().required(),
  active: Joi.boolean(),
});

export const updateCitiesSchema = Joi.object({
  name: Joi.string(),
  state_id: Joi.number(),
  active: Joi.boolean(),
}).min(1);
