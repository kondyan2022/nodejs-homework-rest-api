const Joi = require("joi");

const {
  listContacts,
  getContactById,
  addContact,
  removeContact,
  updateContact,
} = require("../models/contacts");
const { HttpError, ctrlWrapper } = require("../helpers");

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
}).messages({ "any.required": "missing required name field" });

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

const getAll = async (req, res, next) => {
  const contacts = await listContacts();
  res.json(contacts);
};

const getById = async (req, res, next) => {
  const { contactId } = req.params;
  const contact = await getContactById(contactId);
  if (!contact) {
    throw HttpError(404, "Not found");
  }
  res.json(contact);
};

const add = async (req, res, next) => {
  const { error } = addContactSchema.validate(req.body);
  if (error) {
    throw HttpError(400, error.message);
  }
  const contact = await addContact(req.body);
  res.status(201).json(contact);
};

const remove = async (req, res, next) => {
  const { contactId } = req.params;
  const contact = await removeContact(contactId);
  if (!contact) {
    throw HttpError(404, "Not found");
  }
  res.json({ message: "contact deleted" });
};

const update = async (req, res, next) => {
  const { error } = updateContactSchema.validate(req.body);
  if (error) {
    console.log(error);
    throw HttpError(400, error.message);
  }
  const { contactId } = req.params;
  const contact = await updateContact(contactId, req.body);
  if (!contact) {
    throw HttpError(404, "Not found");
  }
  res.json(contact);
};

module.exports = {
  getAll: ctrlWrapper(getAll),
  getById: ctrlWrapper(getById),
  add: ctrlWrapper(add),
  remove: ctrlWrapper(remove),
  update: ctrlWrapper(update),
};
