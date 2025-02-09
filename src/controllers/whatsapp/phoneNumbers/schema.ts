import Joi from "joi";

export const CreateSchema = Joi.object({
  phone_number: Joi.string().min(10).max(10).required(),
  area_code: Joi.string()
    .regex(/^\d{2}$/)
    .required(),
  created_by: Joi.number().required(),
  session_name: Joi.string().required(),
});

export const UpdateSchema = Joi.object({
  phone_number: Joi.string(),
  area_code: Joi.string().regex(/^\d{2}$/),
});
