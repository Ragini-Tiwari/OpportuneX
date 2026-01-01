import Joi from "joi";
import { ROLES } from "../constants/index.js";

export const registerSchema = Joi.object({
    name: Joi.string().required().trim(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
    role: Joi.string().valid(...Object.values(ROLES)).default(ROLES.CANDIDATE),
    phone: Joi.string().allow('', null).optional(),
    company: Joi.string().allow('', null).optional(),
    location: Joi.string().allow('', null).optional(),
});

export const loginSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
});
