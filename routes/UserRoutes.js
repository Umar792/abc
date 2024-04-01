const express = require("express");
const router = express.Router();
const controller = require("../Controllers/UserController");
const TokenVerify = require("../middleware/TokenVerify");
const { upload } = require("../middleware/Multer");
const AdminVerify = require("../middleware/AdminVerify");

// ---- create User Request
router.post("/registration", upload.single("file"), controller.UserRegisration);

// ---- user login
router.post("/login", controller.UserLogin);

// --- verify Token
router.post("/verify", TokenVerify, controller.VerifyUser);

// ---- update Password
router.post("/update/password", TokenVerify, controller.UpdatePassword);

// ---- update User Profile
router.post(
  "/update/profile",
  TokenVerify,
  upload.single("file"),
  controller.UpdateProfile
);

// ------- get user for admin
router.post(
  "/admin/users",
  TokenVerify,
  AdminVerify("admin"),
  controller.AllUsersForAdmin
);

// --- delete user profile
router.delete(
  "/delete/:id",
  TokenVerify,
  AdminVerify("admin"),
  controller.DeleteUserProfiel
);

// --- role update
router.put(
  "/role/update",
  TokenVerify,
  AdminVerify("admin"),
  controller.RoleUpdate
);

// ------ get client details
router.get("/client/:id", controller.ClientDetails);

// --- send forgot password otp
router.post("/forgot/OTP/send", controller.ForgotPasswordSendOTP);

// ---- reset password
router.post("/resetpassword", controller.ResetPassword);

module.exports = router;
