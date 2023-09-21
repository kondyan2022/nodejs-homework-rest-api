const { Contact } = require("../models/contact");

const { HttpError, ctrlWrapper } = require("../helpers");

const getAll = async (req, res, next) => {
  const { _id: owner } = req.user;
  const filter = { owner };
  const { favorite = false, page = 1, limit = 10 } = req.query;
  if (favorite) {
    filter.favorite = true;
  }
  const skip = (page - 1) * limit;
  const contacts = await Contact.find(filter, "-createdAt -updatedAt", {
    skip,
    limit,
  });
  const totalPage = Math.ceil((await Contact.countDocuments(filter)) / limit);
  res.json({
    page,
    limit,
    totalPage,
    result: contacts,
  });
};

const getById = async (req, res, next) => {
  const { contactId } = req.params;
  const contact = await Contact.findById(contactId, "-createdAt -updatedAt");
  if (!contact) {
    throw HttpError(404, "Not found");
  }
  res.json(contact);
};

const add = async (req, res, next) => {
  const { _id: owner } = req.user;
  const contact = await Contact.create({ ...req.body, owner });
  res.status(201).json(contact);
};

const remove = async (req, res, next) => {
  const { contactId } = req.params;
  const contact = await Contact.findByIdAndRemove(contactId);
  if (!contact) {
    throw HttpError(404, "Not found");
  }
  res.json({ message: "contact deleted" });
};

const update = async (req, res, next) => {
  const { contactId } = req.params;
  const contact = await Contact.findByIdAndUpdate(contactId, req.body, {
    new: true,
    select: "-createdAt -updatedAt",
  });
  if (!contact) {
    throw HttpError(404, "Not found");
  }
  res.json(contact);
};

const updateStatusContact = async (req, res, next) => {
  const { contactId } = req.params;
  const contact = await Contact.findByIdAndUpdate(contactId, req.body, {
    new: true,
    select: "-createdAt -updatedAt",
  });
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
  updateStatusContact: ctrlWrapper(updateStatusContact),
  update: ctrlWrapper(update),
};
