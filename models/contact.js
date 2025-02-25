const { Schema, model } = require("mongoose");
const Joi = require("joi");
const { handleMongooseError } = require("../helpers");

const contactSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Set name for contact"],
    },
    email: {
      type: String,
    },
    phone: {
      type: String,
    },
    favorite: {
      type: Boolean,
      default: false,
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: "user",
    },
  },
  { versionKey: false, timestamps: true }
);

contactSchema.post("save", handleMongooseError);

const Contact = model("contact", contactSchema);

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
  favorite: Joi.boolean(),
}).messages({ "any.required": "missing required {#label} field" });

const updateFavoriteSchema = Joi.object({
  favorite: Joi.boolean().required(),
}).messages({ "any.required": "missing field favorite" });

const notEmptySchema = Joi.object({}).unknown(true).min(1).messages({
  "object.min": "missing fields",
});

const getAllQuerySchemaFavorite = Joi.object({
  favorite: Joi.boolean(),
}).unknown(true);

const getAllQuerySchemaPagination = Joi.object({
  page: Joi.number().min(1),
  limit: Joi.number().min(1),
}).unknown(true);

const schemas = {
  addContactSchema,
  notEmptySchema,
  updateFavoriteSchema,
  getAllQuerySchemaFavorite,
  getAllQuerySchemaPagination,
};

module.exports = { Contact, schemas };
