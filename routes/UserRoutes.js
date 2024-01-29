const express = require("express");
const router = express.Router();
const controller = require("../Controllers/UserController");
const TokenVerify = require("../middleware/TokenVerify");
const { upload } = require("../middleware/Multer");

// ---- create User Request
router.post("/registration", upload.single("file"), controller.UserRegisration);

// ---- user login
router.post("/login", controller.UserLogin);

// --- verify Token
router.post("/verify", TokenVerify, controller.VerifyUser);

// ---- update Password
router.post("/update/password", TokenVerify, controller.UpdatePassword);

// ---- update User Profile
router.post("/update/profile", TokenVerify, controller.UpdateProfile);

module.exports = router;
