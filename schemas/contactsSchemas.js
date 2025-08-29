import Joi from "joi";

export const createContactSchema = Joi.object({
  name: Joi.string().trim().min(3).max(30).required(),
  email: Joi.string().trim().email().required(),
  phone: Joi.string().trim().min(3).required()
});

export const updateContactSchema = Joi.object({
  name: Joi.string().trim().min(3).max(30),
  email: Joi.string().trim().email(),
  phone: Joi.string().trim().min(3)
}).min(1);

export const updateStatusSchema = Joi.object({
  favorite: Joi.boolean().required()
});