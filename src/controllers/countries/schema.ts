import Joi from "joi";

export const setStateSchema = Joi.object({
  states: Joi.array()
    .items(
      Joi.object({
        id: Joi.number().required(),
      })
    )
    .min(1)
    .required(),
});

export const createCountrySchema = Joi.object({
  name: Joi.string().required(),
  abbreviation: Joi.string().required(),
  area_code: Joi.string().required(),
  active: Joi.boolean(),
});

export const updateCountrySchema = Joi.object({
  name: Joi.string(),
  abbreviation: Joi.string(),
  area_code: Joi.string(),
  active: Joi.boolean(),
}).min(1);
