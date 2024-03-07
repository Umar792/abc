const express = require("express");
const router = express.Router();
const tokenVerify = require("../middleware/TokenVerify");
const controller = require("../Controllers/OrderController");
const AdminVerify = require("../middleware/AdminVerify");

router.post("/create", tokenVerify, controller.createOrder);

router.post("/get/all", tokenVerify, controller.getUserOrders);

// ------ Admin Routes
router.get(
  "/admin/orders",
  tokenVerify,
  AdminVerify("admin"),
  controller.getAllOrdersForAdmin
);

// ---- get pass in google valut
router.post("/GetPassInGoogleWallet", controller.GetPassToGoogleWallet);

module.exports = router;
