const Joi = require("joi");

const addContactSchema = Joi.object({
  name: Joi.string()
    .min(2)
    .pattern(/^[a-zA-Zа-яА-Я]+(([' -][a-zA-Zа-яА-Я ])?[a-zA-Zа-яА-Я]*)*$/)
    .required()
    .messages({ "string.pattern.base": "invalid characters in the name" }),
  email: Joi.string().email().required(),
  phone: Joi.string()
    .pattern(
      /^[+(\d]?\d{1,4}?[-.\s]?\(?\d{1,3}?\)?[-.\s]?\d{1,4}[-.\s]?\d{1,4}[-.\s]?\d{1,9}$/
    )
    .required()
    .messages({ "string.pattern.base": "invalid phone number" }),
}).messages({ "any.required": "missing required {#label} field" });

const updateContactSchema = Joi.object({
  name: Joi.string()
    .min(2)
    .pattern(/^[a-zA-Zа-яА-Я]+(([' -][a-zA-Zа-яА-Я ])?[a-zA-Zа-яА-Я]*)*$/)
    .messages({ "string.pattern.base": "invalid characters in name" }),
  email: Joi.string().email(),
  phone: Joi.string()
    .pattern(
      /^[+(\d]?\d{1,4}?[-.\s]?\(?\d{1,3}?\)?[-.\s]?\d{1,4}[-.\s]?\d{1,4}[-.\s]?\d{1,9}$/
    )
    .messages({ "string.pattern.base": "invalid phone number" }),
})
  .min(1)
  .messages({ "object.min": "missing fields" });

module.exports = { addContactSchema, updateContactSchema };
