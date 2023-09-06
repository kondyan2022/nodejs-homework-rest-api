const fs = require("fs/promises");
const path = require("path");
const { nanoid } = require("nanoid");

const contactsPath = path.join(__dirname, "contacts.json");
console.log(contactsPath);

const listContacts = async () => {
  const list = await fs.readFile(contactsPath);
  return JSON.parse(list);
};

const getContactById = async (contactId) => {
  const list = await listContacts();
  const contact = list.find((elem) => elem.id === contactId);
  return contact || null;
};

const removeContact = async (contactId) => {
  const list = await listContacts();
  const index = list.findIndex((elem) => elem.id === contactId);
  if (index === -1) {
    return null;
  }
  const [contact] = list.splice(index, 1);
  await fs.writeFile(contactsPath, JSON.stringify(list, null, 2));
  return contact;
};

const addContact = async ({ name, email, phone }) => {
  const list = await listContacts();
  const contact = { id: nanoid(), name, email, phone };
  list.push(contact);
  await fs.writeFile(contactsPath, JSON.stringify(list, null, 2));
  return contact;
};

const updateContact = async (contactId, data) => {
  const list = await listContacts();
  const index = list.findIndex((elem) => elem.id === contactId);
  if (index === -1) {
    return null;
  }
  const contact = { ...list[index], ...data };
  list.splice(index, 1, contact);
  await fs.writeFile(contactsPath, JSON.stringify(list, null, 2));
  return contact;
};

module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
};
