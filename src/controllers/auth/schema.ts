import Joi from "joi";

export const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string()
    .min(8)
    .max(128)
    .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/)
    .message("api.errors.create_users.password_pattern")
    .required(),
});

export const refreshTokenSchema = Joi.object({
  refresh_token: Joi.string().required(),
});
