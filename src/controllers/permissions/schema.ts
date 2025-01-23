import Joi from "joi";

export const permissionSchema = Joi.object({
  name: Joi.string().max(50).required(),
  description: Joi.string().max(255).required(),
  code: Joi.string().max(50),
});

export const updatePermissionSchema = Joi.object({
  name: Joi.string().max(50),
  description: Joi.string().max(255),
  code: Joi.string().max(50),
});
