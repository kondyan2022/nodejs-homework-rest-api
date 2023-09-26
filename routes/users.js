const express = require("express");
const ctrl = require("../controllers/users");
const { validateBody, upload, resizeAvatar } = require("../middlewares");
const { schemas } = require("../models/user");
const authentificate = require("../middlewares/authentificate");

const router = express.Router();

router.post(
  "/register",
  validateBody(schemas.registerSchema),
  ctrl.registration
);
router.post("/login", validateBody(schemas.loginSchema), ctrl.login);
router.get("/current", authentificate, ctrl.getCurrent);
router.post("/logout", authentificate, ctrl.logout);
router.patch(
  "/avatars",
  authentificate,
  upload.single("avatar"),
  resizeAvatar,
  ctrl.updateAvatar
);
router.patch(
  "",
  authentificate,
  validateBody(schemas.subscriptionSchema),
  ctrl.updateUser
);

module.exports = router;
