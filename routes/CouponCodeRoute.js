const express = require("express");
const router = express.Router();
const TokenVerify = require("../middleware/TokenVerify");
const AdminVeerify = require("../middleware/AdminVerify");
const Controller = require("../Controllers/CouponCodeController");

// ---
router.post("/apply", TokenVerify, Controller.ApplyCouponCode);
router.get(
  "/all",
  TokenVerify,
  AdminVeerify("admin"),
  Controller.GetAllCouponCodes
);
router.post(
  "/create",
  TokenVerify,
  AdminVeerify("admin"),
  Controller.CreateCopenCode
);
router.put(
  "/update/:id",
  TokenVerify,
  AdminVeerify("admin"),
  Controller.UpdateCouponCode
);
router.delete(
  "/delete/:id",
  TokenVerify,
  AdminVeerify("admin"),
  Controller.DeleteCouponCode
);

module.exports = router;
