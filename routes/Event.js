const express = require("express");
const router = express.Router();
const controller = require("../Controllers/Event");
const TokenVerify = require("../middleware/TokenVerify");
const AdminVerify = require("../middleware/AdminVerify");
const { upload } = require("../middleware/Multer");

router.post(
  "/create",
  TokenVerify,
  AdminVerify("admin"),
  upload.single("file"),
  controller.createEevent
);
router.get("/get", controller.getAllEvents);
router.delete(
  "/delete/:id",
  TokenVerify,
  AdminVerify("admin"),
  controller.deleteEvent
);

module.exports = router;
