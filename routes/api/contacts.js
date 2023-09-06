const express = require("express");
const ctrl = require("../../controllers/contacts");
const { validateBody, isValidId } = require("../../middlewares");
const { schemas } = require("../../models/contacts");

const router = express.Router();

router.get("/", ctrl.getAll);
router.get("/:contactId", isValidId, ctrl.getById);
router.post("/", validateBody(schemas.addContactSchema), ctrl.add);
router.delete("/:contactId", isValidId, ctrl.remove);
router.patch(
  "/:contactId/favorite",
  isValidId,
  validateBody(schemas.updateFavoriteSchema),
  ctrl.updateStatusContact
);
router.put(
  "/:contactId",
  isValidId,
  validateBody(schemas.notEmptySchema),
  validateBody(schemas.addContactSchema),
  ctrl.update
);

module.exports = router;
