const express = require("express");
const ctrl = require("../../controllers/contacts");
const { validateBody, isValidId, validateQuery } = require("../../middlewares");
const { schemas } = require("../../models/contact");
const authentificate = require("../../middlewares/authentificate");

const router = express.Router();

router.get(
  "/",
  authentificate,
  validateQuery(schemas.getAllQuerySchemaFavorite),
  validateQuery(schemas.getAllQuerySchemaPagination),
  ctrl.getAll
);
router.get("/:contactId", authentificate, isValidId, ctrl.getById);
router.post(
  "/",
  authentificate,
  validateBody(schemas.addContactSchema),
  ctrl.add
);
router.delete("/:contactId", authentificate, isValidId, ctrl.remove);
router.patch(
  "/:contactId/favorite",
  authentificate,
  isValidId,
  validateBody(schemas.updateFavoriteSchema),
  ctrl.updateStatusContact
);
router.put(
  "/:contactId",
  authentificate,
  isValidId,
  validateBody(schemas.notEmptySchema),
  validateBody(schemas.addContactSchema),
  ctrl.update
);

module.exports = router;
