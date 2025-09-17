import * as contactsService from "../services/contactsServices.js";
import HttpError from "../helpers/HttpError.js";

export const getAllContacts = async (req, res, next) => {
  try {
    const { id: owner } = req.user;
    const { page, limit, favorite } = req.query;

    const wantsPaging =
      page !== undefined || limit !== undefined || favorite !== undefined;

    if (wantsPaging) {
      let favFilter;
      if (favorite !== undefined) {
        if (favorite === "true" || favorite === true) favFilter = true;
        else if (favorite === "false" || favorite === false) favFilter = false;
        else return next(HttpError(400, "favorite must be true or false"));
      }

      const pageNum = Math.max(1, Number(page) || 1);
      const limitNum = Math.min(100, Math.max(1, Number(limit) || 20));

      const result = await contactsService.listContactsPaged({
        owner,
        page: pageNum,
        limit: limitNum,
        favorite: favFilter,
      });

      return res.status(200).json(result);
    }

    const contacts = await contactsService.listContacts({ owner });
    return res.status(200).json(contacts);
  } catch (error) {
    next(error);
  }
};

export const getOneContact = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { id: owner } = req.user;
    const contact = await contactsService.getContact({ id, owner });
    if (!contact) {
      throw HttpError(404, "Not found");
    }
    res.status(200).json(contact);
  } catch (error) {
    next(error);
  }
};

export const deleteContact = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { id: owner } = req.user;
    const removed = await contactsService.removeContact({ id, owner });
    if (!removed) {
      throw HttpError(404, "Not found");
    }
    res.status(200).json(removed);
  } catch (error) {
    next(error);
  }
};

export const createContact = async (req, res, next) => {
  try {
    const { id: owner } = req.user;
    const { name, email, phone } = req.body;
    const newContact = await contactsService.addContact({
      name,
      email,
      phone,
      owner,
    });
    res.status(201).json(newContact);
  } catch (error) {
    next(error);
  }
};

export const updateContact = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { id: owner } = req.user;

    if (!id) throw HttpError(400, "Missing id param");
    const contactId = Number(id);
    if (Number.isNaN(contactId)) throw HttpError(400, "Invalid id");

    const updated = await contactsService.updateContact(
      { id: contactId, owner },
      req.body
    );
    if (!updated) throw HttpError(404, "Not found");
    res.status(200).json(updated);
  } catch (error) {
    next(HttpError(404, "Not found"));
  }
};

export const updateStatusContact = async (req, res, next) => {
  try {
    const { contactId } = req.params;
    const { id: owner } = req.user;

    const idNum = Number(contactId);
    if (Number.isNaN(idNum)) throw HttpError(400, "Invalid id");

    const updated = await contactsService.updateStatusContact(
      { id: idNum, owner },
      req.body
    );

    if (!updated) throw HttpError(404, "Not found");
    res.status(200).json(updated);
  } catch (error) {
    next(HttpError(404, "Not found"));
  }
};
