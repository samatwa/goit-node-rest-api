import fs from "node:fs/promises";
import path from "node:path";
import { nanoid } from "nanoid";

const contactsPath = path.resolve("db", "contacts.json");

const updateContacts = (contacts) =>
  fs.writeFile(contactsPath, JSON.stringify(contacts, null, 2));

export async function listContacts() {
  try {
    const data = await fs.readFile(contactsPath, "utf-8");
    return JSON.parse(data);
  } catch (error) {
    console.error("Error reading contacts:", error);
    return [];
  }
}

export async function getContactById(contactId) {
  const contacts = await listContacts();
  const contact = contacts.find((contact) => contact.id === contactId);
  return contact || null;
}

export async function removeContact(contactId) {
  const contacts = await listContacts();
  const index = contacts.findIndex((contact) => contact.id === contactId);
  if (index === -1) {
    return null;
  }
  const [removedContact] = contacts.splice(index, 1);
  await updateContacts(contacts);
  return removedContact;
}

export async function addContact(name, email, phone) {
  const contacts = await listContacts();
  const newContact = {
    id: nanoid(),
    name,
    email,
    phone,
  };
  contacts.push(newContact);
  await updateContacts(contacts);
  return newContact;
}

export async function updateContact(contactId, data) {
  const contacts = await listContacts();
  const index = contacts.findIndex((c) => c.id === contactId);
  if (index === -1) return null;

  contacts[index] = { ...contacts[index], ...data };
  await updateContacts(contacts);
  return contacts[index];
}

export async function updateStatusContact(contactId, {favorite}) {
  const contacts = await listContacts();
  const index = contacts.findIndex((c) => c.id === contactId);
  if (index === -1) return null;

  contacts[index] = { ...contacts[index], favorite };
  await updateContacts(contacts);
  return contacts[index];
}