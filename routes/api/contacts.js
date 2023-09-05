const express = require("express");
const ctrl = require("../../controllers/contacts");
const validateBody = require("../../middlewares/validateBody");
const { addContactSchema, notEmptySchema } = require("../../schemas/contacts");

const router = express.Router();

router.get("/", ctrl.getAll);
router.get("/:contactId", ctrl.getById);
router.post("/", validateBody(addContactSchema), ctrl.add);
router.delete("/:contactId", ctrl.remove);
router.put(
  "/:contactId",
  validateBody(notEmptySchema),
  validateBody(addContactSchema),
  ctrl.update
);

module.exports = router;
