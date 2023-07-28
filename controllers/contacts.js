const { HttpError, ctrlWrapper } = require("../helpers");

const { Contact } = require("../models/contacts");

const getAll = async (req, res) => {
  const { _id: owner } = req.user;
  const { page = 1, limit = 20, favorite, email, name } = req.query;
  const skip = (page - 1) * limit;
  const query = { owner };

  if (favorite !== undefined) query.favorite = favorite;
  if (email !== undefined) query.email = email;
  if (name !== undefined) query.name = name;

  const result = await Contact.find(query, "-createdAt -updatedAt", {
    skip,
    limit,
  }).populate("owner", "email subscription");

  if (!result) {
    throw HttpError(404);
  }

  res.json(result);
};

const getById = async (req, res) => {
  const { id } = req.params;
  const result = await Contact.findById(id);
  if (!result) {
    throw HttpError(404);
  }
  res.json(result);
};

const addContacts = async (req, res) => {
  const { _id: owner } = req.user;
  const result = await Contact.create({
    ...req.body,
    owner,
  });
  res.status(201).json(result);
};

const deleteContacts = async (req, res) => {
  const { id } = req.params;
  const result = await Contact.findByIdAndRemove(id);
  if (!result) {
    throw HttpError(404);
  }
  res.status(200).json(result);
};

const updateContacts = async (req, res) => {
  const { id } = req.params;
  const result = await Contact.findByIdAndUpdate(id, req.body, {
    new: true,
  });
  if (!result) {
    throw HttpError(404);
  }
  res.json(result);
};

const updateStatusContact = async (req, res) => {
  const { id } = req.params;

  if (!req.body) {
    throw HttpError(400, "missing field favorite");
  }

  const result = await Contact.findByIdAndUpdate(id, req.body, {
    new: true,
  });
  if (!result) {
    throw HttpError(404);
  }
  res.json(result);
};

module.exports = {
  getAll: ctrlWrapper(getAll),
  getById: ctrlWrapper(getById),
  addContacts: ctrlWrapper(addContacts),
  deleteContacts: ctrlWrapper(deleteContacts),
  updateContacts: ctrlWrapper(updateContacts),
  updateStatusContact: ctrlWrapper(updateStatusContact),
};
