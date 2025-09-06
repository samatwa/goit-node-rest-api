import Contact from "../db/Contact.js";

export const listContacts = (query) => Contact.findAll({ where: query });

export const listContactsPaged = async ({ owner, page, limit, favorite }) => {
  const where = { owner };
  if (typeof favorite !== "undefined") where.favorite = favorite;

  const offset = (page - 1) * limit;

  const { rows, count } = await Contact.findAndCountAll({
    where,
    limit,
    offset,
    order: [["createdAt", "DESC"]],
  });

  return {
    items: rows,
    page,
    limit,
    total: count,
    totalPages: Math.ceil(count / limit),
  };
};

export const getContact = (query) => Contact.findOne({ where: query });

export const removeContact = async (query) => {
  const contact = await getContact(query);
  if (!contact) return null;

  await contact.destroy();
  return contact;
}

export const addContact = ({name, email, phone, owner}) => Contact.create({name, email, phone, owner});

export const updateContact = async (query, payload) => {
  const contact = await getContact(query);
  if (!contact) return null;

  await contact.update(payload);
  return contact;
}

export const updateStatusContact = async (query, {favorite}) => {
  const contact = await getContact(query);
  if (!contact) return null;

  await contact.update({ favorite });
  return contact;
}