import Joi from "joi";

// public referral_code?: string;
// public first_name!: string;
// public last_name!: string;
// public email!: string;
// public password!: string;
// public phone?: string;
// public birth_date?: Date;
// public city_id?: number;
// public state_id?: number;
// public active?: boolean;

export const createUserSchema = Joi.object({
  referral_code: Joi.string().optional(),
  first_name: Joi.string().required(),
  last_name: Joi.string().required(),
  email: Joi.string().email().required(),
  password: Joi.string()
    .min(8)
    .max(128)
    .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/)
    .message("api.errors.create_users.password_pattern")
    .required(),
  phone: Joi.string().optional(),
  birth_date: Joi.date().optional(),
  city_id: Joi.number().optional(),
  state_id: Joi.number().optional(),
  active: Joi.boolean().optional(),
});

export const updateUserSchema = Joi.object({
  first_name: Joi.string().optional(),
  last_name: Joi.string().optional(),
  birth_date: Joi.date().optional(),
  city_id: Joi.number().optional(),
  state_id: Joi.number().optional(),
  active: Joi.boolean().optional(),
}).min(1);
