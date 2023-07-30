const express = require("express");
const router = express.Router();
const ctrl = require("../../controllers/contacts");
const {
  validateBody,
  authenticate,
  isValidId,
} = require("../../middelwares");
const { schemas } = require("../../models/contacts");

router.get("/", authenticate, ctrl.getAll);

router.get("/:id", authenticate, isValidId, ctrl.getById);

router.post(
  "/",
  authenticate,
  validateBody(schemas.addSchemaPost),
  ctrl.addContacts
);

router.put(
  "/:id",
  authenticate,
  isValidId,
  validateBody(schemas.addSchemaPut),
  ctrl.updateContacts
);

router.patch(
  "/:id/favorite",
  isValidId,
  authenticate,
  validateBody(schemas.addSchemaPut),
  ctrl.updateStatusContact
);

router.delete("/:id", authenticate, isValidId, ctrl.deleteContacts);

module.exports = router;
