const express = require("express");
const router = express.Router();
const controller = require("../Controllers/CrousalController");
const { upload } = require("../middleware/Multer");
const TokenVerify = require("../middleware/TokenVerify");
const AdminVerify = require("../middleware/AdminVerify");

// --- create
router.post(
  "/create",
  TokenVerify,
  AdminVerify("admin"),
  upload.single("file"),
  controller.createCarousal
);
// ---- update the carousal
router.post(
  "/update/:id",
  TokenVerify,
  AdminVerify("admin"),
  upload.single("file"),
  controller.updateCrusal
);

module.exports = router;
