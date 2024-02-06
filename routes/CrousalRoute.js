const express = require("express");
const router = express.Router();
const controller = require("../Controllers/CrousalController");
const { upload } = require("../middleware/Multer");
const TokenVerify = require("../middleware/TokenVerify");
const AdminVerify = require("../middleware/AdminVerify");

// --- create
router.post(
  "/create",
  upload.single("file"),
  TokenVerify,
  AdminVerify("admin"),
  controller.createCarousal
);
// ---- update the carousal
router.post(
  "/update/:id",
  upload.single("file"),
  TokenVerify,
  AdminVerify("admin"),
  controller.updateCrusal
);

module.exports = router;
