import Joi from "joi";

export const roleSchema = Joi.object({
  name: Joi.string().max(50).required(),
  description: Joi.string().max(255).required(),
  code: Joi.string().max(50),
});

export const updateRoleSchema = Joi.object({
  name: Joi.string().max(50),
  description: Joi.string().max(255),
  code: Joi.string().max(50),
}).min(1);

export const rolePermissionSchema = Joi.object({
  permissions: Joi.array()
    .items(
      Joi.object({
        id: Joi.number().optional(),
        code: Joi.string().optional(),
        scope: Joi.string().valid("global", "own", "branch").required(),
      }).xor("id", "code")
    )
    .required(),
});

export const deleteRolePermissionSchema = Joi.object({
  permissions: Joi.array()
    .items(
      Joi.object({
        id: Joi.number().optional(),
        code: Joi.string().optional(),
      }).xor("id", "code")
    )
    .required(),
});
