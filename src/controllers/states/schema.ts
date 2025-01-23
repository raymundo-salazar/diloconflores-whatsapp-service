import Joi from "joi";

export const createStateSchema = Joi.object({
  name: Joi.string().required(),
  abbreviation: Joi.string().required(),
  active: Joi.boolean(),
  country_id: Joi.number(),
});

export const updateStateSchema = Joi.object({
  name: Joi.string(),
  abbreviation: Joi.string(),
  active: Joi.boolean(),
  country_id: Joi.number(),
}).min(1);

export const deleteCitySchema = Joi.object({
  cities: Joi.array()
    .items(
      Joi.object({
        id: Joi.number().required(),
      })
    )
    .required()
    .min(1),
});

export const createCitySchema = Joi.object({
  cities: Joi.array()
    .items(
      Joi.object({
        id: Joi.number().required(),
      })
    )
    .required()
    .min(1),
});

export const setCountrySchema = Joi.object({
  country: Joi.object()
    .keys({
      id: Joi.number().required(),
    })
    .required(),
});

export const deleteCountrySchema = Joi.object({
  country: Joi.object()
    .keys({
      id: Joi.number().required(),
    })
    .required(),
});
